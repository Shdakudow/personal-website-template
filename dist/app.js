(() => {
  'use strict';
  const content = window.siteContent;
  const $ = selector => document.querySelector(selector);
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const safeUrl = value => {
    try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
    catch { return null; }
  };
  document.title = `${content.name} — Personal website`;
  document.querySelectorAll('[data-name]').forEach(node => { node.textContent = content.name; });
  document.querySelectorAll('[data-initials]').forEach(node => { node.textContent = content.initials; });
  document.querySelectorAll('[data-github]').forEach(node => {
    const url = safeUrl(content.github);
    if (url) node.href = url; else node.hidden = true;
  });
  $('[data-bio]').textContent = content.bio;
  $('[data-tagline]').textContent = content.tagline;
  $('[data-about]').textContent = content.about;
  $('#year').textContent = new Date().getFullYear();
  if (content.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.email)) {
    $('#email-link').href = `mailto:${content.email}`;
    $('#email-link').hidden = false;
  }
  const dialog = $('#detail-dialog');
  function showDetails({ eyebrow, title, meta, description, resources = [] }) {
    $('#dialog-eyebrow').textContent = eyebrow;
    $('#dialog-title').textContent = title;
    $('#dialog-meta').textContent = meta;
    $('#dialog-description').textContent = description;
    $('#dialog-resources').replaceChildren();
    resources.forEach(resource => {
      const url = safeUrl(resource.url);
      if (!url) return;
      const link = element('a', 'text-link', `${resource.label} ↗`);
      link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      $('#dialog-resources').append(link);
    });
    dialog.showModal();
  }
  $('#close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  const courses = content.courses || [];
  [...new Set(courses.map(course => course.term))].forEach(term => {
    const option = element('option', '', term); option.value = term; $('#term-filter').append(option);
  });
  function renderCourses() {
    const query = $('#course-search').value.trim().toLowerCase();
    const term = $('#term-filter').value;
    const filtered = courses.filter(course => (term === 'all' || course.term === term) && [course.code, course.title, course.description, course.role, course.term, ...(course.tags || [])].join(' ').toLowerCase().includes(query));
    $('#course-list').replaceChildren();
    filtered.forEach(course => {
      const button = element('button', 'course-row'); button.type = 'button';
      button.setAttribute('aria-label', `View ${course.code}: ${course.title}`);
      const details = element('div');
      details.append(element('div', 'course-title', course.title));
      const meta = element('div', 'course-meta');
      meta.append(element('span', '', course.term), element('span', '', '·'), element('span', '', course.role));
      (course.tags || []).forEach(tag => meta.append(element('span', 'course-tag', tag)));
      details.append(meta);
      const arrow = element('span', 'arrow-circle', '↗'); arrow.setAttribute('aria-hidden', 'true');
      button.append(element('span', 'course-code', course.code), details, arrow);
      button.addEventListener('click', () => showDetails({eyebrow: course.code, title: course.title, meta: `${course.term} · ${course.role}`, description: course.description, resources: course.resources}));
      $('#course-list').append(button);
    });
    $('#no-courses').hidden = filtered.length > 0;
    $('#course-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'class' : 'classes'}${term !== 'all' ? ` · ${term}` : ' · All semesters'}`;
    $('.template-note').hidden = !courses.some(course => (course.tags || []).includes('Example'));
  }
  $('#term-filter').addEventListener('change', renderCourses);
  $('#course-search').addEventListener('input', renderCourses);
  renderCourses();
  (content.projects || []).forEach(project => {
    const article = element('article', 'project-card');
    article.append(element('div', 'project-category', project.category), element('h3', '', project.title), element('p', '', project.description));
    const bottom = element('div', 'project-bottom'); const tags = element('div', 'tags');
    (project.tags || []).forEach(tag => tags.append(element('span', 'tag', tag)));
    const url = safeUrl(project.url);
    const action = element(url ? 'a' : 'button', 'project-action', url ? 'Explore project ↗' : 'View template ↗');
    if (url) { action.href = url; action.target = '_blank'; action.rel = 'noopener noreferrer'; }
    else { action.type = 'button'; action.addEventListener('click', () => showDetails({eyebrow: project.category, title: project.title, meta: 'Example project · ready to customize', description: project.description + ' Replace this entry with your own project and add a URL to link directly to it.'})); }
    bottom.append(tags, action); article.append(bottom); $('#project-list').append(article);
  });
})();
