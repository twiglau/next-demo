
'use client';
import { trpcClientReact, trpcPureClient } from "@/utils/api";
import AWS3 from "@uppy/aws-s3";
import Uppy from "@uppy/core";
import React, { ReactNode } from "react";
import { usePasteFile } from "@/app/hooks/usePasteFile";
import { FilesOrderByColumn } from "@/server/routes/file";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { MoveDown, MoveUp, Settings } from "lucide-react";
import { UploadButton } from "@/components/feature/UploadButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import Dropzone from "@/components/feature/Dropzone";
import { cn } from "@/lib/utils";
import { FileList } from '@/components/feature/FileList';
import UploadPreview from "@/components/feature/UploadPreview";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/Dialog";
import { ImageUrlMaker } from "./ImageUrlMaker";


interface AppPageProps {
    params: Promise<{appId: string}>;
    searchParams: Promise<{[key: string]: string | string[] | undefined}>;
}

export default function AppPage(props: AppPageProps) {
    const {appId} = React.use(props.params);
    const { data: apps, isPending } = trpcClientReact.apps.listApps.useQuery(
        undefined, 
        {
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false
    });
    const currentApp = apps?.find(app => app.id === appId);
    

    const uppy = React.useMemo(() => {
        const uppy = new Uppy();

        uppy.use(AWS3, {
            shouldUseMultipart: false,
            getUploadParameters: (file) => {
                return trpcPureClient.file.createPresignedUrl.mutate({
                    filename: file.data instanceof File ? file.data.name : '',
                    contentType: file.data instanceof File ? file.data.type || '' : '',
                    size: file.size || 0,
                    appId
                })
            }
        });

        return uppy;
    }, []);

    usePasteFile({
        onFilePaste: (files: File[]) => {
            uppy.addFiles(files.map((file:any) => ({
                name: file.name,
                data: file,
            })));
        }
    });

    const [orderBy, setOrderBy] = React.useState<Exclude<FilesOrderByColumn, undefined>>({
        field: 'createdAt',
        order: 'desc'
    });

    const [makingUrlImageId, setMakingUrlImageId] = React.useState<string | null>(null);


    let children: ReactNode;

    if(isPending) {
        children = (
            <div className="flex justify-center items-center">Loading...</div>
        )
    } else if(currentApp == null) {
        children = (
            <div className="size-[50vh] flex flex-col mt-10 p-4 border rounded-md mx-auto items-center">
                <p className="text-lg">App not found</p>
                <p className="text-sm">Choose another one</p>
                <div className="flex flex-col gap-4 items-center">
                    {apps?.map(app => (
                        <Button key={app.id} asChild variant="link">
                            <Link href={`/dashboard/apps/${app.id}`}>{app.name}</Link>
                        </Button>
                    ))}
                </div>
            </div>
        );
    } else {
        children = (
            <div className="h-full">
                <div className="container mx-auto flex justify-between items-center h-[60px]">
                    <Button 
                    onClick={() => {
                        setOrderBy((current) => ({
                            ...current,
                            order: current.order === 'desc' ? 'asc': 'desc'
                        }))
                    }}
                    >
                       Created At { orderBy.order === 'desc' ? <MoveUp />: <MoveDown />}
                    </Button>
                    <div className="flex items-center gap-2">
                        <UploadButton variant='outline'  uppy={uppy} />
                        <Button asChild>
                            <Link href={`/dashboard/apps/new`}>New App</Link>
                        </Button>
                        <Button asChild>
                            <Link href={`/dashboard/apps/${appId}/setting/storage`}>
                              <Settings />
                            </Link>
                        </Button>
                    </div>
                </div>
                {/* 下面内容 */}
                <div className="container mx-auto mb-5">
                    <Tabs defaultValue="all">
                        <TabsList>
                            {[['all','全部'],['people','人物'],['area','地点'],['password','事务']].map(item => (
                                <TabsTrigger key={item[0]} value={item[0]}>{item[1]}</TabsTrigger>
                            ))}
                        </TabsList>
                        <TabsContent value="all">
                            <Dropzone uppy={uppy} className="w-full h-[calc(100% - 60px)]">
                                {(draggling) => {
                                    return (
                                        <div className={cn(
                                            'flex flex-wrap gap-4 relative h-full container mx-auto',
                                            draggling && 'border border-dashed'
                                        )}>
                                            {draggling && (
                                                <div className="absolute inset-0 bg-secondary/50 z-10 flex justify-center items-center ">
                                                    Drop File Here To Upload
                                                </div>
                                            )}
                                            <FileList appId={appId} orderBy={orderBy} uppy={uppy} onMakeUrl={setMakingUrlImageId} />
                                        </div>
                                    )
                                }}
                            </Dropzone>
                            <UploadPreview uppy={uppy} />
                            <Dialog open={!!makingUrlImageId} onOpenChange={e => {
                                if(!e) {
                                    setMakingUrlImageId(null);
                                }
                            }}>
                                <DialogContent>
                                    <DialogTitle>Make Image URL</DialogTitle>
                                    {makingUrlImageId && (
                                        <ImageUrlMaker id={makingUrlImageId} />
                                    )}
                                </DialogContent>
                            </Dialog>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        )
            
    }

    return children;
}