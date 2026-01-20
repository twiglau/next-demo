import React from "react";
import ImageReview from '../ui/ImageReview'
import Image from "next/image";

// TODO: 这个  React.Dispatch<React.SetStateAction<boolean>> 是什么意思？
type PreviewChildren = (options: {
    setPreview: React.Dispatch<React.SetStateAction<boolean>>;
}) => React.ReactNode;

interface FileItemProps {
    url: string | null;
    name: string;
    isImage: boolean;
    children?: PreviewChildren;
}


const FileItem: React.FC<FileItemProps> = (props) => {
    const { url, name, isImage, children } = props;
    const [preview, setPreview] = React.useState(false);
    if(url == null) return null;

    return (
        <div className="flex justify-center items-center border relative">
            {isImage ? (
                <ImageReview
                    src={url}
                    alt={name}
                    preview={{
                        zIndex: 999,
                        visible: preview,
                        imageRender(res: any) {
                            const { props: imageProps } = res;
                            return (
                                <img 
                                {...(imageProps as any)}
                                src={`${(imageProps as any).src}?_width=${1000}&_height=${1000}`}
                                />
                            );
                        },
                        onVisibleChange(visible:boolean) {
                            if(!visible) {
                                setPreview(false);
                            }
                        }
                    }}
                />
            ):(
                <Image
                width={100}
                height={100}
                className="w-full"
                src="/file.png"
                alt="unknow file type"
                />
            )}
            {children && children({ setPreview })}
        </div>
    )
}

const RemoteFileItemWithTags = (option: {
    contentType: string;
    id: string;
    name: string;
    tags?: Array<{ id: string; name: string; color: string }>;
    children?: PreviewChildren;
}) => {
    const { contentType, id, name, tags, children } = option;
    const isImage = contentType.startsWith('image');
    const imageUrl = `/image/${id}`;
    return (
        <FileItem url={imageUrl} name={name} isImage={isImage}>
            {children}
        </FileItem>
    )
}

export { RemoteFileItemWithTags }