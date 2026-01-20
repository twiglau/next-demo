import { FilesOrderByColumn } from "@/server/routes/file";
import { AppRouter, trpcClientReact, trpcPureClient } from "@/utils/api";
import { inferRouterOutputs } from "@trpc/server";
import Uppy from "@uppy/core";
import { ScrollArea } from "../ui/ScrollArea";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";
import { useUppyState } from "@/hooks/use-uppy-state";
import React from "react";
import Image from "next/image";
import { RemoteFileItemWithTags } from "./FileItem";
import { CopyUrlAction, DeleteFileAction, PreviewAction } from "./FileItemAction";



interface FileListProps {
    uppy: Uppy;
    appId: string;
    orderBy: FilesOrderByColumn;
}

// TODO: inferRouterOutputs 是什么意思？
type FileResult = inferRouterOutputs<AppRouter>['file']['infinityQueryFiles'];

const FileList: React.FC<FileListProps> = (props) => {
    const { uppy, appId, orderBy } = props;
    const query = {
        limit: 30,
        appId,
        ...orderBy,
    };

    const { 
        data: infinityQueryData, 
        isPending, 
        fetchNextPage 
    } = trpcClientReact.file.infinityQueryFiles.useInfiniteQuery(query, {
        getNextPageParam: (resp) => resp.nextCursor,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false
    });
    const fileList = infinityQueryData?.pages.reduce<FileResult['items']>((result, page) => {
        return [...result, ...page.items];
    }, []) || [];

    // TODO: 这个 utils 有什么用？
    const utils = trpcClientReact.useUtils();
    const uppyFiles = useUppyState(uppy, (s) => s.files);
    const [uploadingFilesIds, setUploadingFilesIds] = React.useState<string[]>([]);
    const bottomRef = React.useRef<HTMLDivElement|null>(null);

    // 监听底部按钮，加载更多
    React.useEffect(() =>{
        if(bottomRef.current) {
            const observer = new IntersectionObserver((entries) => {
                const entry = entries[0];
                if(entry && entry.intersectionRatio > 0.1) {
                    fetchNextPage();
                }
            }, { threshold: 0.1 });

            observer.observe(bottomRef.current);

            return () => {
                if(bottomRef.current) {
                    observer.unobserve(bottomRef.current);
                }
                observer.disconnect();
            }
        }
    }, [fetchNextPage]);

    // 监听uppy状态
    React.useEffect(() => {
        // 1. success
        const handlerUppySuccess = (file:any, resp: any) => {
            if(file) {
                trpcPureClient.file.saveFile.mutate({
                    name: file.data instanceof File ? file.data.name : 'test',
                    path: resp.uploadURL ?? '',
                    type: file.data.type,
                    appId,
                })
                .then((resp) => {
                    utils.file.infinityQueryFiles.setInfiniteData(query, (prev) => {
                        if(!prev) return prev;

                        return {
                            ...prev,
                            pages: prev.pages.map((page,index) => {
                                if(index === 0) {
                                    return {
                                        ...page,
                                        items: [resp, ...page.items]
                                    };
                                }
                                return page;
                            }),
                            pageParams: prev.pageParams
                        }
                    })
                })
            }
        }

        // 2. progress
        const handlerUppyProgress = (_:any, resp: any) => {
            setUploadingFilesIds((currentFiles) => [
                ...currentFiles,
                ...resp.map((file:any) => file.id)
            ])
        }

        // 3. complete
        const handlerUppyComplete = () => {
            setUploadingFilesIds([]);
        }
        
        uppy.on('upload-success', handlerUppySuccess);
        uppy.on('complete', handlerUppyComplete);
        uppy.on('upload', handlerUppyProgress)

        return () => {
            uppy.off('upload-success', handlerUppySuccess);
            uppy.off('complete', handlerUppyComplete);
            uppy.off('upload', handlerUppyProgress)
        };
    }, [uppy]);

    const handlerFileDelete = (fileId: string) => {
        utils.file.infinityQueryFiles.setInfiniteData(query, (prev) => {
            if(!prev) return prev;
            return {
                ...prev,
                pages: prev.pages.map((page,index) => {
                    if(index === 0) {
                        return {
                            ...page,
                            items: page.items.filter((item) => item.id !== fileId)
                        }
                    }
                    return page;
                }),
                pageParams: prev.pageParams
            }
        })
    }

    const fileListElements = fileList?.map((file) => {
        return (
            <RemoteFileItemWithTags
            key={file.id}
            id={file.id}
            name={file.name}
            contentType={file.contentType}
            >
                {/* TODO: props 是什么用法？ */}
                {(props) => {
                    const { setPreview } = props;
                    return (
                        <div
                        className="w-full h-full cursor-pointer absolute inset-0 bg-background/30 justify-center items-center flex opacity-0 hover:opacity-100 transition-opacity duration-200"
                        >
                            <CopyUrlAction url={`${location.host}/image/${file.id}`} />
                            <DeleteFileAction fileId={file.id} onDeleteSuccess={handlerFileDelete} />
                            <PreviewAction onClick={() => setPreview(true)} />
                        </div>
                    )
                }}

            </RemoteFileItemWithTags>

        )
    });


    return (
        <ScrollArea
          className="h-full w-full @container"
          onScrollEnd={() => { fetchNextPage(); }}
        >
            {isPending && <div className="text-center">Loading...</div>}
            <div
             className={cn(
                'grid @sm:grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4 relative container'
             )}
            >
                {uploadingFilesIds.length > 0 && uploadingFilesIds.map((fileId) => {
                    const file = uppyFiles[fileId];
                    if (!file || !(file.data instanceof Blob)) return null;
                    const isImage = file.data.type.startsWith('image');
                    const url = URL.createObjectURL(file.data);
                    return (
                        <div
                         key={fileId}
                         className="flex justify-center items-center border border-red-500"
                        >
                            { isImage ? (
                                <img src={url} alt="file" />
                            ):(
                                <Image 
                                width={100}
                                height={100}
                                className="w-full"
                                src="/file.png"
                                alt="unknow file type"
                                />
                            ) }
                        </div>
                    )
                })}
                {fileListElements}
            </div>
            <div ref={bottomRef} className="flex justify-center p-8">
                <Button
                  variant="ghost"
                  onClick={() => { fetchNextPage(); }}
                >
                    Load Next Page
                </Button>
            </div>
            
        </ScrollArea>
    )
}

export { FileList }