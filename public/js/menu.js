// Menu do celular (abaixo de 900px): o botão da nav abre um painel em tela cheia
// com os mesmos links da .nav-links. Sem JS o botão não aparece (CSS depende de html.has-menu).
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const panel = document.getElementById('menu-mobile');
  const list = panel && panel.querySelector('nav');
  if (!toggle || !list) return;

  const root = document.documentElement;

  // Fonte única: os links vêm da nav de desktop, numerados 01, 02...
  document.querySelectorAll('.nav-links a').forEach((a, i) => {
    const link = a.cloneNode(true);
    link.classList.remove('active');
    link.removeAttribute('aria-current');
    link.style.setProperty('--i', i);
    link.insertAdjacentHTML('afterbegin', `<span>${String(i + 1).padStart(2, '0')}</span>`);
    list.appendChild(link);
  });
  const links = [...list.querySelectorAll('a')];
  root.classList.add('has-menu');

  const isOpen = () => root.classList.contains('menu-open');

  function setOpen(open) {
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  toggle.addEventListener('click', () => {
    setOpen(!isOpen());
    if (isOpen()) links[0].focus({ preventScroll: true });
  });

  // Ao tocar num link o menu fecha e a âncora segue normalmente
  links.forEach((a) => a.addEventListener('click', () => setOpen(false)));

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    }
    // Tab circula só entre a nav e o menu (o resto da página está coberto)
    if (e.key === 'Tab') {
      const items = [...document.querySelectorAll('.nav-brand a, .nav-cta, .nav-toggle'), ...links];
      const i = items.indexOf(document.activeElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i + 1) % items.length;
      e.preventDefault();
      items[next].focus();
    }
  });

  // Se a tela crescer para o layout de desktop com o menu aberto, fecha
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
})();
