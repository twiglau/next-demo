import { Uppy, type UppyFile, type Meta, type Body } from "@uppy/core";
import { AwsS3UploadParameters } from "@uppy/aws-s3";
type Options = {
    getUploadParameters: (file: UppyFile<Meta, Body>) => Promise<AwsS3UploadParameters>;
};
export declare function createUploader(options: Options): Uppy<Meta, Record<string, never>>;
export {};
