<template>
  <div ref="containerRef"></div>
</template>
<script setup lang="ts">
import { createApiClient } from "@image-sass/api";
import { onMounted, watchEffect, ref } from "vue";
import { UploadButton } from "@image-sass/upload-button";
import { render, h } from "preact";

const containerRef = ref();

watchEffect(() => {
  if (containerRef.value) {
    render(
      h(UploadButton, {
        onClick: () => {
          console.log("click");
        },
        children: "Upload",
      }),
      containerRef.value,
    );
  }
});

onMounted(async () => {
  const tokenResp = await $fetch("/api/test");
  console.log(tokenResp);

  const client = createApiClient({ signedToken: tokenResp });

  const response = await client.file.createPresignedUrl.mutate({
    filename: "test.jpg",
    contentType: "image/jpeg",
    size: 1024,
    appId: "7c696a30-2b74-4f68-8cb2-c40d5eb33866",
  });

  console.log(response);
});
</script>
