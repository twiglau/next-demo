<template>
  <div>
    <VueUploadButton :uploader="uploader" @file-uploaded="onFileUploaded">
      上传图片
    </VueUploadButton>
    <img :src="imageUrl" />
    <VueDropzone
      @dragging-change="onDraggingChanged"
      :uploader="uploader"
      @file-uploaded="onFileUploaded"
    >
      <div :className="dropzoneInnerClass">
        {{ dragging ? "Drop Here to Upload" : "Drag File Here" }}
      </div>
    </VueDropzone>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { createApiClient } from "@image-sass/api";
import { ButtonWithUploader } from "@image-sass/upload-button";
import { connect } from "@image-sass/preact-vue-connect";
import { createUploader } from "@image-sass/uploader";
import { DropzoneWithUploader } from "@image-sass/dropzone";

const VueUploadButton = connect(ButtonWithUploader);
const VueDropzone = connect(DropzoneWithUploader);

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

const dragging = ref(false);
function onDraggingChanged(isDragging: boolean) {
  dragging.value = isDragging;
}

const dropzoneInnerClass = computed(() => {
  return dragging.value ? "dropzone-inner dragging" : "dropzone-inner";
});
</script>
