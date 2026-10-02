/* ═══════════════════════════════════════════════════════════════════
   /api/ia · la IA gratuita de koisamsa.com
   La usan el buscador del grafo y La habitación de la entropía (N09.a1),
   a través de /grafo/ia.js, que imita la capacidad `sample` de claude.ai.

   POST { input, modelo?, temperatura? }  ->  { text, modelo, proveedor }
     input  : texto, o turnos [{ role: "user" | "assistant", content }]
     modelo : "mistral" (por defecto) · "llama" · "qwen"

   Proveedores, todos en plan gratuito:
   · Mistral: la API de Mistral (UE) si existe el secreto MISTRAL_API_KEY;
     si no hay clave, o si responde con límite o error, Mistral Small 3.1
     en Workers AI (Cloudflare).
   · Llama 3.3 y Qwen 3: Workers AI, con el binding AI de wrangler.jsonc
     (gratuito con tope diario; no necesita clave).
   El modelo corre siempre en el proveedor: nunca en local.
   ═══════════════════════════════════════════════════════════════════ */
import type { APIRoute } from 'astro';

export const prerender = false;

const WORKERS_AI: Record<string, string> = {
  mistral: '@cf/mistralai/mistral-small-3.1-24b-instruct',
  llama: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  qwen: '@cf/qwen/qwen3-30b-a3b-fp8',
};
const NOMBRE: Record<string, string> = {
  mistral: 'Mistral Small',
  llama: 'Llama 3.3',
  qwen: 'Qwen 3',
};

const MAX_ENTRADA = 16000;      // caracteres por petición
const MAX_SALIDA = 700;         // tokens de respuesta
const POR_MINUTO = 60;          // peticiones por visitante y minuto (cada copista es una)

// Límite por visitante, de mejor esfuerzo: vive en la memoria de cada instancia del Worker
const visitas = new Map<string, number[]>();
function demasiadas(ip: string): boolean {
  const ahora = Date.now();
  const v = (visitas.get(ip) || []).filter((t) => ahora - t < 60_000);
  v.push(ahora);
  visitas.set(ip, v);
  if (visitas.size > 5000) visitas.clear();
  return v.length > POR_MINUTO;
}

type Turno = { role: 'user' | 'assistant' | 'system'; content: string };

function aTurnos(input: unknown): Turno[] | null {
  if (typeof input === 'string') return input.trim() ? [{ role: 'user', content: input }] : null;
  if (!Array.isArray(input) || !input.length) return null;
  const t = input
    .filter((x) => x && typeof x.content === 'string' && (x.role === 'user' || x.role === 'assistant'))
    .map((x) => ({ role: x.role, content: x.content })) as Turno[];
  return t.length && t[t.length - 1].role === 'user' ? t : null;
}

// Qwen 3 razona en voz alta entre <think>…</think>: eso no es la respuesta
const limpia = (s: string) => s.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

async function conMistralApi(clave: string, turnos: Turno[], temperatura: number) {
  const r = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${clave}` },
    body: JSON.stringify({ model: 'mistral-small-latest', messages: turnos, max_tokens: MAX_SALIDA, temperature: temperatura }),
  });
  if (!r.ok) throw new Error(`mistral ${r.status}`);
  const d: any = await r.json();
  return limpia(String(d?.choices?.[0]?.message?.content ?? ''));
}

async function conWorkersAi(ai: any, modelo: string, turnos: Turno[], temperatura: number) {
  // Qwen 3 razona antes de contestar y el razonamiento se come la respuesta:
  // se apaga con su propio interruptor (/no_think) y se le da más margen
  const qwen = modelo === 'qwen';
  const mensajes = qwen
    ? turnos.map((t, i) => (i === turnos.length - 1 ? { ...t, content: t.content + '\n\n/no_think' } : t))
    : turnos;
  const d: any = await ai.run(WORKERS_AI[modelo], { messages: mensajes, max_tokens: qwen ? MAX_SALIDA * 3 : MAX_SALIDA, temperature: temperatura });
  const texto = d?.response ?? d?.choices?.[0]?.message?.content ?? '';
  return limpia(typeof texto === 'string' ? texto : JSON.stringify(texto));
}

const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request, locals }) => {
  const env: any = (locals as any)?.runtime?.env ?? {};
  const ip = request.headers.get('cf-connecting-ip') || 'anon';
  if (demasiadas(ip)) return json({ code: 'rate_limited', message: 'Demasiadas peticiones seguidas.' }, 429);

  let cuerpo: any;
  try { cuerpo = await request.json(); } catch { return json({ code: 'invalid_request', message: 'El cuerpo no es JSON.' }, 400); }
  const turnos = aTurnos(cuerpo?.input);
  if (!turnos) return json({ code: 'invalid_request', message: 'Falta el texto.' }, 400);
  if (turnos.reduce((n, t) => n + t.content.length, 0) > MAX_ENTRADA) return json({ code: 'prompt_too_large', message: 'Texto demasiado largo.' }, 413);

  const modelo = cuerpo?.modelo in WORKERS_AI ? cuerpo.modelo : 'mistral';
  const t = Number(cuerpo?.temperatura);
  const temperatura = Number.isFinite(t) ? Math.min(Math.max(t, 0), 1.5) : 0.7;

  try {
    if (modelo === 'mistral' && env.MISTRAL_API_KEY) {
      try {
        const text = await conMistralApi(env.MISTRAL_API_KEY, turnos, temperatura);
        if (text) return json({ text, modelo: NOMBRE.mistral, proveedor: 'Mistral AI' });
      } catch { /* límite o error de Mistral: se pasa a Workers AI */ }
    }
    if (!env.AI) return json({ code: 'upstream_error', message: 'La IA no está conectada en este despliegue.' }, 503);
    const text = await conWorkersAi(env.AI, modelo, turnos, temperatura);
    if (!text) return json({ code: 'empty_completion', message: 'El modelo no devolvió nada.' }, 502);
    return json({ text, modelo: NOMBRE[modelo], proveedor: 'Cloudflare Workers AI' });
  } catch (e: any) {
    const tope = /limit|quota|429|exceeded/i.test(String(e?.message));
    return json({ code: tope ? 'rate_limited' : 'upstream_error', message: tope ? 'Se ha agotado el tope gratuito de hoy.' : 'El modelo no responde.' }, tope ? 429 : 502);
  }
};
