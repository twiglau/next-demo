import { createApiClient } from "@image-sass/api";

const apiKey = "faae7d14-273b-460e-9e2c-0c8b490903cf";

export default defineEventHandler(async (event) => {
  const client = createApiClient({ apiKey });

  const url = "http://localhost:3000/api/open/file.createPresignedUrl?batch=1";

  const payload = {
    "0": {
      filename: "test.jpg",
      contentType: "image/jpeg",
      size: 1024,
      appId: "7c696a30-2b74-4f68-8cb2-c40d5eb33866",
    },
  };

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  const response = await client.file.createPresignedUrl.mutate({
    filename: "test.jpg",
    contentType: "image/jpeg",
    size: 1024,
    appId: "7c696a30-2b74-4f68-8cb2-c40d5eb33866",
  });

  console.log(response);
  return response;
});
