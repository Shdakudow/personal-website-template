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
  $('[data-tagline]').textContent = content.tagline;
  $('[data-about]').textContent = content.about;
  $('#year').textContent = new Date().getFullYear();
  const experience = content.experience || [];
  const education = content.education || [];
  $('#profile-grid').hidden = experience.length === 0 && education.length === 0;
  $('#experience-card').hidden = experience.length === 0;
  $('#education-card').hidden = education.length === 0;
  experience.forEach(entry => {
    const block = element('div', 'profile-entry');
    block.append(
      element('p', 'profile-period', entry.period),
      element('h4', 'profile-title', entry.organization),
      element('p', 'profile-subtitle', entry.institution)
    );
    $('#experience-list').append(block);
  });
  education.forEach(entry => {
    const block = element('div', 'profile-entry');
    block.append(
      element('p', 'profile-period', entry.period),
      element('h4', 'profile-title', entry.institution),
      element('p', 'profile-subtitle', entry.degree)
    );
    if (entry.note) block.append(element('p', 'profile-note', entry.note));
    $('#education-list').append(block);
  });
  const validEmail = content.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.email);
  document.querySelectorAll('[data-email]').forEach(link => {
    link.hidden = !validEmail;
    if (!validEmail) return;
    link.href = `mailto:${content.email}`;
    if (link.hasAttribute('data-email-label')) link.textContent = content.email;
  });
  document.querySelectorAll('[data-cv]').forEach(link => {
    const url = safeUrl(content.cv);
    link.hidden = !url;
    if (url) { link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  });
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
  const semesterOrder = term => {
    const [season, year] = term.split(' ');
    return (Number(year) || 0) * 10 + ({ Winter: 1, Spring: 2, Summer: 3, Fall: 4 }[season] || 0);
  };
  const semesters = [...new Set(courses.map(course => course.term))].sort((a, b) => semesterOrder(b) - semesterOrder(a));
  const semesterState = new Map(semesters.map((term, index) => [term, index === 0 || index === Math.ceil(semesters.length / 2)]));
  function renderCourses() {
    const query = $('#course-search').value.trim().toLowerCase();
    const filtered = courses.filter(course => [course.code, course.title, course.professor, course.term].join(' ').toLowerCase().includes(query));
    $('#semester-groups').replaceChildren();
    const visibleSemesters = semesters.filter(term => filtered.some(course => course.term === term));
    const semestersPerPage = Math.ceil(visibleSemesters.length / 2);
    let page;
    visibleSemesters.forEach((term, index) => {
      const semesterCourses = filtered.filter(course => course.term === term);
      if (index % semestersPerPage === 0) {
        page = element('div', 'course-page');
        $('#semester-groups').append(page);
      }
      const group = element('details', 'semester-group');
      group.open = Boolean(query) || semesterState.get(term);
      const summary = element('summary', 'semester-summary');
      const heading = element('h3', 'semester-heading', term);
      heading.id = `semester-${index}`;
      group.setAttribute('aria-labelledby', heading.id);
      const count = element('span', 'semester-count', `${semesterCourses.length} ${semesterCourses.length === 1 ? 'class' : 'classes'}`);
      const indicator = element('span', 'semester-toggle', '⌄');
      indicator.setAttribute('aria-hidden', 'true');
      summary.append(heading, count, indicator);
      const list = element('ul', 'course-list');
      semesterCourses.forEach(course => {
        const row = element('li', 'course-row');
        const source = safeUrl(course.source);
        const title = element(source ? 'a' : 'span', 'course-title', course.title);
        if (source) { title.href = source; title.target = '_blank'; title.rel = 'noopener noreferrer'; }
        row.append(element('span', 'course-code', course.code), title);
        if (course.professor) row.append(element('span', 'course-professor', course.professor));
        list.append(row);
      });
      group.append(summary, list);
      group.addEventListener('toggle', () => { if (!query) semesterState.set(term, group.open); });
      page.append(group);
    });
    $('#no-courses').hidden = filtered.length > 0;
    $('#course-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'class' : 'classes'}`;
  }
  $('#course-search').addEventListener('input', renderCourses);
  renderCourses();
  const publications = content.publications || [];
  $('#research').hidden = publications.length === 0;
  $('[data-research-link]').hidden = publications.length === 0;
  publications.forEach(publication => {
    const article = element('article', 'publication-card');
    article.append(
      element('p', 'publication-meta', `${publication.authors.join(', ')} · arXiv preprint · ${publication.year}`),
      element('h3', '', publication.title),
      element('p', 'publication-summary', publication.summary)
    );
    const links = element('div', 'publication-links');
    [['Read on arXiv ↗', publication.url], ['PDF ↗', publication.pdf]].forEach(([label, value]) => {
      const url = safeUrl(value);
      if (!url) return;
      const link = element('a', 'text-link', label);
      link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      links.append(link);
    });
    article.append(links);
    $('#publication-list').append(article);
  });
  const projects = (content.projects || []).filter(project => !project.draft);
  $('#projects').hidden = projects.length === 0;
  $('[data-projects-link]').hidden = projects.length === 0;
  projects.forEach(project => {
    const article = element('article', 'project-card');
    article.append(element('div', 'project-category', project.category), element('h3', '', project.title), element('p', '', project.description));
    const url = safeUrl(project.url);
    const action = element(url ? 'a' : 'button', 'project-action', url ? 'View project ↗' : 'Details →');
    if (url) { action.href = url; action.target = '_blank'; action.rel = 'noopener noreferrer'; }
    else { action.type = 'button'; action.addEventListener('click', () => showDetails({eyebrow: project.category, title: project.title, meta: 'Example project · ready to customize', description: project.description + ' Replace this entry with your own project and add a URL to link directly to it.'})); }
    article.append(action); $('#project-list').append(article);
  });
})();
