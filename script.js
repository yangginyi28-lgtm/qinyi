// Builds the page from data.json — edit that file to change the site's content.

const esc = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const pad = (n) => String(n).padStart(2, "0");

const $ = (id) => document.getElementById(id);

function renderSite(site) {
  document.title = site.title;
  $("nav-logo").innerHTML = `${esc(site.logo)}<span>.</span>`;
  $("hero-label").textContent = site.heroLabel;
  $("hero-title").textContent = site.heroTitle;
  $("hero-subtitle").textContent = site.heroSubtitle;
  $("hero-school").textContent = site.school;
  $("hero-button").textContent = site.heroButton;
  $("footer-thanks").textContent = site.footerThanks;
  $("footer-copy").textContent = site.copyright;
}

function renderProfile(p) {
  $("about-photo").innerHTML = `<img src="${esc(p.photo)}" alt="Portrait of ${esc(p.name)}">`;
  $("about-name").innerHTML = `${esc(p.nameZh)} <span>${esc(p.name)}</span>`;
  $("about-role").innerHTML = `${esc(p.role)}<br><span class="zh">${esc(p.roleZh)}</span>`;
  $("about-summary").textContent = p.summary;

  $("about-tags").innerHTML = [
    ...(p.skills || []).map((s) => `<span class="tag">${esc(s)}</span>`),
    ...(p.badges || []).map((b) => `<span class="tag tag--outline">${esc(b)}</span>`),
  ].join("");

  $("about-langs").innerHTML = (p.languages || [])
    .map((l) => `<li>${esc(l.name)} <span class="zh">${esc(l.zh)}</span></li>`)
    .join("");
}

function renderEducation(list) {
  $("education").innerHTML = list
    .map(
      (e) => `
      <li>
        <span class="timeline__year">${esc(e.year)}</span>
        <p>${esc(e.title)}</p>
        ${e.zh ? `<p class="zh">${esc(e.zh)}</p>` : ""}
      </li>`
    )
    .join("");
}

function renderExperience(exp) {
  const group = (label, labelZh, items) =>
    items && items.length
      ? `<h4 class="card__sub">${label} <span class="zh">${labelZh}</span></h4>
         <ul class="list">
           ${items.map((i) => `<li>${esc(i.title)}${i.zh ? `<span class="zh">${esc(i.zh)}</span>` : ""}</li>`).join("")}
         </ul>`
      : "";

  $("experience").innerHTML =
    group("Current", "現任", exp.current) + group("Previous", "曾任", exp.previous);
}

function renderProjects(projects) {
  $("project-list").innerHTML = projects
    .map((p, i) => {
      const gallery = p.gallery || [];
      const galleryClass = gallery.length === 3 ? "gallery--3" : "gallery--4";
      return `
      <article class="project${i % 2 ? " project--alt" : ""}">
        <div class="project__hero">
          <img src="${esc(p.hero)}" alt="Rendering of ${esc(p.title)}">
        </div>
        <div class="container project__body">
          <header class="project__header">
            <span class="project__num">${pad(i + 1)}</span>
            <div>
              <h3 class="project__title">${esc(p.title)}</h3>
              ${p.titleZh ? `<p class="project__zh">${esc(p.titleZh)}</p>` : ""}
              ${p.meta ? `<p class="project__meta">${esc(p.meta)}</p>` : ""}
            </div>
          </header>
          <div class="project__cols">
            ${(p.sections || [])
              .map((s) => `<div><h4>${esc(s.heading)}</h4><p>${esc(s.text)}</p></div>`)
              .join("")}
          </div>
          <div class="gallery ${galleryClass}">
            ${gallery.map((g) => `<img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy">`).join("")}
          </div>
        </div>
      </article>`;
    })
    .join("");
}

function renderCertificates(certs) {
  $("certificate-list").innerHTML = certs
    .map(
      (c) => `
      <div class="container certificate__grid">
        <div>
          <h3 class="certificate__name">${esc(c.name)}</h3>
          <p class="certificate__date">${esc(c.date)}</p>
        </div>
        <figure class="certificate__img">
          <img src="${esc(c.image)}" alt="${esc(c.name)}" loading="lazy">
        </figure>
      </div>`
    )
    .join("");
}

function renderContact(c) {
  $("contact-heading").textContent = c.heading;
  const items = [];
  if (c.email)
    items.push(`<a href="mailto:${esc(c.email)}" class="contact__item"><span class="contact__label">Email</span>${esc(c.email)}</a>`);
  if (c.phone)
    items.push(`<a href="tel:${esc(c.phone.replace(/[^\d+]/g, ""))}" class="contact__item"><span class="contact__label">Phone</span>${esc(c.phone)}</a>`);
  if (c.location)
    items.push(`<div class="contact__item"><span class="contact__label">Location</span>${esc(c.location)}</div>`);
  $("contact-list").innerHTML = items.join("");
}

fetch("data.json")
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then((data) => {
    renderSite(data.site);
    renderProfile(data.profile);
    renderEducation(data.education || []);
    renderExperience(data.experience || {});
    renderProjects(data.projects || []);
    renderCertificates(data.certificates || []);
    renderContact(data.contact || {});
    // Re-apply #hash scrolling now that the content exists.
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
  })
  .catch((err) => {
    console.error(err);
    document.getElementById("load-error").hidden = false;
  });
