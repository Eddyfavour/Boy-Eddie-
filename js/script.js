// Shared navigation, theme, scroll reveals, planner and contact validation.
document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('favour-theme');
  if (savedTheme === 'light') root.classList.add('light');
  document.querySelectorAll('.theme-toggle').forEach(button => {
    button.addEventListener('click', () => {
      root.classList.toggle('light');
      localStorage.setItem('favour-theme', root.classList.contains('light') ? 'light' : 'dark');
    });
  });

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (menuButton && nav) menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  const revealItems = document.querySelectorAll('.reveal');
  // BIOGRAPHY — SCROLL-DRIVEN WORD REVEAL
const aboutCopy = document.querySelector('.about-copy');

if (aboutCopy) {
  const paragraphs = aboutCopy.querySelectorAll(':scope > p');
  const bioWords = [];

  paragraphs.forEach(paragraph => {
    const walker = document.createTreeWalker(
      paragraph,
      NodeFilter.SHOW_TEXT
    );

    const textNodes = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach(node => {
      const parts = node.textContent.split(/(\s+)/);
      const fragment = document.createDocumentFragment();

      parts.forEach(part => {
        if (!part || /^\s+$/.test(part)) {
          fragment.appendChild(document.createTextNode(part));
        } else {
          const word = document.createElement('span');
          word.className = 'bio-word';
          word.textContent = part;

          fragment.appendChild(word);
          bioWords.push(word);
        }
      });

      node.parentNode.replaceChild(fragment, node);
    });
  });

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  let ticking = false;

  function updateBioReveal() {
    const rect = aboutCopy.getBoundingClientRect();
    const start = window.innerHeight * 0.85;
    const end = window.innerHeight * 0.10;

    const progress = clamp(
      (start - rect.top) / (start - end),
      0,
      1
    );

    const position = progress * bioWords.length;

    bioWords.forEach((word, index) => {
      const amount = clamp(position - index, 0, 1);

      word.style.opacity = 0.2 + (amount * 0.8);
      word.classList.toggle(
        'is-lit',
        amount > 0 && amount < 1
      );
    });

    ticking = false;
  }

  function requestBioUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateBioReveal);
    }
  }

  window.addEventListener('scroll', requestBioUpdate, {
    passive: true
  });

  window.addEventListener('resize', requestBioUpdate);

  updateBioReveal();
}
// ONE-TIME QUOTE ENTRANCE

const aboutQuote = document.querySelector('.about-copy blockquote');

if (aboutQuote) {
  const quoteObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        aboutQuote.classList.add('quote-revealed');
        quoteObserver.unobserve(aboutQuote);
      }
    });
  }, { threshold: 0.5 });

  quoteObserver.observe(aboutQuote);
}
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add('visible'));

  // Academic planner: tasks are saved in this browser using localStorage.
  const taskForm = document.getElementById('task-form');
  if (taskForm) {
    const input = document.getElementById('task-input');
    const dateInput = document.getElementById('task-date');
    const list = document.getElementById('task-list');
    const count = document.getElementById('task-count');
    const filters = document.querySelectorAll('.filter-button');
    let tasks = [];
    try { tasks = JSON.parse(localStorage.getItem('favour-academic-tasks') || '[]'); } catch { tasks = []; }
    let filter = 'all';
    const persist = () => localStorage.setItem('favour-academic-tasks', JSON.stringify(tasks));
    const render = () => {
      list.innerHTML = '';
      const shown = tasks.filter(task => filter === 'all' || (filter === 'active' && !task.done) || (filter === 'completed' && task.done));
      count.textContent = `${tasks.length} TASK${tasks.length === 1 ? '' : 'S'} · ${tasks.filter(t => !t.done).length} TO DO`;
      if (!shown.length) { const empty = document.createElement('li'); empty.className = 'empty-state'; empty.textContent = tasks.length ? 'Nothing in this filter yet.' : 'Your list is clear. Add your first academic task above.'; list.appendChild(empty); return; }
      shown.forEach(task => {
        const li = document.createElement('li'); li.className = `task-item${task.done ? ' completed' : ''}`;
        const check = document.createElement('input'); check.type = 'checkbox'; check.className = 'task-check'; check.checked = task.done; check.setAttribute('aria-label', `Mark ${task.text} complete`);
        check.addEventListener('change', () => { task.done = check.checked; persist(); render(); });
        const text = document.createElement('span'); text.className = 'task-text'; text.textContent = task.text;
        li.append(check, text);
        if (task.due) { const due = document.createElement('time'); due.className = 'task-due'; due.dateTime = task.due; due.textContent = new Date(`${task.due}T00:00:00`).toLocaleDateString(undefined, {day:'numeric', month:'short'}); li.appendChild(due); }
        const del = document.createElement('button'); del.type = 'button'; del.className = 'delete-task'; del.textContent = '×'; del.setAttribute('aria-label', `Delete ${task.text}`); del.addEventListener('click', () => { tasks = tasks.filter(t => t.id !== task.id); persist(); render(); }); li.appendChild(del); list.appendChild(li);
      });
    };
    taskForm.addEventListener('submit', event => { event.preventDefault(); const text = input.value.trim(); if (!text) { input.focus(); return; } tasks.unshift({id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, due: dateInput.value, done: false}); persist(); input.value = ''; dateInput.value = ''; render(); input.focus(); });
    filters.forEach(button => button.addEventListener('click', () => { filter = button.dataset.filter; filters.forEach(item => item.classList.toggle('active', item === button)); render(); }));
    render();
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    const feedback = document.getElementById('form-feedback');
    if (!name || !email || !phone || !message) { feedback.textContent = 'Please complete every field.'; return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { feedback.textContent = 'Enter a valid email address.'; document.getElementById('email').focus(); return; }
    if (!/^\+?\d{7,15}$/.test(phone.replace(/[\s()-]/g, ''))) { feedback.textContent = 'Enter a phone number using digits (an optional + is allowed).'; document.getElementById('phone').focus(); return; }
    feedback.textContent = 'Opening your email app with the message ready…';
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\n${message}`);
    window.location.href = `mailto:chukwufavour555@gmail.com?subject=${subject}&body=${body}`;
  });
});
