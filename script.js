// Builds the page from data.json — edit that file to change the site's content.

const esc = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const pad = (n) => String(n).padStart(2, "0");
const $ = (id) => document.getElementById(id);

const ICONS = {
  email: '<svg viewBox="0 0 24 24"><path d="M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1 2.2V17h16V7.2l-8 5.3-8-5.3zM5.3 7l6.7 4.4L18.7 7H5.3z"/></svg>',
  phone: '<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8z"/></svg>',
  location: '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7zm0 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/></svg>',
};

const tags = (items = []) => items.map((t) => `<span>${esc(t)}</span>`).join("");

function renderSite(site, profile) {
  document.title = site.title;
  const name = profile.name;
  $("nav-logo").innerHTML = `<span>${esc(name.charAt(0))}</span>${esc(name.slice(1))}.`;
  $("footer-thanks").textContent = site.footerThanks;
  $("footer-copy").textContent = site.copyright;
}

function renderProfile(p) {
  $("hero-title").innerHTML = `Hi, I'm <span class="accent">${esc(p.name)}</span>`;
  $("hero-role").textContent = p.role;
  $("hero-zh").textContent = [p.nameZh, p.roleZh].filter(Boolean).join(" · ");
  $("hero-intro").textContent = p.intro;
  $("hero-photo").innerHTML = `<img src="${esc(p.photo)}" alt="Portrait of ${esc(p.name)} ${esc(p.nameZh)}">`;

  const badge = $("hero-badge");
  if (p.badge) {
    badge.innerHTML = `<strong>${esc(p.badge.title)}</strong><span>${esc(p.badge.subtitle)}</span>`;
  } else {
    badge.remove();
  }

  $("about-text").innerHTML = (p.about || []).map((para) => `<p>${esc(para)}</p>`).join("");
  $("about-skills").innerHTML = tags(p.skills);
  $("about-langs").innerHTML = tags(p.languages);
}

function renderEducation(list = []) {
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

function renderExperience({ current = [], previous = [] } = {}) {
  const group = (label, zh, items) =>
    items.length
      ? `<h5 class="card__label">${label} <span class="zh">${zh}</span></h5>
         <ul class="list">
           ${items.map((i) => `<li>${esc(i.title)}${i.zh ? `<span class="zh">${esc(i.zh)}</span>` : ""}</li>`).join("")}
         </ul>`
      : "";
  $("experience").innerHTML = group("Current", "現任", current) + group("Previous", "曾任", previous);
}

function renderProjects(list = []) {
  $("project-list").innerHTML = list
    .map(
      (p, i) => `
      <article class="project${i % 2 ? " project--flip" : ""}">
        <div class="project__media">
          <img class="project__hero" src="${esc(p.hero)}" alt="${esc(p.title)} rendering" ${i ? 'loading="lazy"' : ""}>
          <div class="project__gallery">
            ${(p.gallery || []).map((g) => `<img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy">`).join("")}
          </div>
        </div>
        <div class="project__body">
          <span class="project__num">${pad(i + 1)}</span>
          <h3>${esc(p.title)}</h3>
          ${p.titleZh ? `<p class="project__zh">${esc(p.titleZh)}</p>` : ""}
          ${p.meta ? `<p class="project__meta">${esc(p.meta)}</p>` : ""}
          ${(p.sections || []).map((s) => `<h4>${esc(s.heading)}</h4><p>${esc(s.text)}</p>`).join("")}
        </div>
      </article>`
    )
    .join("");
}

function renderCertificates(list = []) {
  $("certificate-list").innerHTML = list
    .map(
      (c) => `
      <div class="cert">
        <div class="cert__text">
          <h3 class="cert__issuer">${esc(c.issuer)}</h3>
          <p class="cert__name">${esc(c.name)}</p>
          <p class="cert__date">${esc(c.date)}</p>
        </div>
        ${c.image ? `<img class="cert__img" src="${esc(c.image)}" alt="${esc(c.issuer)} — ${esc(c.name)} certificate" loading="lazy">` : ""}
      </div>`
    )
    .join("");
}

function renderContact(c = {}) {
  const items = [
    c.email && { icon: "email", label: "Email", value: c.email, href: `mailto:${esc(c.email)}` },
    c.phone && { icon: "phone", label: "Phone", value: c.phone, href: `tel:${esc(c.phoneLink || c.phone.replace(/\s/g, ""))}` },
    c.address && { icon: "location", label: "Address", value: c.address, href: "#contact" },
  ].filter(Boolean);

  $("contact-lead").textContent = c.lead || "";
  $("contact-list").innerHTML = items
    .map(
      (i) => `
      <a class="contact__item" href="${i.href}">
        <span class="card__icon">${ICONS[i.icon]}</span>
        <span><small>${i.label}</small>${esc(i.value)}</span>
      </a>`
    )
    .join("");
  $("hero-social").innerHTML = items
    .map((i) => `<a href="${i.href}" aria-label="${i.label}">${ICONS[i.icon]}</a>`)
    .join("");
}

function showError(html, err) {
  console.error(err);
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
        ["site", () => renderSite(data.site, data.profile)],
        ["profile", () => renderProfile(data.profile)],
        ["education", () => renderEducation(data.education)],
        ["experience", () => renderExperience(data.experience)],
        ["projects", () => renderProjects(data.projects)],
        ["certificates", () => renderCertificates(data.certificates)],
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
