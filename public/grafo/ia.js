/* ═══════════════════════════════════════════════════════════════════
   /grafo/ia.js · el puente a la IA gratuita de koisamsa.com
   Las piezas del grafo se escribieron como artifacts de claude.ai y piden
   `window.claude.use("sample")`. En claude.ai ese objeto existe y responde
   Claude. En la web no existe: este archivo lo crea con la misma forma y
   lo conecta a /api/ia (Mistral, Llama 3.3 o Qwen 3, en plan gratuito).

   Solo actúa si no hay un `window.claude` de verdad: en claude.ai no toca nada.
   El modelo sale de opciones.modelo, de un <select id="modelo"> de la página
   o, por defecto, Mistral.
   Uso: <script src="/grafo/ia.js"></script>, antes del resto de scripts.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  if (window.claude) return;

  function falla(code, message) { var e = new Error(message || code); e.code = code; e.message = message || code; return e; }

  function modeloDe(opciones) {
    if (opciones && opciones.modelo) return opciones.modelo;
    var s = document.getElementById('modelo');
    return s && s.value ? s.value : 'mistral';
  }

  function sample(input, opciones) {
    opciones = opciones || {};
    return fetch('/api/ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: input, modelo: modeloDe(opciones), temperatura: opciones.temperatura }),
      signal: opciones.signal
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok) throw falla(d.code || (r.status === 429 ? 'rate_limited' : 'upstream_error'), d.message);
        var text = String(d.text || '');
        if (!text) throw falla('empty_completion', 'El modelo no devolvió nada.');
        if (typeof opciones.onText === 'function') { try { opciones.onText({ text: text, delta: text }); } catch (e) {} }
        return { text: text, truncated: false, modelo: d.modelo, proveedor: d.proveedor };
      });
    }, function (e) {
      if (e && e.name === 'AbortError') throw falla('cancelled', 'Cancelado.');
      throw falla('upstream_error', 'No hay conexión con la IA.');
    });
  }

  // La misma respuesta, leída como JSON: el primer objeto o lista que aparezca
  sample.json = function (input, opciones) {
    return sample(input, opciones).then(function (r) {
      var t = r.text.replace(/^```(?:json)?\s*|\s*```$/g, '');
      var i = t.search(/[\[{]/), j = Math.max(t.lastIndexOf('}'), t.lastIndexOf(']'));
      try { return JSON.parse(i >= 0 && j > i ? t.slice(i, j + 1) : t); }
      catch (e) { var f = falla('invalid_json', 'La respuesta no es JSON.'); f.text = r.text; throw f; }
    });
  };
  sample.limits = function () { return Promise.resolve({ images: false, tools: false }); };

  window.claude = {
    web: true,   // marca: aquí responde la IA gratuita de la web, no Claude
    use: function (nombre) { return Promise.resolve(nombre === 'sample' ? sample : null); }
  };
})();
