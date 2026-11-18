/* lab-minis.js · v1.112 (17-nov-2026) · las nueve miniaturas animadas de /lab.
   Cada artefacto del Lab resume en un lienzo lo que hace por dentro: las «pequeñas animaciones del contenido» que Koi
   hizo en marzo-abril para el grid de WordPress (cinco) y las cuatro del 17-nov, en el mismo idioma.
   Se carga solo al abrir la portada de Lab; index.html llama a window.labMinis() cuando las teselas están pintadas.
   Reglas: una rutina muere sola cuando su lienzo deja de estar en la página (la portada se vuelve a pintar); espera sin
   dibujar mientras su tesela no se ve; con «movimiento reducido» dibuja unos fotogramas y se queda quieta.
   Las rutinas de marzo van tal cual: leen su tamaño de ctx.canvas y llaman a requestAnimationFrame, que aquí es la
   función de abajo. Fuente: 08_WEB/05 LAB/KS-lab-grid-v5-miniaturas-canvas (nueve artefactos, 2026-11-17).html y la
   simulación KS-lab-simulacion-miniaturas-v0.2.html (Entropic como su interfaz). */
(function(){
  var PI2 = Math.PI * 2, RUTINAS = [];
  var QUIETO = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, VUELTAS = [];
  var ULTIMO = null, DE = new WeakMap(), SEVE = new WeakMap();
  var IO = ('IntersectionObserver' in window) ? new IntersectionObserver(function(es){es.forEach(function(e){SEVE.set(e.target, e.isIntersecting);});}, {threshold: 0}) : null;

  /* la rutina llama a esto creyendo que es el del navegador; aquí se le ata a su lienzo la primera vez (la primera
     llamada llega desde el draw() que cada rutina ejecuta nada más pedir su lienzo) */
  function requestAnimationFrame(f){
    var cv = DE.get(f);
    if (!cv && ULTIMO){ cv = ULTIMO; DE.set(f, cv); }
    if (cv && !cv.isConnected) return;                                                                      /* la tesela ya no está: fin */
    if (cv && SEVE.get(cv) === false){ setTimeout(function(){ requestAnimationFrame(f); }, 250); return; }   /* no se ve: espera */
    if (!QUIETO) return window.requestAnimationFrame(f);
    for (var i = 0; i < VUELTAS.length; i++) if (VUELTAS[i][0] === f){ if (VUELTAS[i][1]++ < 260) f(); return; }
    VUELTAS.push([f, 1]); f();
  }

  function norm(h){ return ((h % 360) + 360) % 360; }
  function hslStr(h, s, l){ return 'hsl('+Math.round(norm(h))+','+Math.round(s)+'%,'+Math.round(l)+'%)'; }

  /* el lienzo llena la ventana de su tesela (.qt-m), a la densidad de la pantalla y con un poco de aumento según el
     ancho. Las rutinas leen ancho y alto de ctx.canvas: se les da el tamaño lógico y no se tocan. */
  function initCanvas(id, bgColor){
    var cv = document.getElementById(id);
    if (!cv) return null;
    ULTIMO = cv; if (IO) IO.observe(cv);
    var rb = cv.parentElement.getBoundingClientRect();
    var w = Math.max(120, Math.round(rb.width)), h = Math.max(100, Math.round(rb.height));
    var d = Math.min(2, window.devicePixelRatio || 1), z = Math.max(1, Math.min(1.6, w/520));
    cv.width = Math.round(w*d); cv.height = Math.round(h*d);
    var ctx = cv.getContext('2d'); ctx.scale(d*z, d*z);
    Object.defineProperty(ctx, 'canvas', {value: {width: w/z, height: h/z}, configurable: true});
    ctx.fillStyle = bgColor || '#f8f7f4'; ctx.fillRect(0, 0, w/z, h/z);
    return ctx;
  }

  /* ══════════════════════════════════════════════
     N20.a1 · Color Compass — v2
     Construcción progresiva + giro 0.35°/frame
     Brazos aparecen uno a uno cada 18 frames
  ══════════════════════════════════════════════ */
  RUTINAS.push(function(){
    var ctx = initCanvas('ks-prev-color', '#fafaf8');
    if (!ctx) return;
    var W = ctx.canvas.width, H = ctx.canvas.height;
    var cx = W/2, cy = H/2, R = Math.min(W,H)*0.40;

    var phase = 0, buildDeg = 0, armPhase = 0, armTimer = 0;
    var anchorH = 330, t = 0;

    function drawWheel(maxDeg){
      for (var i = 0; i < maxDeg; i += 2){
        var a1 = (i-90)*Math.PI/180, a2 = (i-88)*Math.PI/180;
        ctx.beginPath();
        ctx.moveTo(cx+R*0.14*Math.cos(a1), cy+R*0.14*Math.sin(a1));
        ctx.arc(cx, cy, R, a1, a2);
        ctx.closePath();
        ctx.fillStyle = hslStr(i, 78, 56); ctx.fill();
      }
      var grad = ctx.createRadialGradient(cx,cy,0,cx,cy,R*0.52);
      grad.addColorStop(0,'rgba(250,250,248,0.95)');
      grad.addColorStop(1,'rgba(250,250,248,0)');
      ctx.beginPath(); ctx.arc(cx,cy,R*0.52,0,PI2);
      ctx.fillStyle = grad; ctx.fill();
    }

    function drawArms(count, aH){
      var arms = [
        {h:aH,           r:R,     w:2.2, dash:[]},
        {h:norm(aH+180), r:R,     w:2.2, dash:[]},
        {h:norm(aH-30),  r:R*0.9, w:1.2, dash:[3,4]},
        {h:norm(aH+30),  r:R*0.9, w:1.2, dash:[3,4]},
        {h:norm(aH+150), r:R*0.9, w:1.2, dash:[3,4]},
        {h:norm(aH+210), r:R*0.9, w:1.2, dash:[3,4]},
      ];
      for (var i = 0; i < Math.min(count, arms.length); i++){
        var arm = arms[i];
        var a = (arm.h-90)*Math.PI/180;
        ctx.beginPath(); ctx.moveTo(cx,cy);
        ctx.lineTo(cx+arm.r*Math.cos(a), cy+arm.r*Math.sin(a));
        ctx.strokeStyle='rgba(42,41,38,0.75)';
        ctx.lineWidth=arm.w; ctx.setLineDash(arm.dash); ctx.stroke(); ctx.setLineDash([]);
        var nr=arm.r+4, ns=i<2?6:4;
        ctx.beginPath(); ctx.arc(cx+nr*Math.cos(a), cy+nr*Math.sin(a), ns, 0, PI2);
        ctx.fillStyle=hslStr(arm.h,82,54); ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,0.9)'; ctx.lineWidth=1.5; ctx.stroke();
      }
    }

    function draw(){
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#fafaf8'; ctx.fillRect(0,0,W,H);
      if (phase===0){
        buildDeg = Math.min(buildDeg+4, 360);
        drawWheel(buildDeg);
        if (buildDeg>=360){ phase=1; armPhase=0; armTimer=0; }
      } else {
        anchorH = norm(anchorH+0.35);
        drawWheel(360);
        armTimer++;
        if (armTimer%18===0 && armPhase<6) armPhase++;
        drawArms(armPhase, anchorH);
      }
      ctx.beginPath(); ctx.arc(cx,cy,8,0,PI2);
      ctx.fillStyle='#fafaf8'; ctx.fill();
      ctx.strokeStyle='rgba(42,41,38,0.15)'; ctx.lineWidth=0.8; ctx.stroke();
      t++; requestAnimationFrame(draw);
    }
    draw();
  });

  /* ══════════════════════════════════════════════
     N07.a1 · Stakeholder Topology — v2, sin cambios
  ══════════════════════════════════════════════ */
  RUTINAS.push(function(){
    var ctx = initCanvas('ks-prev-stk', '#fafaf8');
    if (!ctx) return;
    var W = ctx.canvas.width, H = ctx.canvas.height;
    var nodes=[
      {h:320,r:0.26,c:'#b24f57',s:18},{h:280,r:0.38,c:'#b24f57',s:13},
      {h:240,r:0.54,c:'#1aa3ab',s:15},{h:200,r:0.68,c:'#ef8b23',s:13},
      {h:165,r:0.78,c:'#ef8b23',s:17},{h:120,r:0.58,c:'#64c7a6',s:15},
      {h: 80,r:0.73,c:'#1aa3ab',s:13},{h: 40,r:0.44,c:'#88a3bf',s:11},
      {h:  5,r:0.30,c:'#9fcfd1',s:13},
    ];
    var t=0;
    function draw(){
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#fafaf8'; ctx.fillRect(0,0,W,H);
      var cx=W/2, cy=H/2, R=Math.min(W,H)*0.41, pulse=t*0.025;
      for(var ri=1;ri<=4;ri++){
        ctx.beginPath(); ctx.arc(cx,cy,R*(ri/4),0,PI2);
        ctx.strokeStyle='rgba(42,41,38,0.07)'; ctx.lineWidth=0.8; ctx.stroke();
      }
      nodes.forEach(function(nd,i){
        var a=(nd.h-90)*Math.PI/180;
        var pr=nd.r+Math.sin(pulse+i*0.65)*0.022;
        var x=cx+R*pr*Math.cos(a), y=cy+R*pr*Math.sin(a);
        var ps=nd.s+Math.sin(pulse+i)*1.4;
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(x,y);
        ctx.strokeStyle='rgba(42,41,38,0.05)'; ctx.lineWidth=0.7; ctx.stroke();
        ctx.beginPath(); ctx.arc(x,y,ps,0,PI2);
        ctx.fillStyle=nd.c; ctx.globalAlpha=0.82; ctx.fill(); ctx.globalAlpha=1;
        ctx.strokeStyle='white'; ctx.lineWidth=1.6; ctx.stroke();
      });
      ctx.beginPath(); ctx.arc(cx,cy,9,0,PI2);
      ctx.fillStyle='#2B200F'; ctx.fill();
      ctx.fillStyle='white'; ctx.font='500 7px IBM Plex Mono,monospace';
      ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('SM',cx,cy);
      t++; requestAnimationFrame(draw);
    }
    draw();
  });

  /* ══════════════════════════════════════════════
     N19.a1 · Tabla Periódica del Poder — v2, sin cambios
  ══════════════════════════════════════════════ */
  RUTINAS.push(function(){
    var ctx = initCanvas('ks-prev-pt', '#fafaf8');
    if (!ctx) return;
    var W = ctx.canvas.width, H = ctx.canvas.height;
    var els=[
      {s:'Sc',z:21,crit:false},{s:'Y', z:39,crit:false},
      {s:'Nd',z:60,crit:true}, {s:'Dy',z:66,crit:true},
      {s:'La',z:57,crit:false},{s:'Ce',z:58,crit:false},
      {s:'Pr',z:59,crit:false},{s:'Sm',z:62,crit:false},
      {s:'Eu',z:63,crit:false},{s:'Tb',z:65,crit:false},
    ];
    var active=-1, t=0;
    function draw(){
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#fafaf8'; ctx.fillRect(0,0,W,H);
      if(t%80===0) active=Math.floor(Math.random()*els.length);
      var cols=Math.min(5,Math.floor(W/70));
      var cw=Math.floor((W-24)/cols)-6, ch=52, pad=6;
      var rows=Math.ceil(els.length/cols);
      var offY=(H-rows*(ch+pad))/2;
      els.forEach(function(el,i){
        var col=i%cols, row=Math.floor(i/cols);
        var x=pad+col*(cw+pad), y=offY+row*(ch+pad), isA=i===active;
        ctx.beginPath();
        if(ctx.roundRect) ctx.roundRect(x,y,cw,ch,8); else ctx.rect(x,y,cw,ch);
        ctx.fillStyle=isA?'rgba(0,166,171,0.12)':'rgba(42,41,38,0.04)'; ctx.fill();
        ctx.strokeStyle=isA?'rgba(0,166,171,0.55)':el.crit?'rgba(42,41,38,0.22)':'rgba(42,41,38,0.10)';
        ctx.lineWidth=isA?1.5:el.crit?1.2:0.7; ctx.stroke();
        ctx.fillStyle=isA?'#00A6AB':'rgba(42,41,38,0.45)';
        ctx.font='400 9px IBM Plex Mono,monospace'; ctx.textAlign='left';
        ctx.fillText(String(el.z),x+5,y+12);
        ctx.fillStyle=isA?'#00A6AB':el.crit?'rgba(42,41,38,0.9)':'rgba(42,41,38,0.75)';
        ctx.font='700 '+Math.min(20,cw*0.32)+'px IBM Plex Sans,sans-serif';
        ctx.textAlign='center'; ctx.fillText(el.s,x+cw/2,y+ch*0.63);
        if(el.crit){
          ctx.fillStyle=isA?'rgba(0,166,171,0.6)':'rgba(42,41,38,0.35)';
          ctx.font='400 8px IBM Plex Sans,sans-serif';
          ctx.fillText('critical',x+cw/2,y+ch-7);
        }
      });
      t++; requestAnimationFrame(draw);
    }
    draw();
  });

  /* ══════════════════════════════════════════════
     N01.a1 · Han Stack — v3
     Columna central, chips tech izq / infra der
  ══════════════════════════════════════════════ */
  RUTINAS.push(function(){
    var ctx = initCanvas('ks-prev-han', '#fbfaf7');
    if (!ctx) return;
    var W = ctx.canvas.width, H = ctx.canvas.height;
    var nodes=[
      {label:'Sociedad de rendimiento', tech:['KPIs','Dashboards'],    infra:['Software SaaS','Cómputo']},
      {label:'Psicopolítica',           tech:['Algoritmos','Perfilado'],infra:['Tracking','Pipelines']},
      {label:'Cansancio',               tech:['Burnout','Notificaciones'],infra:['Data centers','Desgaste']},
    ];
    var active=0, t=0;
    function draw(){
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#fbfaf7'; ctx.fillRect(0,0,W,H);
      if(t%100===0&&t>0) active=(active+1)%nodes.length;
      var cx=W/2, nodeH=(H-24)/nodes.length;
      ctx.beginPath(); ctx.moveTo(cx,12); ctx.lineTo(cx,H-12);
      ctx.strokeStyle='rgba(42,41,38,0.09)'; ctx.lineWidth=1; ctx.stroke();
      nodes.forEach(function(nd,i){
        var y=12+i*nodeH+nodeH/2, isA=i===active;
        ctx.beginPath(); ctx.arc(cx,y,isA?8:5,0,PI2);
        ctx.fillStyle=isA?'#5c84a2':'rgba(42,41,38,0.16)'; ctx.fill();
        if(isA){
          ctx.beginPath(); ctx.arc(cx,y,14,0,PI2);
          ctx.strokeStyle='rgba(92,132,162,0.2)'; ctx.lineWidth=7; ctx.stroke();
        }
        ctx.fillStyle=isA?'rgba(42,41,38,0.85)':'rgba(42,41,38,0.35)';
        ctx.font=(isA?'500':'400')+' 11px IBM Plex Sans,sans-serif';
        ctx.textAlign='center'; ctx.textBaseline='alphabetic';
        ctx.fillText(nd.label,cx,y-(isA?20:17));
        if(isA){
          nd.tech.forEach(function(chip,ci){
            var ox=-(W*0.26+ci*6), cy2=y+(ci-0.5)*22;
            ctx.font='400 10px IBM Plex Sans,sans-serif';
            var tw=ctx.measureText(chip).width+18;
            ctx.beginPath();
            if(ctx.roundRect) ctx.roundRect(cx+ox-tw/2,cy2-9,tw,18,999);
            else ctx.rect(cx+ox-tw/2,cy2-9,tw,18);
            ctx.fillStyle='#ffffff'; ctx.fill();
            ctx.strokeStyle='rgba(42,41,38,0.13)'; ctx.lineWidth=0.8; ctx.stroke();
            ctx.fillStyle='rgba(42,41,38,0.6)'; ctx.textAlign='center';
            ctx.fillText(chip,cx+ox,cy2+4);
            ctx.beginPath(); ctx.moveTo(cx-9,y); ctx.lineTo(cx+ox+tw/2-2,cy2);
            ctx.strokeStyle='rgba(92,132,162,0.2)'; ctx.lineWidth=0.8; ctx.stroke();
          });
          nd.infra.forEach(function(chip,ci){
            var ox=W*0.26+ci*6, cy2=y+(ci-0.5)*22;
            ctx.font='400 10px IBM Plex Sans,sans-serif';
            var tw=ctx.measureText(chip).width+18;
            ctx.beginPath();
            if(ctx.roundRect) ctx.roundRect(cx+ox-tw/2,cy2-9,tw,18,999);
            else ctx.rect(cx+ox-tw/2,cy2-9,tw,18);
            ctx.fillStyle='#ffffff'; ctx.fill();
            ctx.strokeStyle='rgba(42,41,38,0.13)'; ctx.lineWidth=0.8; ctx.stroke();
            ctx.fillStyle='rgba(42,41,38,0.6)'; ctx.textAlign='center';
            ctx.fillText(chip,cx+ox,cy2+4);
            ctx.beginPath(); ctx.moveTo(cx+9,y); ctx.lineTo(cx+ox-tw/2+2,cy2);
            ctx.strokeStyle='rgba(92,132,162,0.2)'; ctx.lineWidth=0.8; ctx.stroke();
          });
        }
      });
      t++; requestAnimationFrame(draw);
    }
    draw();
  });

  /* ══════════════════════════════════════════════
     N20.a2 · Munsell Hotel — v3
     Cascada de swatches: 10 columnas de tono,
     negro abajo → blanco arriba, ancho proporcional
     al chroma real. Scanner horizontal animado.
  ══════════════════════════════════════════════ */
  RUTINAS.push(function(){
    var ctx = initCanvas('ks-prev-mun', '#fbfaf7');
    if (!ctx) return;
    var W = ctx.canvas.width, H = ctx.canvas.height;

    var HUE_NAME=['R','YR','Y','GY','G','BG','B','PB','P','RP'];
    var HUE_DEG =[5, 30, 58, 95, 145, 175, 215, 255, 285, 330];
    var MAX_C=[
      [5,6,7,8,8,9,10,10,9,8,8,6,4,3],
      [4,4,5,6,6,7,8,8,9,9,8,6,4,3],
      [2,3,4,5,5,6,7,8,9,10,9,7,5,3],
      [2,3,4,5,5,6,7,7,8,9,9,10,8,4],
      [4,6,9,11,12,13,14,14,14,13,13,11,9,6],
      [3,5,7,9,9,10,11,11,10,10,10,8,7,5],
      [4,5,5,6,6,7,8,8,8,7,6,4,3,2],
      [5,7,9,10,9,8,8,7,6,5,4,3,2,1],
      [9,10,11,12,12,11,10,9,7,6,5,4,3,2],
      [5,6,7,8,8,9,10,10,9,8,8,6,4,3],
    ];

    var H_STEPS=10, V_STEPS=14;
    var padX=12, padY=10;
    var colW=(W-padX*2)/H_STEPS;
    var rowH=(H-padY*2-18)/V_STEPS;
    var maxMC=14;

    var scanV=0, scanT=0, SCAN_SPEED=18;

    function draw(){
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#fbfaf7'; ctx.fillRect(0,0,W,H);
      scanT++;
      if(scanT%SCAN_SPEED===0) scanV=(scanV+1)%V_STEPS;

      for(var hi=0;hi<H_STEPS;hi++){
        var hDeg=HUE_DEG[hi];
        var x0=padX+hi*colW;
        for(var vi=0;vi<V_STEPS;vi++){
          var vNorm=(vi+0.5)/V_STEPS;
          var lum=vNorm*100;
          var mc=MAX_C[hi][vi]||0;
          var sat=mc>0?Math.round((mc/maxMC)*88):0;
          var y0=padY+(V_STEPS-1-vi)*rowH;
          var swW=Math.max(2,(mc/maxMC)*colW*0.92);
          var swX=x0+(colW-swW)/2;
          ctx.fillStyle=sat>0?hslStr(hDeg,sat,lum):('hsl(0,0%,'+Math.round(lum)+'%)');
          var dist=Math.abs(vi-scanV);
          ctx.globalAlpha=vi===scanV?1.0:Math.max(0.35,1-dist*0.09);
          ctx.fillRect(swX,y0,swW,rowH-1.5);
          ctx.globalAlpha=1;
          if(vi===scanV&&mc>0){
            ctx.strokeStyle='rgba(255,255,255,0.5)'; ctx.lineWidth=0.8;
            ctx.strokeRect(swX,y0,swW,rowH-1.5);
          }
        }
        ctx.fillStyle='rgba(47,34,23,0.42)';
        ctx.font='400 9px IBM Plex Mono,monospace';
        ctx.textAlign='center'; ctx.globalAlpha=1;
        ctx.fillText(HUE_NAME[hi],x0+colW/2,H-padY+2);
      }

      var scanY=padY+(V_STEPS-1-scanV)*rowH+rowH/2;
      ctx.beginPath(); ctx.moveTo(padX-4,scanY); ctx.lineTo(W-padX+4,scanY);
      ctx.strokeStyle='rgba(47,34,23,0.10)'; ctx.lineWidth=rowH-1; ctx.stroke();

      requestAnimationFrame(draw);
    }
    draw();
  });


  /* ══════════════════════════════════════════════════════════════════════
     AÑADIDO EL 17-NOV-2026 · cuatro miniaturas nuevas, en el mismo idioma
     que las cinco de marzo (canvas 2D, mismas tintas, mismo ritmo).
     Los nombres, términos y frases salen de los propios artefactos.
  ══════════════════════════════════════════════════════════════════════ */

  /* ══════════════════════════════════════════════
     N17.a1 · El Ouroboros Digital
     Un actor en el centro, los demás en anillo.
     El dinero sale del centro, pasa por dos actores
     y vuelve: el circuito no tiene salida.
  ══════════════════════════════════════════════ */
  RUTINAS.push(function(){
    var ctx = initCanvas('ks-prev-ouro', '#fafaf8');
    if (!ctx) return;
    var W = ctx.canvas.width, H = ctx.canvas.height;
    var cx = W/2, cy = H/2;
    var rx = Math.min(W*0.34, H*0.60), ry = H*0.34;
    var ring = [
      {n:'OpenAI',   c:'#5c84a2', s:15}, {n:'Microsoft', c:'#1aa3ab', s:13},
      {n:'Alphabet', c:'#1aa3ab', s:16}, {n:'AMD',       c:'#b24f57', s:10},
      {n:'Apple',    c:'#2B200F', s: 9}, {n:'Anthropic', c:'#5c84a2', s:12},
      {n:'Meta',     c:'#5c84a2', s: 9}, {n:'Intel',     c:'#b24f57', s: 8},
      {n:'Oracle',   c:'#1aa3ab', s: 9}, {n:'Amazon',    c:'#1aa3ab', s:12},
      {n:'TSMC',     c:'#b24f57', s:13}, {n:'ASML',      c:'#88a3bf', s:14}
    ];
    var n = ring.length, t = 0;
    function pos(i, pulse){
      var a = (i/n)*PI2 - Math.PI/2;
      var k = 1 + Math.sin(pulse + i*0.8)*0.025;
      return {x: cx + rx*k*Math.cos(a), y: cy + ry*k*Math.sin(a)};
    }
    function draw(){
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#fafaf8'; ctx.fillRect(0,0,W,H);
      var pulse = t*0.025, P = [], i;
      for (i = 0; i < n; i++) P.push(pos(i, pulse));
      /* el anillo y los radios */
      ctx.lineWidth = 0.8;
      for (i = 0; i < n; i++){
        var a = P[i], b = P[(i+1)%n];
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(a.x,a.y);
        ctx.strokeStyle = 'rgba(178,79,87,0.16)'; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
        ctx.strokeStyle = 'rgba(42,41,38,0.09)'; ctx.stroke();
      }
      /* el dinero: centro → actor → vecino → centro */
      for (i = 0; i < n; i += 2){
        var u = ((t*0.0045) + i/n) % 1, seg = Math.floor(u*3), f = u*3 - seg;
        var A = P[i], B = P[(i+1)%n], x, y;
        if (seg === 0){ x = cx + (A.x-cx)*f;  y = cy + (A.y-cy)*f; }
        else if (seg === 1){ x = A.x + (B.x-A.x)*f; y = A.y + (B.y-A.y)*f; }
        else { x = B.x + (cx-B.x)*f; y = B.y + (cy-B.y)*f; }
        ctx.beginPath(); ctx.arc(x, y, 2.4, 0, PI2);
        ctx.fillStyle = '#b24f57'; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1;
      }
      /* los actores */
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (i = 0; i < n; i++){
        var nd = ring[i], ps = nd.s + Math.sin(pulse + i)*1.1;
        ctx.beginPath(); ctx.arc(P[i].x, P[i].y, ps, 0, PI2);
        ctx.fillStyle = nd.c; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1;
        ctx.strokeStyle = 'white'; ctx.lineWidth = 1.6; ctx.stroke();
        ctx.font = '500 7px IBM Plex Sans,sans-serif';
        if (ctx.measureText(nd.n).width < ps*2 - 5){           /* cabe dentro de la bola */
          ctx.fillStyle = 'white'; ctx.fillText(nd.n, P[i].x, P[i].y);
        } else {                                                /* no cabe: va fuera, hacia el borde */
          var la = (i/n)*PI2 - Math.PI/2, lx = P[i].x + (ps+5)*Math.cos(la), ly = P[i].y + (ps+8)*Math.sin(la);
          ctx.textAlign = Math.cos(la) > 0.3 ? 'left' : Math.cos(la) < -0.3 ? 'right' : 'center';
          ctx.fillStyle = 'rgba(42,41,38,0.55)'; ctx.fillText(nd.n, lx, ly);
          ctx.textAlign = 'center';
        }
      }
      /* el centro */
      var cs = 27 + Math.sin(pulse*1.3)*1.6;
      ctx.beginPath(); ctx.arc(cx, cy, cs+7, 0, PI2);
      ctx.strokeStyle = 'rgba(178,79,87,0.16)'; ctx.lineWidth = 6; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, cs, 0, PI2);
      ctx.fillStyle = '#b24f57'; ctx.fill();
      ctx.strokeStyle = 'white'; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.fillStyle = 'white'; ctx.font = '500 9px IBM Plex Sans,sans-serif';
      ctx.fillText('NVIDIA', cx, cy);
      ctx.textBaseline = 'alphabetic';
      t++; requestAnimationFrame(draw);
    }
    draw();
  });

  /* ══════════════════════════════════════════════
     N07.a2 · Glosario de Producto, UX/UI e IA
     Alguien escribe en el buscador y las fichas
     que no coinciden se apagan.
  ══════════════════════════════════════════════ */
  RUTINAS.push(function(){
    var ctx = initCanvas('ks-prev-glo', '#fafaf8');
    if (!ctx) return;
    var W = ctx.canvas.width, H = ctx.canvas.height;
    var terms = [
      {t:'A/B Testing',          c:'#ef8b23'}, {t:'AARRR',                c:'#64c7a6'},
      {t:'Above the fold',       c:'#1aa3ab'}, {t:'Acceptance Criteria',  c:'#ef8b23'},
      {t:'Accesibilidad (a11y)', c:'#b24f57'}, {t:'Accordion',            c:'#88a3bf'}
    ];
    var queries = ['aarrr', 'a11y', 'fold', 'acc'];
    var qi = 0, typed = 0, phase = 0, hold = 0, t = 0;   /* 0 escribe · 1 espera · 2 borra · 3 pausa */
    function draw(){
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#fafaf8'; ctx.fillRect(0,0,W,H);
      var q = queries[qi];
      if (phase === 0){ if (t%9 === 0){ typed++; if (typed >= q.length){ typed = q.length; phase = 1; hold = 0; } } }
      else if (phase === 1){ if (++hold > 75) phase = 2; }
      else if (phase === 2){ if (t%4 === 0){ typed--; if (typed <= 0){ typed = 0; phase = 3; hold = 0; } } }
      else { if (++hold > 40){ phase = 0; qi = (qi+1)%queries.length; } }
      var cur = q.slice(0, typed);
      /* el buscador */
      var pad = 14, sy = 14, sh = 28;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(pad, sy, W-pad*2, sh, 8); else ctx.rect(pad, sy, W-pad*2, sh);
      ctx.fillStyle = '#ffffff'; ctx.fill();
      ctx.strokeStyle = 'rgba(42,41,38,0.16)'; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.beginPath(); ctx.arc(pad+14, sy+sh/2-1, 4.5, 0, PI2);
      ctx.moveTo(pad+17.5, sy+sh/2+2.5); ctx.lineTo(pad+21, sy+sh/2+6);
      ctx.strokeStyle = 'rgba(42,41,38,0.4)'; ctx.lineWidth = 1.1; ctx.stroke();
      ctx.font = '400 11px IBM Plex Mono,monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      if (cur){ ctx.fillStyle = 'rgba(42,41,38,0.85)'; ctx.fillText(cur, pad+30, sy+sh/2); }
      else { ctx.fillStyle = 'rgba(42,41,38,0.32)'; ctx.fillText('Buscar un término…', pad+30, sy+sh/2); }
      if (Math.floor(t/26)%2 === 0){
        var cw0 = cur ? ctx.measureText(cur).width : 0;
        ctx.fillStyle = 'rgba(42,41,38,0.7)'; ctx.fillRect(pad+31+cw0, sy+7, 1, sh-14);
      }
      /* las fichas */
      var cols = W < 360 ? 2 : 3, gap = 8, top = sy+sh+12;
      var rows = Math.ceil(terms.length/cols);
      var cw = (W - pad*2 - gap*(cols-1))/cols, ch = (H - top - 12 - gap*(rows-1))/rows;
      terms.forEach(function(tm, i){
        var col = i%cols, row = Math.floor(i/cols);
        var x = pad + col*(cw+gap), y = top + row*(ch+gap);
        var hit = !cur || tm.t.toLowerCase().indexOf(cur) >= 0;
        ctx.globalAlpha = hit ? 1 : 0.24;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, y, cw, ch, 6); else ctx.rect(x, y, cw, ch);
        ctx.fillStyle = '#ffffff'; ctx.fill();
        ctx.strokeStyle = (hit && cur) ? 'rgba(42,41,38,0.30)' : 'rgba(42,41,38,0.10)';
        ctx.lineWidth = (hit && cur) ? 1.2 : 0.7; ctx.stroke();
        ctx.fillStyle = tm.c; ctx.fillRect(x+1, y+1, cw-2, 3);
        ctx.fillStyle = 'rgba(42,41,38,0.88)';
        ctx.font = '600 ' + Math.min(12, cw*0.105) + 'px IBM Plex Serif,serif';
        ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
        ctx.fillText(tm.t, x+9, y+24, cw-16);
        ctx.fillStyle = 'rgba(42,41,38,0.10)';
        ctx.fillRect(x+9, y+34, cw*0.72, 3); ctx.fillRect(x+9, y+42, cw*0.56, 3);
        if (ch > 62) ctx.fillRect(x+9, y+50, cw*0.64, 3);
        ctx.globalAlpha = 1;
      });
      ctx.textBaseline = 'alphabetic';
      t++; requestAnimationFrame(draw);
    }
    draw();
  });

  /* ══════════════════════════════════════════════
     N09.a1 · La habitación de la entropía (Entropic)
     Una frase pasa de copista en copista. Cada uno
     cambia una palabra, hasta que deja de ser tuya.
  ══════════════════════════════════════════════ */
  RUTINAS.push(function(){
    /* 17-nov-2026 · Koi: «que se parezca un poco más al interfaz y está la Biro». La miniatura copia la composición
       de Entropic v1.1: barra, campo naranja, 01 Tu frase (en Biro), 02 El procesado, 03 La cadena y 04 Los datos.
       Biro no se incrusta (licencia Desktop): se llama con local(), igual que en el artefacto; donde no está
       instalada cae a Newsreader cursiva. */
    var ctx = initCanvas('ks-prev-ent', '#E28D65');
    if (!ctx) return;
    var W = ctx.canvas.width, H = ctx.canvas.height, s = W/500, VW = 500, VH = H/s;
    var TINTA = '#2D2A23', GRIS = '#686761', NAR = '#C65210', CAMPO = '#E28D65';
    var SERIF = 'Newsreader,Georgia,serif', SANS = '"Fira Sans","Albert Sans",system-ui,sans-serif', MONO = '"Fira Code",ui-monospace,monospace';
    var biro = false;
    if (document.fonts && document.fonts.load) document.fonts.load('20px "KS Biro"').then(function(f){ biro = !!(f && f.length); }, function(){});
    /* v1.115 · frase corta, que quepa en la caja en Biro (Koi, 18-nov): la de la v1.112 desbordaba */
    var A = ['Los','modelos','de','lenguaje','sufren','alucinaciones','que','este','artefacto','demuestra'];
    var B = {1:'sistemas', 4:'padecen', 5:'espejismos', 8:'experimento', 9:'enseña'};
    var CUANDO = {2:0, 5:1, 8:2, 11:4, 14:6, 17:8, 20:11, 23:13};   /* en qué copista cae cada palabra */
    var N = A.length, FRASE = A.join(' '), COP = 25;
    var t = 0, fase = 0, f0 = 0, paso = 0, camb = [], hist = [];
    function reset(){ fase = 0; f0 = t; paso = 0; camb = []; hist = []; for (var i = 0; i < N; i++) camb.push(false); }
    reset();
    function rr(x, y, w, h, r){ ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
    function caja(x, y, w, h, col, a){ ctx.globalAlpha = a; rr(x, y, w, h, 4); ctx.fillStyle = col; ctx.fill(); ctx.globalAlpha = 1; }
    function cab(x, y, n, txt, a){
      ctx.globalAlpha = a; ctx.textAlign = 'left';
      ctx.font = '400 6.5px ' + MONO; ctx.fillStyle = NAR; ctx.fillText(n, x, y);
      ctx.font = '400 9.5px ' + SERIF; ctx.fillStyle = TINTA; ctx.fillText(txt, x + 13, y); ctx.globalAlpha = 1;
    }
    function versal(txt, x, y, col, al){
      ctx.font = '400 5.6px ' + SANS; ctx.fillStyle = col; ctx.textAlign = al || 'left';
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0.5px';
      ctx.fillText(txt.toUpperCase(), x, y);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    }
    /* reparte palabras en renglones; devuelve [{i,x,w,li}] */
    function renglones(pal, maxW){
      var sp = ctx.measureText(' ').width, out = [], x = 0, li = 0;
      pal.forEach(function(p, i){
        var w = ctx.measureText(p).width;
        if (x + w > maxW && x > 0){ li++; x = 0; }
        out.push({i:i, t:p, x:x, w:w, li:li}); x += w + sp;
      });
      return out;
    }
    function draw(){
      var e = t - f0, i;
      /* ── el guion ── */
      var nchar = FRASE.length;
      if (fase === 0){ nchar = Math.min(FRASE.length, Math.floor(e/2)); if (e > FRASE.length*2 + 40){ fase = 1; f0 = t; } }
      else if (fase === 1){ if (e > 26){ fase = 2; f0 = t; } }
      else if (fase === 2){
        var p = Math.min(COP, Math.floor(e/15));
        while (paso < p){ paso++; if (CUANDO[paso] !== undefined) camb[CUANDO[paso]] = true; hist.push(camb.slice()); }
        if (e > COP*15 + 150) reset();
      }
      var escrito = FRASE.slice(0, nchar), npal = escrito ? escrito.trim().split(/\s+/).length : 0;
      var on2 = fase > 0 || npal >= 4, on3 = fase === 2, pulsa = fase === 1;
      var vivas = N; for (i = 0; i < N; i++) if (camb[i]) vivas--;
      var nat = Math.round(vivas/N*100), der = 100 - nat;

      ctx.save(); ctx.scale(s, s);
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = CAMPO; ctx.fillRect(0, 0, VW, VH);
      /* barra */
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, VW, 24);
      ctx.beginPath(); ctx.ellipse(18, 12.5, 4.2, 2.3, -0.6, 0, PI2); ctx.strokeStyle = NAR; ctx.lineWidth = 0.9; ctx.stroke();
      ctx.font = '600 11.5px ' + SERIF; ctx.fillStyle = TINTA; ctx.textAlign = 'left'; ctx.fillText('Entropic', 27, 16.2);
      ctx.fillStyle = 'rgba(45,42,35,.18)'; ctx.fillRect(76, 6, 0.6, 12);
      versal('Lab · N09.a1 · Koi Samsa', 82, 14.6, GRIS);
      ctx.font = '400 6px ' + SANS; ctx.fillStyle = GRIS; ctx.textAlign = 'right';
      ctx.fillText(fase === 2 ? (paso < COP ? 'Copiando…' : 'Cadena terminada') : (on2 ? 'Lista para empezar' : 'Esperando tu frase'), VW - 14, 14.6);
      /* cabecera */
      versal('Loros estocásticos', 16, 42, TINTA);
      ctx.font = '400 14.5px ' + SERIF; ctx.fillStyle = TINTA; ctx.textAlign = 'left'; ctx.fillText('La habitación de la entropía', 16, 57);
      ctx.beginPath(); ctx.moveTo(16, 63.5); ctx.bezierCurveTo(50, 61.2, 90, 64.6, 132, 62.2);
      ctx.strokeStyle = TINTA; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.stroke();
      ctx.lineWidth = 0.7; ctx.strokeStyle = 'rgba(45,42,35,.75)';
      [VW - 44, VW - 24].forEach(function(cx){ ctx.beginPath(); ctx.arc(cx, 52, 7, 0, PI2); ctx.stroke(); });
      ctx.font = 'italic 400 8px ' + SERIF; ctx.textAlign = 'center'; ctx.fillStyle = TINTA; ctx.fillText('i', VW - 44, 54.8);
      [[VW - 26.5, 52, 1], [VW - 21.5, 49.2, 1], [VW - 21.5, 54.8, 1]].forEach(function(d){ ctx.beginPath(); ctx.arc(d[0], d[1], d[2], 0, PI2); ctx.fill(); });
      ctx.beginPath(); ctx.moveTo(VW - 21.5, 49.2); ctx.lineTo(VW - 26.5, 52); ctx.lineTo(VW - 21.5, 54.8); ctx.stroke();

      var y0 = 76, xL = 12, wL = 196, xR = xL + wL + 7, wR = VW - 12 - xR, yF = VH - 9;
      var h1 = Math.max(96, Math.min(148, (yF - y0)*0.52)), y2 = y0 + h1 + 6, h2 = Math.max(0, yF - y2);
      /* 01 · tu frase */
      caja(xL, y0, wL, h1, '#F9F3EF', 1); cab(xL + 10, y0 + 15, '01', 'Tu frase', 1);
      var fsB = biro ? 17 : 13.5; ctx.font = (biro ? '400 ' : 'italic 400 ') + fsB + 'px ' + (biro ? '"KS Biro",' : '') + SERIF;
      ctx.textAlign = 'left';
      var lhB = fsB*1.22, rg = renglones(FRASE.split(' '), wL - 22), pos = 0, cx = xL + 10, cy = y0 + 22 + lhB;
      if (!nchar){ ctx.fillStyle = 'rgba(104,103,97,.75)'; ctx.fillText('Escribe aquí tu frase…', xL + 10, cy); }
      ctx.fillStyle = TINTA;
      rg.forEach(function(r){
        var deja = Math.max(0, Math.min(r.t.length, nchar - pos)); pos += r.t.length + 1;
        if (!deja) return;
        var tx = r.t.slice(0, deja); ctx.fillText(tx, xL + 10 + r.x, y0 + 22 + lhB*(r.li + 1));
        cx = xL + 10 + r.x + ctx.measureText(tx).width + 1; cy = y0 + 22 + lhB*(r.li + 1);
      });
      if (fase === 0 && Math.floor(t/18)%2 === 0){ ctx.fillStyle = NAR; ctx.fillRect(cx, cy - fsB*0.72, 0.8, fsB*0.9); }
      ctx.fillStyle = NAR; ctx.fillRect(xL + 10, y0 + h1 - 24, wL - 20, 1.3);
      ctx.font = '500 5.8px ' + SANS; ctx.fillStyle = '#B24512'; ctx.textAlign = 'left'; ctx.fillText('↻ Prueba con una de Woolf', xL + 10, y0 + h1 - 14.5);
      ctx.font = '400 5.6px ' + MONO; ctx.fillStyle = GRIS; ctx.textAlign = 'right';
      ctx.fillText(nchar ? npal + ' palabras · ' + nchar + ' caracteres' : 'Al menos 4 palabras · hasta 280 caracteres', xL + wL - 10, y0 + h1 - 6);
      /* 02 · el procesado */
      if (h2 > 40){
        var a2 = on2 ? 1 : 0.4;
        caja(xL, y2, wL, h2, '#FFFFFF', a2); cab(xL + 10, y2 + 15, '02', 'El procesado', on2 ? 1 : 0.55);
        ctx.globalAlpha = on2 ? 1 : 0.55;
        ctx.font = '500 5.8px ' + SANS; ctx.fillStyle = GRIS; ctx.textAlign = 'left'; ctx.fillText('Copistas', xL + 10, y2 + 31);
        var chx = xL + 48;
        ['25', '50', '100', '1 por palabra'].forEach(function(c, k){
          ctx.font = '400 5.8px ' + SANS; var cw = ctx.measureText(c).width + 9;
          rr(chx, y2 + 23.5, cw, 11, 2); if (k === 0){ ctx.fillStyle = TINTA; ctx.fill(); } else { ctx.strokeStyle = 'rgba(45,42,35,.28)'; ctx.lineWidth = 0.5; ctx.stroke(); }
          ctx.fillStyle = k === 0 ? '#FAF9F7' : GRIS; ctx.textAlign = 'center'; ctx.fillText(c, chx + cw/2, y2 + 31); chx += cw + 3.5;
        });
        if (h2 > 62){
          ctx.font = '500 5.8px ' + SANS; ctx.fillStyle = GRIS; ctx.textAlign = 'left'; ctx.fillText('Modelo', xL + 10, y2 + 47);
          rr(xL + 48, y2 + 39.5, wL - 58, 11.5, 2); ctx.strokeStyle = 'rgba(45,42,35,.28)'; ctx.lineWidth = 0.5; ctx.stroke();
          ctx.font = '400 5.8px ' + SANS; ctx.fillStyle = TINTA; ctx.fillText('Mistral Small · Mistral AI, Francia', xL + 52, y2 + 47.4);
        }
        var by = h2 > 62 ? y2 + 58 : y2 + 40, bh = Math.min(15, y2 + h2 - by - 7);
        if (bh > 8){
          var bw = wL - 20 - 40;
          rr(xL + 10, by, bw, bh, 2.5); ctx.fillStyle = !on2 ? '#E7E6DD' : (pulsa ? '#8F3A0B' : (on3 ? '#E7E6DD' : NAR)); ctx.fill();
          ctx.font = '500 6.6px ' + SANS; ctx.textAlign = 'center'; ctx.fillStyle = (on2 && !on3) ? '#FFFFFF' : '#AAA8A1';
          ctx.fillText('▷  Empezar la cadena', xL + 10 + bw/2, by + bh/2 + 2.3);
          rr(xL + 14 + bw, by, 36, bh, 2.5); ctx.fillStyle = '#E7E6DD'; ctx.fill();
          ctx.fillStyle = on3 && paso < COP ? TINTA : '#AAA8A1'; ctx.font = '400 6px ' + SANS; ctx.fillText('□ Parar', xL + 32 + bw, by + bh/2 + 2.2);
        }
        ctx.globalAlpha = 1;
      }
      /* 03 · la cadena */
      var a3 = on3 ? 1 : 0.4, hR = yF - y0, t3 = on3 ? 1 : 0.5;
      caja(xR, y0, wR, hR, '#FFFFFF', a3); cab(xR + 10, y0 + 15, '03', 'La cadena de resultados', t3);
      ctx.globalAlpha = t3;
      versal(on3 ? (paso ? 'Copista ' + paso : 'Tu frase') : 'Tu frase, antes del primer copista', xR + wR - 10, y0 + 14.6, GRIS, 'right');
      var yD = Math.max(y0 + 120, yF - Math.min(150, hR*0.42)), yT = yD - 22;      /* yD: caja de datos · yT: la ruta */
      if (on3){
        var fs3 = 13.5, lh3 = fs3*1.3; ctx.font = '400 ' + fs3 + 'px ' + SERIF; ctx.textAlign = 'left';
        var viva = A.map(function(p, k){ return camb[k] ? B[k] : p; }), r3 = renglones(viva, wR - 22);
        r3.forEach(function(r){
          var xx = xR + 10 + r.x, yy = y0 + 22 + lh3*(r.li + 1);
          if (yy > yT - 14) return;
          ctx.fillStyle = TINTA; ctx.fillText(r.t, xx, yy);
          if (camb[r.i]){ ctx.fillStyle = NAR; ctx.fillRect(xx, yy + 2.2, r.w, 1.1); }
        });
      } else { ctx.font = '400 13px ' + SERIF; ctx.fillStyle = GRIS; ctx.textAlign = 'left'; ctx.fillText('…', xR + 10, y0 + 40); }
      /* la ruta, con el pájaro */
      var rx0 = xR + 54, rx1 = xR + wR - 64, px = rx0 + (rx1 - rx0)*(paso/COP);
      ctx.font = '400 5.4px ' + MONO; ctx.fillStyle = GRIS; ctx.textAlign = 'left'; ctx.fillText('Copista 0', xR + 10, yT - 3);
      ctx.font = '400 8.5px ' + SERIF; ctx.fillStyle = TINTA; ctx.fillText('100 %', xR + 10, yT + 6);
      ctx.font = '400 5.4px ' + MONO; ctx.fillStyle = GRIS; ctx.textAlign = 'right'; ctx.fillText('Copista ' + paso + ' de ' + COP, xR + wR - 10, yT - 3);
      ctx.font = '400 8.5px ' + SERIF; ctx.fillStyle = TINTA; ctx.fillText(nat + ' %', xR + wR - 10, yT + 6);
      ctx.setLineDash([1.5, 2]); ctx.beginPath(); ctx.moveTo(rx0, yT); ctx.lineTo(rx1, yT); ctx.strokeStyle = 'rgba(198,82,16,.55)'; ctx.lineWidth = 0.7; ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(rx0, yT); ctx.lineTo(px, yT); ctx.strokeStyle = NAR; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(rx1, yT, 1.6, 0, PI2); ctx.strokeStyle = NAR; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.beginPath(); ctx.arc(px, yT, 6.2, 0, PI2); ctx.fillStyle = NAR; ctx.fill();
      ctx.beginPath(); ctx.ellipse(px, yT, 3, 1.6, -0.6, 0, PI2); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.globalAlpha = 1;
      /* 04 · los datos */
      var xD = xR + 8, wD = wR - 16, hD = yF - 7 - yD;
      if (hD > 44){
        caja(xD, yD, wD, hD, '#F7F6F2', on3 ? 1 : 0.55); cab(xD + 8, yD + 14, '04', 'Los datos', t3);
        ctx.globalAlpha = t3;
        var cw3 = (wD - 16 - 12)/3, my = yD + 26;
        [['Natalidad residual', nat + ' %', nat/100, vivas + ' de ' + N + ' palabras tuyas'], ['Deriva', der + ' %', der/100, (N - vivas) + ' de ' + N + ' cambiadas']].forEach(function(m, k){
          var mx = xD + 8 + k*(cw3 + 6);
          versal(m[0], mx, my, GRIS);
          ctx.font = '400 ' + (k === 0 ? 12 : 9.5) + 'px ' + SERIF; ctx.fillStyle = k === 0 && on3 ? NAR : TINTA; ctx.textAlign = 'left'; ctx.fillText(m[1], mx, my + 12);
          ctx.fillStyle = 'rgba(45,42,35,.12)'; ctx.fillRect(mx, my + 16, cw3, 1.4);
          ctx.fillStyle = k === 0 ? NAR : TINTA; ctx.fillRect(mx, my + 16, cw3*m[2], 1.4);
          if (hD > 70){ ctx.font = '400 5px ' + SANS; ctx.fillStyle = GRIS; ctx.fillText(m[3], mx, my + 24); }
        });
        var fx = xD + 8 + 2*(cw3 + 6), cual = !on3 || !paso ? -1 : (der < 30 ? 0 : der < 70 ? 1 : 2), sw = (cw3 - 4)/3;
        versal('Fase', fx, my, GRIS);
        ctx.font = '400 9.5px ' + SERIF; ctx.fillStyle = TINTA; ctx.textAlign = 'left'; ctx.fillText(cual < 0 ? '—' : ['Limpia', 'Desalmada', 'Vaporizada'][cual], fx, my + 12);
        for (i = 0; i < 3; i++){ ctx.fillStyle = i === cual ? TINTA : 'rgba(45,42,35,.12)'; ctx.fillRect(fx + i*(sw + 2), my + 16, sw, 1.4); }
        /* el tapiz: un renglón por copista, una celda por palabra */
        var ty = my + (hD > 70 ? 32 : 24), th = yD + hD - 7 - ty;
        if (th > 14){
          rr(xD + 8, ty, wD - 16, th, 2); ctx.fillStyle = '#FFFFFF'; ctx.fill();
          var cw = (wD - 24)/N, rh = Math.min(3.2, (th - 6)/COP);
          hist.forEach(function(fila, r){
            fila.forEach(function(c, k){ ctx.fillStyle = c ? NAR : 'rgba(45,42,35,.22)'; ctx.fillRect(xD + 12 + k*cw, ty + 3 + r*rh, cw - 1, Math.max(0.6, rh - 0.7)); });
          });
        }
        ctx.globalAlpha = 1;
      }
      ctx.restore();
      t++; requestAnimationFrame(draw);
    }
    draw();
  });

  /* ══════════════════════════════════════════════
     N20.a3 · NCS Navigator
     El círculo de tonos gira; el triángulo enseña
     ese tono del blanco (W) al negro (S) y al color
     pleno (C). Sin un solo dato del catálogo NCS:
     los colores se calculan aquí, mezclando.
  ══════════════════════════════════════════════ */
  RUTINAS.push(function(){
    var ctx = initCanvas('ks-prev-ncs', '#fafaf8');
    if (!ctx) return;
    var W = ctx.canvas.width, H = ctx.canvas.height;
    var ANCLA = [60, 0, 240, 120];           /* Y arriba · R derecha · B abajo · G izquierda */
    var LETRA = ['Y', 'R', 'B', 'G'];
    function tono(a){                         /* ángulo del círculo (0 = arriba, horario) → tono HSL */
      var q = ((a%360)+360)%360/90, i = Math.floor(q)%4, f = q - Math.floor(q);
      var h0 = ANCLA[i], h1 = ANCLA[(i+1)%4], d = h1 - h0;
      if (d > 180) d -= 360; if (d < -180) d += 360;
      return norm(h0 + d*f);
    }
    function rgbDe(h){                        /* color pleno de un tono */
      var c = 1, x = 1 - Math.abs((h/60)%2 - 1), r = 0, g = 0, b = 0;
      if (h < 60){ r=c; g=x; } else if (h < 120){ r=x; g=c; } else if (h < 180){ g=c; b=x; }
      else if (h < 240){ g=x; b=c; } else if (h < 300){ r=x; b=c; } else { r=c; b=x; }
      return [r*235, g*225, b*235];
    }
    var ang = 20, t = 0;
    function draw(){
      ctx.clearRect(0,0,W,H); ctx.fillStyle='#fafaf8'; ctx.fillRect(0,0,W,H);
      ang = (ang + 0.22) % 360;
      var estrecho = W < 380;
      /* el círculo de tonos */
      var r = estrecho ? Math.min(H*0.20, W*0.13) : Math.min(H*0.30, W*0.16);
      var ox = estrecho ? r + 22 : W*0.24, oy = H/2;
      for (var d = 0; d < 360; d += 3){
        var a1 = (d-90)*Math.PI/180, a2 = (d-86.6)*Math.PI/180;
        ctx.beginPath(); ctx.arc(ox, oy, r, a1, a2); ctx.arc(ox, oy, r*0.72, a2, a1, true); ctx.closePath();
        ctx.fillStyle = hslStr(tono(d), 78, 56); ctx.fill();
      }
      ctx.font = '400 9px IBM Plex Mono,monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(42,41,38,0.5)';
      for (var li = 0; li < 4; li++){
        var la = (li*90-90)*Math.PI/180;
        ctx.fillText(LETRA[li], ox + (r+11)*Math.cos(la), oy + (r+11)*Math.sin(la));
      }
      var pa = (ang-90)*Math.PI/180;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + r*Math.cos(pa), oy + r*Math.sin(pa));
      ctx.strokeStyle = 'rgba(42,41,38,0.75)'; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.beginPath(); ctx.arc(ox + (r+3)*Math.cos(pa), oy + (r+3)*Math.sin(pa), 5, 0, PI2);
      ctx.fillStyle = hslStr(tono(ang), 82, 54); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(ox, oy, 4, 0, PI2); ctx.fillStyle = '#fafaf8'; ctx.fill();
      ctx.strokeStyle = 'rgba(42,41,38,0.15)'; ctx.lineWidth = 0.8; ctx.stroke();
      /* el triángulo W · S · C de ese tono */
      var full = rgbDe(tono(ang));
      var tx0 = ox + r + (estrecho ? 30 : 46), ty0 = 26, th = H - 52, tw = Math.min(W - tx0 - 30, th*0.95);
      var n = 9, cell = th/n, rad = cell*0.40;
      var mk = Math.floor(t/22) % (n*(n+1)/2), cnt = 0;
      for (var si = 0; si < n; si++){            /* negrura: filas de arriba (W) abajo (S) */
        for (var ci = 0; ci <= n-1-si; ci++){     /* cromaticidad: hacia la derecha (C) */
          var s = si/(n-1), c = ci/(n-1), w = 1 - s - c; if (w < 0) w = 0;
          var R = Math.round(full[0]*c + 250*w), G = Math.round(full[1]*c + 250*w), B = Math.round(full[2]*c + 248*w);
          var x = tx0 + ci*(tw/(n-1)), y = ty0 + (si + ci*0.5)*cell + cell/2;
          ctx.beginPath(); ctx.arc(x, y, rad, 0, PI2);
          ctx.fillStyle = 'rgb(' + R + ',' + G + ',' + B + ')'; ctx.fill();
          if (w > 0.85){ ctx.strokeStyle = 'rgba(42,41,38,0.12)'; ctx.lineWidth = 0.7; ctx.stroke(); }
          if (cnt === mk){
            ctx.beginPath(); ctx.arc(x, y, rad+3.5, 0, PI2);
            ctx.strokeStyle = 'rgba(42,41,38,0.8)'; ctx.lineWidth = 1.3; ctx.stroke();
          }
          cnt++;
        }
      }
      ctx.fillStyle = 'rgba(42,41,38,0.5)'; ctx.font = '400 9px IBM Plex Mono,monospace';
      ctx.textAlign = 'right'; ctx.fillText('W', tx0 - rad - 6, ty0 + cell/2);
      ctx.fillText('S', tx0 - rad - 6, ty0 + (n-1)*cell + cell/2);
      ctx.textAlign = 'left'; ctx.fillText('C', tx0 + tw + rad + 6, ty0 + ((n-1)*0.5)*cell + cell/2);
      ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
      t++; requestAnimationFrame(draw);
    }
    draw();
  });


  /* index.html llama a esto cuando la portada de Lab está pintada (y otra vez si cambia el ancho) */
  window.labMinis = function(){ ULTIMO = null; RUTINAS.forEach(function(r){ try { r(); } catch(e){ if (window.console) console.warn('lab-minis', e); } }); };
})();
