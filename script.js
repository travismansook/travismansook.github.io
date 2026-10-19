(() => {
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.project-card')];
  document.querySelector('.filter-row').hidden = false;
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    cards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.language !== button.dataset.filter; });
    const count = cards.filter(card => !card.hidden).length;
    document.getElementById('filter-status').textContent = `${count} ${button.dataset.filter === 'all' ? '' : button.dataset.filter + ' '}${count === 1 ? 'project' : 'projects'} shown.`;
  }));
  document.getElementById('year').textContent = new Date().getFullYear();
  const navLinks = [...document.querySelectorAll('nav a')];
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            const active = link.hash === '#' + entry.target.id;
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        }
      });
    }, { rootMargin: '-10% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
  }
})();
