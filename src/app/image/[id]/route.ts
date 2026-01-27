import { db } from "@/server/db/db";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { TRPCError } from "@trpc/server";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params;
  const file = await db.query.files.findFirst({
    where: (files, { eq }) => eq(files.id, id),
    with: {
      app: {
        with: {
          storage: true,
        },
      },
    },
  });

  if (!file?.app?.storage) {
    throw new TRPCError({ code: "BAD_REQUEST" });
  }
  if (!file || !file.contentType.startsWith("image")) {
    return new NextResponse("", { status: 400 });
  }

  const app = file.app;

  if (app.storage == null) {
    throw new TRPCError({
      code: "BAD_REQUEST",
    });
  }

  const command = new GetObjectCommand({
    Bucket: app.storage.configuration.bucket,
    Key: decodeURIComponent(file.path),
  });

  const client = new S3Client({
    region: app.storage.configuration.region,
    endpoint: app.storage.configuration.apiEndPoint,
    credentials: {
      accessKeyId: app.storage.configuration.accessKeyId,
      secretAccessKey: app.storage.configuration.secretAccessKey,
    },
  });

  const response = await client.send(command);

  if (!response.Body) {
    return new NextResponse("", { status: 400 });
  }

  const bytes = await response.Body.transformToByteArray();

  const image = sharp(bytes);

  const { searchParams } = new URL(request.url);

  const width = searchParams.get("width");
  const rotate = searchParams.get("rotate");

  image.resize({
    width: width ? parseInt(width) : 250,
    fit: "inside",
    withoutEnlargement: true,
  });

  image.rotate(rotate ? parseInt(rotate) : 0);

  const buffer = await image.webp().toBuffer();
  const uint8Array = new Uint8Array(buffer);

  return new NextResponse(uint8Array, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};

export { GET };
