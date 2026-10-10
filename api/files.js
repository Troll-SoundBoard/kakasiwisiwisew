import { list, del } from "@vercel/blob";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { blobs } = await list({ limit: 1000 });
      return res.json(
        blobs
          .map((b) => ({
            url: b.url,
            downloadUrl: b.downloadUrl,
            name: b.pathname
              .replace(/^\d+-/, "")
              .replace(/-[A-Za-z0-9]{20,}(?=\.[^./]*$|$)/, ""),
            size: b.size,
            at: b.uploadedAt,
          }))
          .sort((a, b) => new Date(b.at) - new Date(a.at))
      );
    }
    if (req.method === "DELETE") {
      await del(req.query.url);
      return res.json({ ok: true });
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
