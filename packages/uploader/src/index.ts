import { Uppy, type UppyFile, type Meta, type Body } from "@uppy/core";
import AwsS3, { AwsS3UploadParameters } from "@uppy/aws-s3";

type Options = {
  getUploadParameters: (
    file: UppyFile<Meta, Body>,
  ) => Promise<AwsS3UploadParameters>;
};

export function createUploader(options: Options) {
  const uppy = new Uppy();
  uppy.use(AwsS3, {
    shouldUseMultipart: false,
    getUploadParameters: options.getUploadParameters,
  });

  return uppy;
}
