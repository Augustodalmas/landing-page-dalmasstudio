// Animações comuns aos 3 protótipos: abertura, entradas genéricas e "site rolando" dentro do mockup.
gsap.registerPlugin(ScrollTrigger);

const DS = {
  ease: 'expo.out',
  motionOk: '(prefers-reduced-motion: no-preference)',

  // Distância que o print precisa subir para mostrar a página inteira dentro da tela do mockup.
  screenTravel(screen) {
    const img = screen.querySelector('img');
    return -Math.max(0, img.offsetHeight - screen.offsetHeight);
  },

  // Tween que rola o print dentro do mockup. Recebe as opções do ScrollTrigger (ou containerAnimation).
  screenScroll(screen, scrollTrigger) {
    return gsap.fromTo(
      screen.querySelector('img'),
      { y: 0 },
      { y: () => DS.screenTravel(screen), ease: 'none', scrollTrigger: { invalidateOnRefresh: true, ...scrollTrigger } }
    );
  },
};

gsap.matchMedia().add(DS.motionOk, () => {
  // Abertura: linhas sobem de dentro da máscara
  gsap.timeline({ defaults: { ease: DS.ease, duration: 1.3 } })
    .from('.p-hero .eyebrow', { autoAlpha: 0, y: 12, duration: 0.8 })
    .from('.p-title .line > span', { yPercent: 110, stagger: 0.09 }, '<0.1')
    .from('.p-sub, .p-scroll', { autoAlpha: 0, y: 16, stagger: 0.12 }, '-=0.9');

  // Entradas genéricas
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      autoAlpha: 0,
      y: 40,
      duration: 1.2,
      ease: DS.ease,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Títulos com máscara de linha fora da abertura
  gsap.utils.toArray('[data-lines]').forEach((el) => {
    gsap.from(el.querySelectorAll('.line > span'), {
      yPercent: 110,
      duration: 1.3,
      stagger: 0.08,
      ease: DS.ease,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
});

// Imagens carregadas mudam alturas: recalcula os gatilhos
window.addEventListener('load', () => ScrollTrigger.refresh());
