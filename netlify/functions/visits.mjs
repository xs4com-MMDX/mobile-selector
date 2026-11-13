// Panel privado: lista de visitas. Requiere la contraseña guardada en la
// variable de entorno ADMIN_PASSWORD (Netlify > Site configuration > Environment variables).
import { getStore } from "@netlify/blobs";
import { timingSafeEqual, createHash } from "node:crypto";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const hash = (s) => createHash("sha256").update(String(s)).digest();

export default async (req) => {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return Response.json({ error: "Falta configurar la variable ADMIN_PASSWORD en Netlify." }, { status: 500 });
  }
  const given = req.headers.get("x-admin-password") || "";
  if (!timingSafeEqual(hash(given), hash(expected))) {
    await sleep(800); // frena intentos de fuerza bruta
    return Response.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const store = getStore({ name: "visits", consistency: "strong" });

  if (req.method === "DELETE") {
    const { blobs } = await store.list({ prefix: "v/" });
    for (let i = 0; i < blobs.length; i += 50) {
      await Promise.all(blobs.slice(i, i + 50).map((b) => store.delete(b.key)));
    }
    await store.setJSON("meta/counter", { total: 0 });
    return Response.json({ ok: true, deleted: blobs.length });
  }

  const url = new URL(req.url);
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "500", 10) || 500, 1), 5000);

  const { blobs } = await store.list({ prefix: "v/" });
  const keys = blobs.map((b) => b.key).sort().reverse();
  const slice = keys.slice(0, limit);

  const visits = [];
  for (let i = 0; i < slice.length; i += 50) {
    const batch = await Promise.all(slice.slice(i, i + 50).map((k) => store.get(k, { type: "json" })));
    visits.push(...batch.filter(Boolean));
  }
  const counter = (await store.get("meta/counter", { type: "json" })) || { total: 0 };

  return Response.json(
    { total: counter.total || 0, stored: keys.length, returned: visits.length, visits },
    { headers: { "Cache-Control": "no-store" } }
  );
};

export const config = { path: "/api/visits" };
