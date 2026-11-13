// Registra una visita: fecha/hora, IP, ubicación aproximada (geo de Netlify) y navegador.
import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  let body = {};
  try { body = await req.json(); } catch { /* cuerpo vacío */ }

  const g = context.geo || {};
  const now = new Date();
  const rec = {
    t: now.toISOString(),
    ip: context.ip || req.headers.get("x-nf-client-connection-ip") || "",
    city: g.city || "",
    region: g.subdivision?.name || "",
    country: g.country?.name || "",
    cc: g.country?.code || "",
    tz: g.timezone || "",
    lat: g.latitude ?? null,
    lon: g.longitude ?? null,
    ua: (req.headers.get("user-agent") || "").slice(0, 300),
    lang: (req.headers.get("accept-language") || "").split(",")[0],
    ref: String(body.ref || "").slice(0, 300),
    path: String(body.path || "/").slice(0, 200),
    screen: String(body.screen || "").slice(0, 20),
  };

  const store = getStore({ name: "visits", consistency: "strong" });
  const key = `v/${rec.t}-${Math.random().toString(36).slice(2, 8)}`;
  await store.setJSON(key, rec);

  const counter = (await store.get("meta/counter", { type: "json" })) || { total: 0 };
  counter.total = (counter.total || 0) + 1;
  await store.setJSON("meta/counter", counter);

  return Response.json({ ok: true, total: counter.total });
};

export const config = { path: "/api/track" };
