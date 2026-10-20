// Builds the page from data.json — edit that file to change the site's content.

const esc = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const pad = (n) => String(n).padStart(2, "0");
const $ = (id) => document.getElementById(id);
const chips = (items = []) => items.map((t) => `<li>${esc(t)}</li>`).join("");

function renderSite(site = {}) {
  document.title = site.title || "Portfolio";
  $("nav-logo").textContent = `${site.logo}.`;
  $("footer-logo").textContent = `${site.logo}.`;
  $("footer-copy").textContent = site.copyright || "";
}

function renderProfile(p) {
  $("hero-greeting").textContent = p.greeting;
  $("hero-photo").innerHTML = `<img src="${esc(p.photo)}" alt="${esc(p.photoAlt)}">`;
  $("hero-status").innerHTML = `<span class="dot"></span>${esc(p.status)}`;
  $("hero-spec").textContent = p.specialty;
  $("hero-name").innerHTML = `I am<br>${esc(p.name)}`;
  // A space before each <br> keeps words apart when the phone layout hides the line breaks
  $("hero-role").innerHTML = (p.role || []).map(esc).join(" <br>");
  $("hero-subtitle").textContent = p.subtitle || "";
}

function renderProjects({ subtitle = "", items = [] } = {}) {
  $("projects-subtitle").textContent = subtitle;
  $("project-list").innerHTML = items
    .map(
      (p, i) => `
      <article class="project">
        <div class="project__img"><img src="${esc(p.image)}" alt="${esc(p.title)} rendering" ${i > 1 ? 'loading="lazy"' : ""}></div>
        <div class="project__body">
          <span class="project__num">${pad(i + 1)} · ${esc(p.category)}</span>
          <h3>${esc(p.title)}</h3>
          ${p.titleZh ? `<p class="zh">${esc(p.titleZh)}</p>` : ""}
          <p>${esc(p.description)}</p>
          <ul class="chips">${chips(p.tags)}</ul>
        </div>
      </article>`
    )
    .join("");
}

function renderServices(list = []) {
  $("service-list").innerHTML = list
    .map(
      (s, i) => `
      <div class="service">
        <span class="service__num">${pad(i + 1)}</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
      </div>`
    )
    .join("");
}

function renderAbout(a) {
  $("about-lead").textContent = a.lead;
  $("about-text").innerHTML = (a.paragraphs || []).map((t) => `<p>${esc(t)}</p>`).join("");
  $("about-stats").innerHTML = (a.stats || [])
    .map((s) => `<div><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`)
    .join("");
  $("about-image").innerHTML = a.image ? `<img src="${esc(a.image)}" alt="${esc(a.imageAlt)}" loading="lazy">` : "";
}

function renderExperience(list = []) {
  $("experience-list").innerHTML = list
    .map(
      (e) => `
      <div class="row">
        <span class="row__year">${esc(e.period)}</span>
        <div class="row__title">
          <h3>${esc(e.title)}</h3>
          ${e.zh ? `<p class="zh">${esc(e.zh)}</p>` : ""}
        </div>
        <ul class="row__list">${chips(e.tags)}</ul>
      </div>`
    )
    .join("");
}

function renderSkills({ software = [], languages = [], certificate } = {}) {
  $("skills-software").innerHTML = chips(software);
  $("skills-languages").innerHTML = languages
    .map((l) => `<li><span>${esc(l.name)}</span><small>${esc(l.level)}</small></li>`)
    .join("");

  const cert = $("skills-certificate");
  if (certificate) {
    cert.innerHTML = `
      ${certificate.image ? `<img src="${esc(certificate.image)}" alt="${esc(certificate.title)} certificate" loading="lazy">` : ""}
      <div>
        <h4>${esc(certificate.title)}</h4>
        <p>${esc(certificate.detail)}</p>
      </div>`;
  } else {
    cert.remove();
  }
}

function renderGallery(list = []) {
  $("gallery-list").innerHTML = list
    .map((g) => `<img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy">`)
    .join("");
}

function renderContact(c = {}) {
  $("contact-greeting").textContent = c.greeting || "";
  $("contact-title").textContent = c.title || "";
  $("contact-lead").textContent = c.lead || "";
  const email = $("contact-email");
  if (c.email) {
    email.href = `mailto:${c.email}`;
    email.textContent = c.email;
  } else {
    email.remove();
  }
}

function showError(html, err) {
  if (err) console.error(err);
  $("load-error").innerHTML = html;
  $("load-error").hidden = false;
}

fetch("data.json")
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  })
  .then(
    (text) => {
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        // Usually a missing/extra comma or quote after editing data.json
        return showError(`<code>data.json</code> has a formatting mistake: ${esc(err.message)}`, err);
      }

      // Render each section on its own so one bad section doesn't blank the rest
      const sections = [
        ["site", () => renderSite(data.site)],
        ["profile", () => renderProfile(data.profile)],
        ["projects", () => renderProjects(data.projects)],
        ["services", () => renderServices(data.services)],
        ["about", () => renderAbout(data.about)],
        ["experience", () => renderExperience(data.experience)],
        ["skills", () => renderSkills(data.skills)],
        ["gallery", () => renderGallery(data.gallery)],
        ["contact", () => renderContact(data.contact)],
      ];
      const failed = [];
      for (const [name, render] of sections) {
        try {
          render();
        } catch (err) {
          console.error(`Problem in the "${name}" section of data.json`, err);
          failed.push(name);
        }
      }
      if (failed.length) {
        showError(`Check these parts of <code>data.json</code>: ${failed.map(esc).join(", ")} (see the browser console for details).`);
      }
    },
    (err) =>
      showError(
        `Couldn't load <code>data.json</code>. Open this site through a web server
         (or a host like GitHub Pages) rather than double-clicking index.html.`,
        err
      )
  );
