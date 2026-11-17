// Room colours: whichever section crosses the middle of the screen sets the body's palette.
const rooms = document.querySelectorAll('[data-room]');
document.body.dataset.room = 'limestone';
const io = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) document.body.dataset.room = e.target.dataset.room;
}, { rootMargin: '-50% 0px -50% 0px' });
rooms.forEach(r => io.observe(r));

// Index hover swaps the preview image.
const preview = document.querySelector('.preview img');
document.querySelectorAll('.index a').forEach(a => {
  new Image().src = a.dataset.preview;
  const show = () => {
    if (preview.getAttribute('src') === a.dataset.preview) return;
    preview.classList.add('swap');
    setTimeout(() => { preview.src = a.dataset.preview; preview.classList.remove('swap'); }, 180);
  };
  a.addEventListener('mouseenter', show);
  a.addEventListener('focus', show);
});

// Lightbox for drawings and renders.
const box = document.querySelector('.lightbox');
const boxImg = box.querySelector('img');
const boxCap = box.querySelector('.lb-cap');
document.querySelectorAll('.g img, .bleed img').forEach(img => {
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
