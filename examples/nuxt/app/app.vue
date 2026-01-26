<template>
  <div>
    <VueUploadButton @file-choosed="handleFileChoosed">
      上传图片
    </VueUploadButton>
  </div>
</template>
<script setup lang="ts">
import { createApiClient } from "@image-sass/api";
import { UploadButton } from "@image-sass/upload-button";
import { connect } from "@image-sass/preact-vue-connect";
import { createUploader } from "@image-sass/uploader";

const VueUploadButton = connect(UploadButton);

const uploader = createUploader({
  async getUploadParameters(file) {
    const tokenResp = await $fetch("/api/test");
    console.log("tokenResp", tokenResp);
    const client = createApiClient({ signedToken: tokenResp as any });
    const response = await client.file.createPresignedUrl.mutate({
      filename: file.name || "test.jpg",
      contentType: file.type || "image/jpeg",
      size: file.size || 1024,
    });

    return {
      method: "PUT",
      url: response.url,
      fields: {},
      headers: (response as any).headers || {},
    };
  },
});

const handleFileChoosed = (files: File[]) => {
  uploader.addFiles(
    files.map((file) => ({
      name: file.name,
      data: file,
    })),
  );
  uploader.upload();
};
</script>
