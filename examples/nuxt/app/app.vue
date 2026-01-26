<template>
  <div>
    <VueUploadButton :uploader="uploader" @file-uploaded="onFileUploaded">
      上传图片
    </VueUploadButton>
    <img :src="imageUrl" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { createApiClient } from "@image-sass/api";
import { ButtonWithUploader } from "@image-sass/upload-button";
import { connect } from "@image-sass/preact-vue-connect";
import { createUploader } from "@image-sass/uploader";

const VueUploadButton = connect(ButtonWithUploader);

const imageUrl = ref("");

const uploader = createUploader({
  async getUploadParameters(file) {
    const tokenResp = await $fetch("/api/test");

    const client = createApiClient({ signedToken: tokenResp as any });
    return client.file.createPresignedUrl.mutate({
      filename: file.data instanceof File ? file.data.name : "",
      contentType: file.data instanceof File ? file.data.type || "" : "",
      size: file.size || 1024,
    });
  },
});

function onFileUploaded(url: string) {
  imageUrl.value = url;
}
</script>
