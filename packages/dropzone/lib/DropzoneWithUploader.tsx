import { useEffect } from "preact/hooks";
import { Dropzone, type DropzoneProps } from ".";
import { Uppy, type UppyFile, type Meta, type Body, type UppyEventMap } from "@uppy/core";

type UploadSuccessCallback<M extends Meta, B extends Body> = UppyEventMap<M, B>['upload-success']
type UploadCompleteCallback<M extends Meta, B extends Body> = UppyEventMap<M, B>['complete']

type DropzoneUploaderProps = {
    uploader: Uppy
    onFileUploaded:(url:string, file: UppyFile<Meta, Body>) => void
} & DropzoneProps

export function DropzoneWithUploader({
    uploader,
    onFileUploaded,
    ...dropzoneProps
}: DropzoneUploaderProps) {

    useEffect(() => {

        const successCallback: UploadSuccessCallback<Meta, Body> = (file:any, resp:any) => {
            onFileUploaded(resp.uploadURL, file);
        }
        const completeCallback: UploadCompleteCallback<Meta, Body> = () => {
        }
        uploader.on("upload-success", successCallback);
        uploader.on('complete', completeCallback);

        return () => {
            uploader.off("upload-success", successCallback);
            uploader.off('complete', completeCallback);
        }
    })


    const handleFileChoosed = (files: File[]) => {
        uploader.addFiles(
            files.map((file) => ({
            name: file.name,
            data: file,
            })),
        );
        uploader.upload();
    };


  return <Dropzone {...dropzoneProps} onFileChoosed={handleFileChoosed}  />;
}