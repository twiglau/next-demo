<template>
  <div>
    <VueUploadButton
      className="upload-button"
      :uploader="uploader"
      @file-uploaded="onFileUploaded"
    >
      上传图片
    </VueUploadButton>
    <img :src="imageUrl" />
    <VueDropzone
      className="dropzone"
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
<style>
html,
body {
  margin: 0;
  padding: 0;
}

.upload-button {
  appearance: none;
  padding: 8px;
  border: 0;
  border-radius: 4px;
  background: #030303;
  color: #efefef;
  cursor: pointer;
}

.upload-button:hover {
  background: #222222;
  color: #efefef;
}

.dropzone {
  border-style: dashed;
  border-width: 2px;
  width: 50vw;
  height: 50vh;
}

.dropzone-inner {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}

.dropzone-inner.dragging {
  background: #e6abab;
}
</style>
