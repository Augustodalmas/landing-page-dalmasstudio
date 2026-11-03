// Seção "Projetos" da landing: caminho em U preso à rolagem (→ Dauth, ↓ Uminum, ← Trivector),
// no desktop e no celular. Depende de public/vendor/gsap.min.js e ScrollTrigger.min.js (defer, antes deste).
// Sem JS, com "reduzir movimento" ou com a tela baixa (< 560px), a seção fica empilhada (CSS sem .is-u).
(() => {
  const section = document.querySelector('.pu');
  if (!section || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  // Celular: a barra de endereço some/aparece ao rolar; não recalcular a cada vez (evita pulos no pin)
  ScrollTrigger.config({ ignoreMobileResize: true });

  const world = section.querySelector('.pu-world');
  const intro = section.querySelector('.pu-intro');
  const projs = gsap.utils.toArray('.pu-proj', section);
  const count = section.querySelector('.pu-count');
  const TEXT = '.pu-num, .pu-name, .pu-kind, .pu-desc, .pu-text .svc-tag';

  // Distância que o print sobe para mostrar a página inteira dentro da tela do mockup
  const travel = (screen) => -Math.max(0, screen.querySelector('img').offsetHeight - screen.offsetHeight);

  // Os prints são lazy, mas os painéis ficam fora da tela por transform:
  // força o carregamento um pouco antes de a seção chegar
  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom+=150%',
    end: 'max',
    once: true,
    onEnter: () => section.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = 'eager'; }),
  });

  gsap.matchMedia().add(
    { u: '(min-height: 560px)', motion: '(prefers-reduced-motion: no-preference)' },
    (ctx) => {
      const { u, motion } = ctx.conditions;
      if (!motion) return;

      if (!u) {
        // Tela baixa (celular deitado): pilha vertical com entradas simples
        projs.forEach((p) => {
          gsap.from(p.querySelectorAll(TEXT), {
            autoAlpha: 0, y: 24, stagger: 0.05, duration: 1.1, ease: 'expo.out',
            scrollTrigger: { trigger: p.querySelector('.pu-text'), start: 'top 85%', once: true },
          });
          p.querySelectorAll('.mock-screen').forEach((s) => {
            gsap.fromTo(s.querySelector('img'), { y: 0 }, {
              y: () => travel(s), ease: 'none',
              scrollTrigger: { trigger: p.querySelector('.pu-visual'), start: 'center center', end: 'bottom top', scrub: 1, invalidateOnRefresh: true },
            });
          });
        });
        return;
      }

      // ─── Caminho em U: uma timeline só, presa à rolagem, percorre o mundo 2×2 ───
      section.classList.add('is-u');
      const [p1, p2, p3] = projs;

      const LEG = 1;    // duração de cada deslocamento
      const HOLD = 1.4; // pausa com o projeto parado no centro (é quando o site rola por dentro)
      const move = { duration: LEG, ease: 'power2.inOut' };

      // início de cada perna: → (intro→Dauth), ↓ (Dauth→Uminum), ← (Uminum→Trivector)
      const legs = [0.3, 0.3 + LEG + HOLD, 0.3 + 2 * (LEG + HOLD)];
      const end = legs[2] + LEG + HOLD;
      const mids = legs.map((t) => t + LEG / 2);
      const centered = legs.map((t) => t + LEG); // projeto termina de chegar ao centro
      const shift = () => Math.min(120, window.innerWidth * 0.15);

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        // contador 01/03: atualiza a cada quadro da timeline (o scrub segue animando depois que a rolagem para)
        onUpdate() {
          const n = mids.filter((m) => this.time() >= m).length;
          count.textContent = String(n).padStart(2, '0');
        },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=650%',
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. O mundo se move: → ↓ ←
      tl.to(world, { xPercent: -50, ...move }, legs[0])
        .to(world, { yPercent: -50, ...move }, legs[1])
        .to(world, { xPercent: 0, ...move }, legs[2]);

      tl.to(intro.children, { x: () => -shift() * 1.3, autoAlpha: 0.2, stagger: 0.04, ...move }, legs[0]);

      // 2. Mockups inclinam no eixo do movimento (entrada e saída)
      const TILT_IN = { right: { rotateY: -24 }, below: { rotateX: 18 }, left: { rotateY: 24 } };
      const SHIFT_IN = {
        right: { x: shift, y: 0 },
        below: { x: 0, y: shift },
        left: { x: () => -shift(), y: 0 },
      };

      function arrive(p, at, from) {
        tl.fromTo(p.querySelector('.mock-browser'), { rotateX: 0, rotateY: 0, ...TILT_IN[from], scale: 0.84 },
          { rotateX: 0, rotateY: 0, scale: 1, ...move }, at)
          .fromTo(p.querySelector('.mock-phone'), { ...SHIFT_IN[from] }, { x: 0, y: 0, ...move }, at)
          .fromTo(p.querySelectorAll(TEXT), { autoAlpha: 0, ...SHIFT_IN[from] },
            { autoAlpha: 1, x: 0, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out' }, at + LEG * 0.45);
      }

      function leave(p, at, tilt) {
        tl.fromTo(p.querySelector('.mock-browser'), { rotateX: 0, rotateY: 0, scale: 1 },
          { ...tilt, scale: 0.9, ...move, immediateRender: false }, at);
      }

      // 3. Site rola dentro do mockup só com o projeto parado no centro
      function screens(p, from, to) {
        p.querySelectorAll('.mock-screen').forEach((s) => {
          tl.fromTo(s.querySelector('img'), { y: 0 },
            { y: () => travel(s), duration: to - from, ease: 'power1.inOut' }, from);
        });
      }

      arrive(p1, legs[0], 'right');
      leave(p1, legs[1], { rotateX: -14 }); // sai subindo
      arrive(p2, legs[1], 'below');
      leave(p2, legs[2], { rotateY: -16 }); // sai pela direita
      arrive(p3, legs[2], 'left');          // volta à coluna central

      // começa quando chega ao centro e termina antes de sair
      screens(p1, centered[0], legs[1]);
      screens(p2, centered[1], legs[2]);
      screens(p3, centered[2], end);

      return () => section.classList.remove('is-u');
    }
  );
})();
