import jwt from "jsonwebtoken";

const apiKey = "faae7d14-273b-460e-9e2c-0c8b490903cf";
const clientId = "a2d3283f-f39f-448e-a530-9ebf3d83c987";

export default defineEventHandler(async (event) => {
  const token = jwt.sign(
    {
      filename: "test.jpg",
      contentType: "image/jpeg",
      size: 1024,
      clientId,
    },
    apiKey,
    { expiresIn: "1d" },
  );

  return token;
});

async function test() {
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
}
