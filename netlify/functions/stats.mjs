// Contador público: solo devuelve el número total de visitas.
import { getStore } from "@netlify/blobs";

export default async () => {
  const store = getStore({ name: "visits", consistency: "strong" });
  const counter = (await store.get("meta/counter", { type: "json" })) || { total: 0 };
  return Response.json({ total: counter.total || 0 }, { headers: { "Cache-Control": "no-store" } });
};

export const config = { path: "/api/stats" };
