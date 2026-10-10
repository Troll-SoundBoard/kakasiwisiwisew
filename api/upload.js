import { handleUpload } from "@vercel/blob/client";

export default async function handler(req, res) {
  try {
    const json = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (clientPayload !== process.env.APP_PASSWORD) throw new Error("Wrong password");
        return { addRandomSuffix: true };
      },
      onUploadCompleted: async () => {},
    });
    res.status(200).json(json);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}
