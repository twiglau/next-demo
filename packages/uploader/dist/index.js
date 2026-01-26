import { Uppy } from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
export function createUploader(options) {
    const uppy = new Uppy();
    uppy.use(AwsS3, {
        shouldUseMultipart: false,
        getUploadParameters: options.getUploadParameters,
    });
    return uppy;
}
