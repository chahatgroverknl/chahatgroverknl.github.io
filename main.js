// Room colours: whichever visible section crosses the middle of the screen sets the body's palette.
const io = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) document.body.dataset.room = e.target.dataset.room;
}, { rootMargin: '-50% 0px -50% 0px' });
document.querySelectorAll('[data-room]').forEach(r => io.observe(r));
document.body.dataset.room = 'limestone';

// Views: the home page lists projects; #<project-id> opens that project on its own.
const projects = [...document.querySelectorAll('.project')];
const baseTitle = document.title;
let homeY = 0;
let current = null;

function route() {
  const id = decodeURIComponent(location.hash.slice(1));
  const open = projects.find(p => p.id === id) || null;
  if (!current && open) homeY = scrollY;           // remember where the visitor was on the home page

  projects.forEach(p => p.classList.toggle('is-open', p === open));
  document.body.classList.toggle('viewing', !!open);

  if (open) {
    document.body.dataset.room = open.dataset.room;
    document.title = open.querySelector('.p-title').textContent + ' — Chahat Grover';
    scrollTo({ top: 0, behavior: 'instant' });
    if (current) open.querySelector('.p-title').focus({ preventScroll: true });
  } else {
    document.title = baseTitle;
    const target = id && document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'instant' });
    else scrollTo({ top: current ? homeY : 0, behavior: 'instant' });
  }
  current = open;
}
addEventListener('hashchange', route);
route();

// On the home page, hovering a project previews its room colour.
if (matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.card').forEach(c => {
    c.addEventListener('mouseenter', () => { document.body.dataset.room = c.dataset.previewRoom; });
    c.addEventListener('mouseleave', () => { document.body.dataset.room = 'limestone'; });
  });
}

// Lightbox for drawings and renders.
const box = document.querySelector('.lightbox');
const boxImg = document.createElement('img');
box.insertBefore(boxImg, box.querySelector('.lb-cap'));
const boxCap = box.querySelector('.lb-cap');
document.querySelectorAll('.g img, .bleed img, .zones img').forEach(img => {
  img.tabIndex = 0;
  const open = () => {
    boxImg.src = img.src;
    boxImg.alt = img.alt;
    boxCap.textContent = img.closest('figure')?.querySelector('figcaption')?.textContent || img.alt;
    box.showModal();
  };
  img.addEventListener('click', open);
  img.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
});
box.addEventListener('click', e => { if (e.target === box || e.target === boxImg) box.close(); });
