const menuBtn = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const headerInner = document.querySelector(".header-inner");

const setupHeaderLogoMarian = () => {
  const headerLogoImg = document.querySelector(".site-header .logo-marks img");
  if (!headerLogoImg) return;
  headerLogoImg.setAttribute("src", "Imagini/Logo_marian.png");
  headerLogoImg.classList.add("logo-marian");
};
const normalizeHtmlPageName = (pageName) => {
  const trimmed = String(pageName || "").trim();
  if (!trimmed || trimmed === "/") return "index.html";
  const noQuery = trimmed.split("?")[0].split("#")[0].replace(/^\/+/, "");
  if (!noQuery) return "index.html";
  return noQuery.endsWith(".html") ? noQuery : `${noQuery}.html`;
};
const currentPage = normalizeHtmlPageName(location.pathname.split("/").pop() || "index.html");
const isEnglishPage = currentPage.endsWith("-en.html") || currentPage === "en.html";
const admissionPage = isEnglishPage ? "inregistrare-en.html" : "inregistrare.html";
const contactPage = isEnglishPage ? "contact-en.html" : "contact.html";
const teamPage = isEnglishPage ? "echipa-en.html" : "echipa.html";
const coursesPage = isEnglishPage ? "cursuri-en.html" : "cursuri.html";
const i18n = {
  common: {
    call: isEnglishPage ? "Call" : "Sună",
    email: "Email",
    apply: isEnglishPage ? "Apply" : "Înscrie-te",
    noBadges: isEnglishPage ? "No badges published yet." : "Nu există încă badge-uri publicate.",
    loadBadgesErr: isEnglishPage
      ? "Could not load badge catalog. Please verify data/badges.json."
      : "Nu s-a putut încărca catalogul de badge-uri. Verifică fișierul data/badges.json."
  },
  badgeGrid: {
    track: isEnglishPage ? "Track" : "Track",
    issuer: isEnglishPage ? "Issued by" : "Emis de",
    date: isEnglishPage ? "Date" : "Data",
    careerImpact: isEnglishPage ? "Career Impact" : "Impact în carieră",
    defaultMarketing: isEnglishPage
      ? "Validated competency on a career-oriented academic path."
      : "Competență validată pe un traseu academic orientat pe carieră.",
    defaultOutcome: isEnglishPage
      ? "Supports your progression toward the next professional level."
      : "Te ajută să avansezi către următorul nivel profesional.",
    defaultCta: isEnglishPage ? "Apply for this course" : "Înscrie-te la curs",
    defaultIssuer: "Cisco Networking Academy"
  }
};

const getRoPath = (fileName) => {
  const normalized = normalizeHtmlPageName(fileName);
  if (normalized === "en.html") return "index.html";
  return normalized.replace(/-en\.html$/i, ".html");
};
const getEnPath = (fileName) => {
  const normalized = normalizeHtmlPageName(fileName);
  if (normalized === "index.html") return "en.html";
  if (normalized === "en.html") return "en.html";
  return normalized.endsWith("-en.html") ? normalized : normalized.replace(/\.html$/i, "-en.html");
};
const getTargetPathForLang = (lang, fileName) => {
  const normalized = normalizeHtmlPageName(fileName);
  return lang === "en" ? getEnPath(normalized) : getRoPath(normalized);
};
const toPublicPath = (fileName) => {
  const normalized = normalizeHtmlPageName(fileName);
  if (normalized === "index.html") return "/";
  if (normalized === "en.html") return "en.html";
  return normalized.replace(/\.html$/i, "");
};

const setupLanguageSwitcher = () => {
  if (!headerInner || headerInner.querySelector("[data-lang-switch]")) return;

  const langSwitch = document.createElement("div");
  langSwitch.className = "lang-switch";
  langSwitch.setAttribute("data-lang-switch", "");
  langSwitch.setAttribute("aria-label", "Language selector");
  langSwitch.innerHTML = `
    <button type="button" class="lang-switch__btn" data-lang="ro" aria-label="Română">🇷🇴 RO</button>
    <button type="button" class="lang-switch__btn" data-lang="en" aria-label="English">🇬🇧 EN</button>
  `;

  const navEl = headerInner.querySelector(".nav");
  if (navEl) {
    headerInner.insertBefore(langSwitch, navEl);
  } else {
    headerInner.appendChild(langSwitch);
  }

  const applyLangState = (lang) => {
    langSwitch.querySelectorAll("[data-lang]").forEach((button) => {
      button.classList.toggle("is-active", button.getAttribute("data-lang") === lang);
    });
  };

  const currentLang = isEnglishPage ? "en" : "ro";
  applyLangState(currentLang);

  langSwitch.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-lang]");
    if (!button) return;
    const lang = button.getAttribute("data-lang");
    if (lang !== "ro" && lang !== "en") return;
    applyLangState(lang);
    const target = getTargetPathForLang(lang, currentPage);
    const targetPublicPath = toPublicPath(target);
    if (targetPublicPath === toPublicPath(currentPage)) return;
    location.href = targetPublicPath;
  });
};

if (headerInner && !headerInner.querySelector("[data-header-contact-meta]")) {
  const headerContactMeta = document.createElement("div");
  headerContactMeta.className = "header-contact-meta";
  headerContactMeta.setAttribute("data-header-contact-meta", "");
  headerContactMeta.setAttribute("aria-label", "Date contact rapide");
  headerContactMeta.innerHTML = `
    <a href="tel:+40374962748" class="header-contact-meta__item">+40 (0374) 962 748</a>
    <a href="mailto:marian.dumitru@grupulverde.ro" class="header-contact-meta__item">marian.dumitru@grupulverde.ro</a>
    <span class="header-contact-meta__item header-contact-meta__item--schedule">L-V 10:00-18:00</span>
  `;
  const navEl = headerInner.querySelector(".nav");
  if (navEl) {
    headerInner.insertBefore(headerContactMeta, navEl);
  } else {
    headerInner.appendChild(headerContactMeta);
  }
}
setupLanguageSwitcher();
setupHeaderLogoMarian();

if (menuBtn && nav) {
  const navDropdowns = nav.querySelectorAll(".nav-dropdown");

  const closeMenu = () => {
    menuBtn.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
    navDropdowns.forEach((dropdown) => {
      dropdown.removeAttribute("open");
    });
  };

  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
    if (expanded) {
      navDropdowns.forEach((dropdown) => {
        dropdown.removeAttribute("open");
      });
    }
  });

  // Explicit mobile toggle for dropdowns (more reliable across mobile browsers).
  navDropdowns.forEach((dropdown) => {
    const summary = dropdown.querySelector("summary");
    if (!summary) return;
    summary.addEventListener("click", (event) => {
      if (!window.matchMedia("(max-width: 900px)").matches) return;
      event.preventDefault();
      const shouldOpen = !dropdown.hasAttribute("open");
      navDropdowns.forEach((item) => item.removeAttribute("open"));
      if (shouldOpen) {
        dropdown.setAttribute("open", "");
      }
    });
  });

  // On mobile, close menu after selecting a final destination link.
  nav.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    if (window.matchMedia("(max-width: 900px)").matches) {
      closeMenu();
    }
  });

  // Close when clicking outside of header on mobile.
  document.addEventListener("click", (event) => {
    if (!window.matchMedia("(max-width: 900px)").matches) return;
    if (!event.target.closest(".site-header")) {
      closeMenu();
    }
  });
}

// Highlight current nav entry for better orientation.
document.querySelectorAll(".nav a[href]").forEach((link) => {
  const href = link.getAttribute("href");
  if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
  const cleanHref = href.split("?")[0];
  if (cleanHref === currentPage) {
    link.classList.add("active");
  }
});

// Professional proof strip (concise trust signals, RO/EN).
const legalPages = new Set([
  "politica-confidentialitate.html",
  "politica-confidentialitate-en.html",
  "politica-cookies.html",
  "politica-cookies-en.html",
  "termeni-si-conditii.html",
  "termeni-si-conditii-en.html",
  "regulament.html",
  "regulament-en.html",
  "multumim.html",
  "multumim-en.html"
]);
const heroSection = document.querySelector("main section.hero");
const canShowProofStrip = heroSection && !legalPages.has(currentPage);
if (canShowProofStrip && !document.querySelector("[data-prof-proof-strip]")) {
  const strip = document.createElement("section");
  strip.className = "professional-proof-strip";
  strip.setAttribute("data-prof-proof-strip", "");
  strip.innerHTML = `
    <div class="container">
      <div class="professional-proof-list" aria-label="${isEnglishPage ? "Academic trust highlights" : "Repere de încredere academică"}">
        <span class="professional-proof-item">${isEnglishPage ? "Cisco Networking Academy aligned" : "Aliniat Cisco Networking Academy"}</span>
        <span class="professional-proof-item">${isEnglishPage ? "Instructor-led practical labs" : "Laboratoare practice cu instructor"}</span>
        <span class="professional-proof-item">${isEnglishPage ? "Admission guidance in 24-48h" : "Recomandare de admitere în 24-48h"}</span>
      </div>
    </div>
  `;
  heroSection.insertAdjacentElement("afterend", strip);
}

// Global footer brand mark (discreet, premium).
const footerMain = document.querySelector(".footer-main");
if (footerMain && !footerMain.querySelector("[data-footer-brand-mark]")) {
  const footerMark = document.createElement("div");
  footerMark.className = "footer-brand-mark";
  footerMark.setAttribute("data-footer-brand-mark", "");
  footerMark.innerHTML = `
    <img src="Imagini/Logo_academie_CISCO.png" alt="${isEnglishPage ? "Youth Code Academy logo" : "Logo Youth Code Academy"}" width="910" height="229" loading="lazy" decoding="async">
  `;
  footerMain.insertAdjacentElement("afterbegin", footerMark);
}

// Attach source tracking to admission links and form hidden field.
const pageName = currentPage;
const sourceName = pageName.replace(/\.html$/i, "") || "home";
const admitereLinks = document.querySelectorAll("a[href^='inregistrare.html'], a[href^='inregistrare-en.html']");
admitereLinks.forEach((link) => {
  const href = link.getAttribute("href") || admissionPage;
  const [basePath, queryString = ""] = href.split("?");
  if (!basePath.endsWith("inregistrare.html") && !basePath.endsWith("inregistrare-en.html")) return;
  const params = new URLSearchParams(queryString);
  if (!params.has("src")) {
    params.set("src", sourceName);
  }
  link.setAttribute("href", `${basePath}?${params.toString()}`);
});

const leadSourceInput = document.querySelector("#lead_source");
if (leadSourceInput) {
  const src = new URLSearchParams(location.search).get("src");
  const fallback = document.referrer ? new URL(document.referrer).pathname.split("/").pop()?.replace(".html", "") : "direct";
  leadSourceInput.value = src || fallback || "direct";
}

const badgeContainer = document.querySelector("[data-badge-grid]");

if (badgeContainer) {
  const renderBadges = (badges) => {
    if (!Array.isArray(badges) || badges.length === 0) {
      badgeContainer.innerHTML = `<p class="small-note">${i18n.common.noBadges}</p>`;
      return;
    }

    badgeContainer.innerHTML = badges
      .map((badge) => {
        const img = badge.image || "Imagini/insigne/badge-placeholder.svg";
        const title = badge.title || "Badge Cisco";
        const track = badge.track || "N/A";
        const issuer = badge.issuer || i18n.badgeGrid.defaultIssuer;
        const date = badge.date || "N/A";
        const rawStatus = String(badge.status || "").trim();
        const status = /official/i.test(rawStatus) ? "" : rawStatus;
        const marketingCopy = badge.marketing_copy || i18n.badgeGrid.defaultMarketing;
        const careerOutcome = badge.career_outcome || i18n.badgeGrid.defaultOutcome;
        const ctaLabel = badge.cta_label || i18n.badgeGrid.defaultCta;
        const ctaUrl = badge.cta_url || "inregistrare.html";

        return `
          <article class="badge-card badge-card--marketing is-visible">
            <div class="badge-media">
              <img class="badge-image" src="${img}" alt="${title}" loading="lazy" decoding="async" data-fallback-src="Imagini/insigne/badge-placeholder.svg">
            </div>
            <div class="badge-copy">
              <h3>${title}</h3>
              <div class="badge-meta">
                <p><strong>${i18n.badgeGrid.track}:</strong> ${track}</p>
                <p><strong>${i18n.badgeGrid.issuer}:</strong> ${issuer}</p>
                <p><strong>${i18n.badgeGrid.date}:</strong> ${date}</p>
              </div>
              <p class="small-note">${marketingCopy}</p>
              <p class="small-note"><strong>${i18n.badgeGrid.careerImpact}:</strong> ${careerOutcome}</p>
            </div>
            <div class="btn-row badge-cta-row" style="margin-top:0;">
              ${status ? `<span class="status-tag">${status}</span>` : ""}
              <a class="btn primary" href="${ctaUrl}">${ctaLabel}</a>
            </div>
          </article>
        `;
      })
      .join("");

    badgeContainer.querySelectorAll("img[data-fallback-src]").forEach((image) => {
      image.addEventListener("error", () => {
        const fallbackSrc = image.getAttribute("data-fallback-src");
        if (!fallbackSrc || image.src.endsWith(fallbackSrc)) return;
        image.src = fallbackSrc;
      }, { once: true });
    });
  };

  const inlineDataNode = document.querySelector("#badges-inline-data");
  const renderInlineData = () => {
    if (!inlineDataNode) return false;
    try {
      const inlineBadges = JSON.parse(inlineDataNode.textContent || "[]");
      renderBadges(inlineBadges);
      return true;
    } catch {
      return false;
    }
  };

  fetch("data/badges.json")
    .then((response) => response.json())
    .then((badges) => renderBadges(badges))
    .catch(() => {
      if (!renderInlineData()) {
        badgeContainer.innerHTML = `<p class="small-note">${i18n.common.loadBadgesErr}</p>`;
      }
    });
}

// Program filters on courses page.
const filterDomain = document.querySelector("[data-filter-domain]");
const filterLevel = document.querySelector("[data-filter-level]");
const filterBadge = document.querySelector("[data-filter-badge]");
const filterReset = document.querySelector("[data-filter-reset]");
const domainBlocks = document.querySelectorAll("details[data-domain]");

if (filterDomain && filterLevel && filterBadge && domainBlocks.length) {
  const applyFilters = () => {
    const domainValue = filterDomain.value;
    const levelValue = filterLevel.value;
    const badgeValue = filterBadge.value;

    domainBlocks.forEach((block) => {
      const domainMatch = domainValue === "all" || block.dataset.domain === domainValue;
      let visibleRows = 0;
      const rows = block.querySelectorAll("tbody tr");

      rows.forEach((row) => {
        const rowLevels = (row.dataset.level || "").split(" ").filter(Boolean);
        const rowBadge = row.dataset.badge || "";
        const levelMatch = levelValue === "all" || rowLevels.includes(levelValue);
        const badgeMatch = badgeValue === "all" || rowBadge === badgeValue;
        const show = domainMatch && levelMatch && badgeMatch;
        row.style.display = show ? "" : "none";
        if (show) visibleRows += 1;
      });

      block.style.display = visibleRows > 0 && domainMatch ? "" : "none";
    });
  };

  [filterDomain, filterLevel, filterBadge].forEach((el) => {
    el.addEventListener("change", applyFilters);
  });

  if (filterReset) {
    filterReset.addEventListener("click", () => {
      filterDomain.value = "all";
      filterLevel.value = "all";
      filterBadge.value = "all";
      applyFilters();
    });
  }
}

// Course-level marketing panel (career focus + instructor + badge highlight).
const currentFileName = location.pathname.split("/").pop() || "";
const normalizedCurrentFileName = currentFileName.replace(/-en\.html$/i, ".html");
const isCoursePage = normalizedCurrentFileName.startsWith("curs-");
const courseMain = document.querySelector("main.container");

if (isCoursePage && courseMain && !courseMain.querySelector("[data-course-career-panel]")) {
  const titleEl = courseMain.querySelector(".hero h1");
  const kickerEl = courseMain.querySelector(".hero .kicker");
  const courseTitle = titleEl ? titleEl.textContent.trim() : "Acest curs";
  const kicker = kickerEl ? kickerEl.textContent.trim().toLowerCase() : "";

  const inferTrack = () => {
    if (kicker.includes("network")) return "networking";
    if (kicker.includes("cyber")) return "cybersecurity";
    if (kicker.includes("iot")) return "iot";
    if (kicker.includes("program")) return "programming";
    if (kicker.includes("automation")) return "automation";
    if (normalizedCurrentFileName.includes("ccna") || normalizedCurrentFileName.includes("ccnp") || normalizedCurrentFileName.includes("networking")) return "networking";
    if (normalizedCurrentFileName.includes("cyber") || normalizedCurrentFileName.includes("security")) return "cybersecurity";
    if (normalizedCurrentFileName.includes("iot")) return "iot";
    if (normalizedCurrentFileName.includes("python") || normalizedCurrentFileName.includes("javascript") || normalizedCurrentFileName.includes("programming") || normalizedCurrentFileName.includes("cpa") || normalizedCurrentFileName.includes("cla")) return "programming";
    if (normalizedCurrentFileName.includes("devnet") || normalizedCurrentFileName.includes("model-driven") || normalizedCurrentFileName.includes("rest-apis")) return "automation";
    return "it-foundation";
  };

  const track = inferTrack();
  const trackProfile = {
    networking: {
      roleLine: isEnglishPage
        ? "Career direction: Network Support, NOC Technician, Junior Network Engineer."
        : "Direcție de carieră: Network Support, NOC Technician, Junior Network Engineer.",
      valueLine: isEnglishPage
        ? "You gain applied skills in configuration, troubleshooting, and network operations."
        : "Dobândești competențe concrete de configurare, troubleshooting și operare rețea.",
      benefits: [
        isEnglishPage ? "You build technical foundation for CCNA/CCNP tracks." : "Construiești bază tehnică pentru traseele CCNA/CCNP.",
        isEnglishPage ? "You apply scenarios aligned with enterprise environments." : "Aplici scenarii de lucru similare mediilor enterprise.",
        isEnglishPage ? "You improve your profile credibility for entry-level IT roles." : "Crești credibilitatea profilului profesional pentru roluri entry-level IT."
      ]
    },
    cybersecurity: {
      roleLine: isEnglishPage
        ? "Career direction: SOC Analyst (entry-level), Security Operations, Security Support."
        : "Direcție de carieră: SOC Analyst (entry-level), Security Operations, Security Support.",
      valueLine: isEnglishPage
        ? "You learn defensive practices, risk analysis, and incident response."
        : "Înveți practici defensive, analiză de risc și răspuns la incidente.",
      benefits: [
        isEnglishPage ? "You understand key processes used in security operations." : "Înțelegi procesele esențiale din operațiuni de securitate.",
        isEnglishPage ? "You practice on scenarios relevant to real environments." : "Exersezi pe situații relevante pentru medii reale.",
        isEnglishPage ? "You prepare for advanced cybersecurity specializations." : "Îți construiești traseul spre specializări avansate de securitate."
      ]
    },
    iot: {
      roleLine: isEnglishPage
        ? "Career direction: IoT Technician, IoT Integrator, Junior IoT Developer."
        : "Direcție de carieră: IoT Technician, IoT Integrator, Junior IoT Developer.",
      valueLine: isEnglishPage
        ? "You combine hardware, connectivity, and data analysis in applied projects."
        : "Combină hardware, conectivitate și analiză de date în proiecte aplicate.",
      benefits: [
        isEnglishPage ? "You connect theory to functional prototypes and technical demos." : "Legi teoria de prototipuri funcționale și demo-uri tehnice.",
        isEnglishPage ? "You learn device integration in real architectures." : "Înveți integrarea dispozitivelor în arhitecturi reale.",
        isEnglishPage ? "You build sought-after skills for smart systems projects." : "Dezvolți competențe căutate în proiecte smart systems."
      ]
    },
    programming: {
      roleLine: isEnglishPage
        ? "Career direction: Junior Developer, Automation Support, Technical Analyst."
        : "Direcție de carieră: Junior Developer, Automation Support, Technical Analyst.",
      valueLine: isEnglishPage
        ? "You build programming logic and practical implementation skills."
        : "Construiești logică de programare și abilități de implementare practică.",
      benefits: [
        isEnglishPage ? "You write usable code for real projects." : "Scrii cod utilizabil în proiecte reale.",
        isEnglishPage ? "You learn methodically, from foundations to practical applications." : "Înveți metodic, de la fundamente la aplicații concrete.",
        isEnglishPage ? "You build a portfolio relevant for technical interviews." : "Pregătești un portofoliu relevant pentru interviuri tehnice."
      ]
    },
    automation: {
      roleLine: isEnglishPage
        ? "Career direction: Network Automation, DevNet Junior, Infrastructure Automation."
        : "Direcție de carieră: Network Automation, DevNet Junior, Infrastructure Automation.",
      valueLine: isEnglishPage
        ? "You deepen API, automation workflow, and modern operations capabilities."
        : "Aprofundezi API-uri, workflows automatizate și practici moderne de operare.",
      benefits: [
        isEnglishPage ? "You bridge networking with API-first development." : "Conectezi rețelistica cu dezvoltarea orientată API.",
        isEnglishPage ? "You automate repetitive tasks in IT operations." : "Automatizezi task-uri repetitive din operațiuni IT.",
        isEnglishPage ? "You accelerate transition to next-generation technical roles." : "Îți accelerezi tranziția către roluri tehnice de nouă generație."
      ]
    },
    "it-foundation": {
      roleLine: isEnglishPage
        ? "Career direction: IT Support, Helpdesk, Junior Technical Specialist."
        : "Direcție de carieră: IT Support, Helpdesk, Junior Technical Specialist.",
      valueLine: isEnglishPage
        ? "You consolidate core IT foundations required for specialization."
        : "Consolidezi fundamentele IT necesare pentru specializare ulterioară.",
      benefits: [
        isEnglishPage ? "You build a solid base for any technical track." : "Obții o bază solidă pentru orice traseu tehnic.",
        isEnglishPage ? "You understand core operational processes used in IT teams." : "Înțelegi procesele operaționale folosite în echipe IT.",
        isEnglishPage ? "You can continue structurally into networking, security, or programming." : "Poți continua structurat către networking, security sau programming."
      ]
    }
  };

  const badgeByCourse = {
    "curs-ccna-itn.html": {
      title: "Badge Cisco: CCNA Introduction to Networks",
      image: "Imagini/insigne/ccna-itn-badge.png",
      cta: isEnglishPage ? "Apply and earn the badge" : "Înscrie-te și obține badge-ul",
      href: admissionPage
    },
    "curs-ccna-ensa.html": {
      title: "Badge Cisco: CCNA Enterprise Networking, Security & Automation",
      image: "Imagini/insigne/ccna-ensa-badge.png",
      cta: isEnglishPage ? "Apply for this track" : "Aplică pentru acest traseu",
      href: admissionPage
    },
    "curs-networking-essentials.html": {
      title: "Badge Cisco: Networking Essentials",
      image: "Imagini/insigne/networking-essentials-badge.png",
      cta: isEnglishPage ? "Start with Networking Essentials" : "Începe cu Networking Essentials",
      href: admissionPage
    },
    "curs-cybersecurity-essentials.html": {
      title: "Badge Cisco: Cybersecurity Essentials",
      image: "Imagini/insigne/cybersecurity-essentials-badge.png",
      cta: isEnglishPage ? "Enter Cybersecurity track" : "Intră pe traseul Cybersecurity",
      href: admissionPage
    },
    "curs-network-security.html": {
      title: "Badge Cisco: Network Security",
      image: "Imagini/insigne/network-security-badge.png",
      cta: isEnglishPage ? "Apply for Network Security" : "Aplică pentru Network Security",
      href: admissionPage
    },
    "curs-python-essentials-2.html": {
      title: "Badge Cisco: Python Essentials 2",
      image: "Imagini/insigne/python-essentials-2-badge.png",
      cta: isEnglishPage ? "Start Python track" : "Începe traseul Python",
      href: admissionPage
    }
  };

  const profile = trackProfile[track] || trackProfile["it-foundation"];
  const badge = badgeByCourse[normalizedCurrentFileName];
  const badgeFallbackTitle = isEnglishPage ? "Badge aligned to your path" : "Badge pe traseul de progres";
  const badgeFallbackText = isEnglishPage
    ? "For this course, badge eligibility is confirmed based on your selected path during admission."
    : "Pentru acest curs, eligibilitatea badge-ului se confirmă în funcție de traseul ales la admitere.";
  const badgeFallbackCta = isEnglishPage ? "Discuss path and badge" : "Discută traseul și badge-ul";
  const badgeBlock = badge
    ? `
      <article class="course-career-badge">
        <img src="${badge.image}" alt="${badge.title}" loading="lazy" decoding="async">
        <div>
          <h3>${badge.title}</h3>
          <p>${isEnglishPage ? "This course includes targeted preparation for the official badge associated with this path." : "Acest curs include pregătire orientată pe obținerea badge-ului oficial asociat parcursului."}</p>
          <a class="btn primary" href="${badge.href}">${badge.cta}</a>
        </div>
      </article>
    `
    : `
      <article class="course-career-badge">
        <img src="Imagini/insigne/badge-placeholder.svg" alt="${badgeFallbackTitle}" loading="lazy" decoding="async">
        <div>
          <h3>${badgeFallbackTitle}</h3>
          <p>${badgeFallbackText}</p>
          <a class="btn primary" href="${admissionPage}">${badgeFallbackCta}</a>
        </div>
      </article>
    `;

  const panel = document.createElement("section");
  panel.className = "course-career-panel card";
  panel.setAttribute("data-course-career-panel", "");
  panel.innerHTML = `
    <h2 class="section-title">${isEnglishPage ? `Career outcomes after ${courseTitle}` : `Carieră și beneficii după ${courseTitle}`}</h2>
    <p class="small-note">${profile.roleLine}</p>
    <p class="small-note">${profile.valueLine}</p>
    <div class="course-career-benefits">
      <article class="card"><h3>${isEnglishPage ? "Benefit 1" : "Beneficiul 1"}</h3><p>${profile.benefits[0]}</p></article>
      <article class="card"><h3>${isEnglishPage ? "Benefit 2" : "Beneficiul 2"}</h3><p>${profile.benefits[1]}</p></article>
      <article class="card"><h3>${isEnglishPage ? "Benefit 3" : "Beneficiul 3"}</h3><p>${profile.benefits[2]}</p></article>
    </div>
    <div class="course-career-lower">
      ${badgeBlock}
      <article class="course-instructor-box">
        <h3>${isEnglishPage ? "Mentoring with instructor Marian Dumitru" : "Mentorat cu instructorul Marian Dumitru"}</h3>
        <p>${isEnglishPage
          ? "During the course you receive applied guidance, progress feedback, and clear recommendations for your next IT career step."
          : "Pe durata cursului primești ghidare aplicată, feedback pe progres și recomandări clare pentru următorul pas din cariera IT."}</p>
        <div class="btn-row" style="margin-top:.5rem;">
          <a class="btn ghost" href="${teamPage}">${isEnglishPage ? "View instructor profile" : "Vezi profil instructor"}</a>
          <a class="btn primary" href="${admissionPage}">${isEnglishPage ? "Apply for this course" : "Înscrie-te la curs"}</a>
        </div>
      </article>
    </div>
  `;

  const sections = Array.from(courseMain.querySelectorAll(":scope > section"));
  if (sections.length > 0) {
    sections[0].insertAdjacentElement("afterend", panel);
  } else {
    courseMain.prepend(panel);
  }
}

// Course visual marketing strip per domain.
if (isCoursePage && courseMain && !courseMain.querySelector("[data-course-visual-strip]")) {
  const kickerEl = courseMain.querySelector(".hero .kicker");
  const kicker = kickerEl ? kickerEl.textContent.trim().toLowerCase() : "";

  const inferTrackForVisual = () => {
    if (kicker.includes("network")) return "networking";
    if (kicker.includes("cyber")) return "cybersecurity";
    if (kicker.includes("iot")) return "iot";
    if (kicker.includes("program")) return "programming";
    if (kicker.includes("automation")) return "automation";
    if (normalizedCurrentFileName.includes("ccna") || normalizedCurrentFileName.includes("ccnp") || normalizedCurrentFileName.includes("networking")) return "networking";
    if (normalizedCurrentFileName.includes("cyber") || normalizedCurrentFileName.includes("security")) return "cybersecurity";
    if (normalizedCurrentFileName.includes("iot")) return "iot";
    if (normalizedCurrentFileName.includes("python") || normalizedCurrentFileName.includes("javascript") || normalizedCurrentFileName.includes("programming") || normalizedCurrentFileName.includes("cpa") || normalizedCurrentFileName.includes("cla")) return "programming";
    if (normalizedCurrentFileName.includes("devnet") || normalizedCurrentFileName.includes("model-driven") || normalizedCurrentFileName.includes("rest-apis")) return "automation";
    return "it-foundation";
  };

  const track = inferTrackForVisual();
  const visualByTrack = {
    networking: {
      image: "Imagini/cisco-iq-1600x900.jpg",
      imageAlt: "Networking academy visual",
      cards: [
        { icon: "Imagini/retea.svg", title: "Infrastructure Skills", text: isEnglishPage ? "Configuration, operations, and troubleshooting in real network scenarios." : "Configurare, operare și troubleshooting pe scenarii de rețea reale." },
        { icon: "Imagini/observabilitate.svg", title: "Operational Visibility", text: isEnglishPage ? "Learn to monitor and interpret infrastructure state quickly." : "Înveți să monitorizezi și să interpretezi rapid starea infrastructurii." },
        { icon: "Imagini/colaborare.svg", title: "Team Collaboration", text: isEnglishPage ? "Develop a workflow aligned with enterprise technical teams." : "Dezvolți un mod de lucru compatibil cu echipe tehnice enterprise." }
      ]
    },
    cybersecurity: {
      image: "Imagini/customer-story-mclaren-1200x675.avif",
      imageAlt: "Cybersecurity performance visual",
      cards: [
        { icon: "Imagini/securitate.svg", title: "Defensive Mindset", text: isEnglishPage ? "Build the right reflexes for protection, detection, and response." : "Construiești reflexe corecte pentru protecție, detectare și reacție." },
        { icon: "Imagini/observabilitate.svg", title: "Incident Awareness", text: isEnglishPage ? "Understand critical signals and prioritize effective actions." : "Înțelegi semnalele critice și prioritizezi acțiuni eficiente." },
        { icon: "Imagini/colaborare.svg", title: "SOC Collaboration", text: isEnglishPage ? "Work with team logic specific to security operations." : "Lucrezi după logică de echipă specifică operațiunilor de securitate." }
      ]
    },
    iot: {
      image: "Imagini/cisco-iq-1600x900.jpg",
      imageAlt: "IoT systems visual",
      cards: [
        { icon: "Imagini/retea.svg", title: "Connected Systems", text: isEnglishPage ? "Integrate devices, networks, and data flows into functional projects." : "Integrezi dispozitive, rețea și fluxuri de date în proiecte funcționale." },
        { icon: "Imagini/observabilitate.svg", title: "Data Visibility", text: isEnglishPage ? "Interpret operational data for better technical decisions." : "Interpretezi date operaționale pentru decizii tehnice mai bune." },
        { icon: "Imagini/securitate.svg", title: "Secure by Design", text: isEnglishPage ? "Apply security practices from the design stage." : "Aplici practici de securitate încă din faza de proiectare." }
      ]
    },
    programming: {
      image: "Imagini/customer-story-mclaren-1200x675.avif",
      imageAlt: "Programming projects visual",
      cards: [
        { icon: "Imagini/colaborare.svg", title: "Code + Collaboration", text: isEnglishPage ? "Write clear code and use project-oriented collaboration practices." : "Scrii cod clar și folosești practici de colaborare orientate proiect." },
        { icon: "Imagini/observabilitate.svg", title: "Debug & Logic", text: isEnglishPage ? "Learn to analyze problems and deliver robust solutions." : "Înveți să analizezi probleme și să livrezi soluții robuste." },
        { icon: "Imagini/retea.svg", title: "Automation Thinking", text: isEnglishPage ? "Connect programming to real tasks from the IT ecosystem." : "Conectezi programarea la task-uri reale din ecosistemul IT." }
      ]
    },
    automation: {
      image: "Imagini/cisco-iq-1600x900.jpg",
      imageAlt: "Automation and observability visual",
      cards: [
        { icon: "Imagini/observabilitate.svg", title: "API Visibility", text: isEnglishPage ? "Control and monitor infrastructure through APIs and telemetry." : "Controlezi și monitorizezi infrastructura prin API-uri și telemetrie." },
        { icon: "Imagini/retea.svg", title: "Network Automation", text: isEnglishPage ? "Automate repetitive tasks in network operations." : "Automatizezi task-uri repetitive în operațiuni de rețea." },
        { icon: "Imagini/colaborare.svg", title: "DevNet Workflow", text: isEnglishPage ? "Work with modern integration practices between IT and development." : "Lucrezi după practici moderne de integrare între IT și development." }
      ]
    },
    "it-foundation": {
      image: "Imagini/Logo_academie_CISCO.png",
      imageAlt: "Online learning academy",
      cards: [
        { icon: "Imagini/colaborare.svg", title: "Learning Support", text: isEnglishPage ? "Receive consistent academic support throughout the course." : "Primești suport academic constant pe parcursul cursului." },
        { icon: "Imagini/retea.svg", title: "Technical Foundation", text: isEnglishPage ? "Build the foundation required for future technical specialization." : "Construiești baza necesară pentru specializări tehnice ulterioare." },
        { icon: "Imagini/securitate.svg", title: "Career Readiness", text: isEnglishPage ? "Learn in a structured way for entry-level IT roles." : "Înveți structurat pentru intrarea în roluri IT entry-level." }
      ]
    }
  };

  const visual = visualByTrack[track] || visualByTrack["it-foundation"];
  const cardsMarkup = visual.cards
    .map((item) => `
      <article class="course-visual-card">
        <img src="${item.icon}" alt="${item.title}" width="56" height="56" loading="lazy" decoding="async">
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `)
    .join("");

  const visualSection = document.createElement("section");
  visualSection.className = "course-visual-strip card";
  visualSection.setAttribute("data-course-visual-strip", "");
  visualSection.innerHTML = `
    <div class="course-visual-media">
      <img src="${visual.image}" alt="${visual.imageAlt}" width="1600" height="900" loading="lazy" decoding="async">
    </div>
    <div class="course-visual-grid">${cardsMarkup}</div>
  `;

  const firstSection = courseMain.querySelector(":scope > section");
  if (firstSection) {
    firstSection.insertAdjacentElement("afterend", visualSection);
  } else {
    courseMain.prepend(visualSection);
  }
}

// Academy marketing strip (course-first branding).
const currentPageFile = currentPage;
const shouldShowAcademyStrip = currentPageFile.startsWith("curs-") || currentPageFile === "cursuri.html" || currentPageFile === "cursuri-en.html";
const pageMain = document.querySelector("main.container");

if (shouldShowAcademyStrip && pageMain && !pageMain.querySelector("[data-academy-brand-strip]")) {
  const strip = document.createElement("section");
  strip.className = "academy-brand-strip";
  strip.setAttribute("data-academy-brand-strip", "");
  strip.innerHTML = `
    <div class="academy-brand-inner">
      <img src="Imagini/Logo_academie_CISCO.png" alt="Youth Code Academy" width="910" height="229" loading="lazy" decoding="async">
      <div class="academy-brand-copy">
        <p class="kicker">${isEnglishPage ? "Online Learning Academy" : "Online Learning Academy"}</p>
        <h2>${isEnglishPage ? "Learn online, hands-on, on a clear IT career path." : "Înveți online, aplicat, pe un traseu clar către carieră IT."}</h2>
        <p>${isEnglishPage ? "Training model focused on real competencies, practical projects, and progress validated through Cisco badges, under instructor Marian Dumitru's guidance." : "Model de formare orientat pe competențe reale, proiecte practice și progres validat prin badge-uri Cisco, sub coordonarea instructorului Marian Dumitru."}</p>
        <div class="btn-row" style="margin-top:.55rem;">
          <a class="btn primary" href="${admissionPage}">${isEnglishPage ? "Apply for admission" : "Înscrie-te la curs"}</a>
          <a class="btn ghost" href="${contactPage}">${isEnglishPage ? "Talk to an advisor" : "Discută cu un consilier"}</a>
        </div>
      </div>
    </div>
  `;

  const firstSection = pageMain.querySelector(":scope > section");
  if (firstSection) {
    firstSection.insertAdjacentElement("afterend", strip);
  } else {
    pageMain.prepend(strip);
  }
}

// Course pages: keep "Enroll" links bound to the current course context.
if (isCoursePage) {
  const inferDomainForCourse = () => {
    if (normalizedCurrentFileName.includes("ccna") || normalizedCurrentFileName.includes("ccnp") || normalizedCurrentFileName.includes("networking")) return "Networking";
    if (normalizedCurrentFileName.includes("cyber") || normalizedCurrentFileName.includes("security")) return "Cybersecurity";
    if (normalizedCurrentFileName.includes("iot")) return "Internet of Things (IoT)";
    if (normalizedCurrentFileName.includes("python") || normalizedCurrentFileName.includes("javascript") || normalizedCurrentFileName.includes("programming") || normalizedCurrentFileName.includes("cpa") || normalizedCurrentFileName.includes("cla")) return "Programming";
    if (normalizedCurrentFileName.includes("devnet") || normalizedCurrentFileName.includes("model-driven") || normalizedCurrentFileName.includes("rest-apis")) return "Infrastructure Automation";
    return "Operating Systems & IT";
  };

  const inferLevelForCourse = () => {
    if (normalizedCurrentFileName.includes("ccnp") || normalizedCurrentFileName.includes("devnet") || normalizedCurrentFileName.includes("model-driven") || normalizedCurrentFileName.includes("rest-apis")) return "Professional";
    if (normalizedCurrentFileName.includes("ccna") || normalizedCurrentFileName.includes("associate") || normalizedCurrentFileName.includes("network-security") || normalizedCurrentFileName.includes("endpoint-security") || normalizedCurrentFileName.includes("cybersecurity-essentials") || normalizedCurrentFileName.includes("python-essentials-2")) return "Associate";
    return "Foundation";
  };

  const courseTitleEl = document.querySelector("main.container .hero h1");
  const courseName = courseTitleEl ? courseTitleEl.textContent.trim() : normalizedCurrentFileName.replace(".html", "");
  const courseSlug = normalizedCurrentFileName.replace(".html", "");
  const courseDomain = inferDomainForCourse();
  const courseLevel = inferLevelForCourse();

  const courseEnrollLinks = document.querySelectorAll("main a[href^='inregistrare.html'], main a[href^='inregistrare-en.html']");
  courseEnrollLinks.forEach((link) => {
    const href = link.getAttribute("href") || admissionPage;
    const [basePath, queryString = ""] = href.split("?");
    if (!basePath.endsWith("inregistrare.html") && !basePath.endsWith("inregistrare-en.html")) return;
    const params = new URLSearchParams(queryString);
    params.set("src", sourceName);
    params.set("course_slug", courseSlug);
    params.set("course_name", courseName);
    params.set("course_domain", courseDomain);
    params.set("course_level", courseLevel);
    link.setAttribute("href", `${basePath}?${params.toString()}`);
  });
}

// Mobile quick actions (call, email, enroll) for faster conversion.
const mobileDockExcludedPages = new Set([
  "inregistrare.html",
  "inregistrare-en.html",
  "politica-confidentialitate.html",
  "politica-confidentialitate-en.html",
  "politica-cookies.html",
  "politica-cookies-en.html",
  "termeni-si-conditii.html",
  "termeni-si-conditii-en.html",
  "regulament.html",
  "regulament-en.html"
]);
const shouldShowMobileQuickActions = !mobileDockExcludedPages.has(pageName);
if (shouldShowMobileQuickActions && !document.querySelector("[data-mobile-quick-actions]")) {
  const mobileAria = isEnglishPage ? "Mobile quick actions" : "Acțiuni rapide mobile";
  const callAria = isEnglishPage ? "Call now" : "Sună acum";
  const mailAria = isEnglishPage ? "Send email" : "Trimite email";
  const applyAria = isEnglishPage ? "Apply to academy" : "Înscrie-te la academie";
  const mobileQuickActions = document.createElement("nav");
  mobileQuickActions.className = "mobile-quick-actions";
  mobileQuickActions.setAttribute("data-mobile-quick-actions", "");
  mobileQuickActions.setAttribute("aria-label", mobileAria);
  mobileQuickActions.innerHTML = `
    <a class="mobile-quick-action mobile-quick-action--call" href="tel:+40374962748" aria-label="${callAria}">
      <span class="mobile-quick-action-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="img" focusable="false">
          <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.08.36 2.24.56 3.42.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.18.2 2.34.56 3.42a1 1 0 0 1-.24 1l-2.22 2.38Z"></path>
        </svg>
      </span>
      <span class="mobile-quick-action-text">${i18n.common.call}</span>
    </a>
    <a class="mobile-quick-action mobile-quick-action--mail" href="mailto:marian.dumitru@grupulverde.ro" aria-label="${mailAria}">
      <span class="mobile-quick-action-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="img" focusable="false">
          <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.2l8 5.33 8-5.33V7l-8 5.33L4 7.01Zm16 10V9.4l-7.45 4.97a1 1 0 0 1-1.1 0L4 9.4V17h16Z"></path>
        </svg>
      </span>
      <span class="mobile-quick-action-text">${i18n.common.email}</span>
    </a>
    <a class="mobile-quick-action mobile-quick-action--apply" href="${admissionPage}?src=${encodeURIComponent(`mobile-quick-${sourceName}`)}" aria-label="${applyAria}">
      <span class="mobile-quick-action-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="img" focusable="false">
          <path d="M12 3a1 1 0 0 1 .66.25l8 7A1 1 0 0 1 20 12H4a1 1 0 0 1-.66-1.75l8-7A1 1 0 0 1 12 3Zm-6 9v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7h-2v7H8v-7H6Zm4 1h4a1 1 0 0 1 0 2h-4a1 1 0 0 1 0-2Z"></path>
        </svg>
      </span>
      <span class="mobile-quick-action-text">${i18n.common.apply}</span>
    </a>
  `;
  if (isCoursePage) {
    const courseTitleEl = document.querySelector("main.container .hero h1");
    const courseName = courseTitleEl ? courseTitleEl.textContent.trim() : normalizedCurrentFileName.replace(".html", "");
    const courseSlug = normalizedCurrentFileName.replace(".html", "");
    const courseDomain = normalizedCurrentFileName.includes("ccna") || normalizedCurrentFileName.includes("ccnp") || normalizedCurrentFileName.includes("networking")
      ? "Networking"
      : normalizedCurrentFileName.includes("cyber") || normalizedCurrentFileName.includes("security")
        ? "Cybersecurity"
        : normalizedCurrentFileName.includes("iot")
          ? "Internet of Things (IoT)"
          : normalizedCurrentFileName.includes("python") || normalizedCurrentFileName.includes("javascript") || normalizedCurrentFileName.includes("programming") || normalizedCurrentFileName.includes("cpa") || normalizedCurrentFileName.includes("cla")
            ? "Programming"
            : normalizedCurrentFileName.includes("devnet") || normalizedCurrentFileName.includes("model-driven") || normalizedCurrentFileName.includes("rest-apis")
              ? "Infrastructure Automation"
              : "Operating Systems & IT";
    const courseLevel = normalizedCurrentFileName.includes("ccnp") || normalizedCurrentFileName.includes("devnet") || normalizedCurrentFileName.includes("model-driven") || normalizedCurrentFileName.includes("rest-apis")
      ? "Professional"
      : normalizedCurrentFileName.includes("ccna") || normalizedCurrentFileName.includes("associate") || normalizedCurrentFileName.includes("network-security") || normalizedCurrentFileName.includes("endpoint-security") || normalizedCurrentFileName.includes("cybersecurity-essentials") || normalizedCurrentFileName.includes("python-essentials-2")
        ? "Associate"
        : "Foundation";
    const applyLink = mobileQuickActions.querySelector(".mobile-quick-action--apply");
    if (applyLink) {
      const params = new URLSearchParams();
      params.set("src", `mobile-quick-${sourceName}`);
      params.set("course_slug", courseSlug);
      params.set("course_name", courseName);
      params.set("course_domain", courseDomain);
      params.set("course_level", courseLevel);
      applyLink.setAttribute("href", `${admissionPage}?${params.toString()}`);
    }
  }
  document.body.appendChild(mobileQuickActions);
}

// Registration form: preselect course/domain/level when arriving from a course page.
const courseSelectedInput = document.querySelector("#curs_selectat");
const courseSelectedDisplay = document.querySelector("#curs_selectat_display");
const courseSelectedRow = document.querySelector("#curs_selectat_row");
const formStartedAtInput = document.querySelector("#form_started_at");
const levelSelect = document.querySelector("#nivel");
const domainSelect = document.querySelector("#domeniu");
const messageField = document.querySelector("#mesaj");
if (formStartedAtInput && !formStartedAtInput.value) {
  formStartedAtInput.value = new Date().toISOString();
}
if (courseSelectedInput && courseSelectedDisplay && courseSelectedRow) {
  const query = new URLSearchParams(location.search);
  let selectedCourseName = query.get("course_name") || "";
  const selectedCourseSlug = query.get("course_slug") || "";
  const selectedCourseDomain = query.get("course_domain") || "";
  const selectedCourseLevel = query.get("course_level") || "";
  const srcHint = query.get("src") || "";

  if (!selectedCourseName && srcHint.startsWith("curs-")) {
    selectedCourseName = srcHint.replace(/^curs-/, "").replace(/-/g, " ");
  }

  if (selectedCourseName || selectedCourseSlug) {
    const courseValue = selectedCourseName || selectedCourseSlug;
    courseSelectedInput.value = courseValue;
    courseSelectedDisplay.value = courseValue;
    courseSelectedRow.hidden = false;

    if (levelSelect && selectedCourseLevel) {
      const levelOption = Array.from(levelSelect.options).find((opt) => opt.value === selectedCourseLevel || opt.textContent.trim() === selectedCourseLevel);
      if (levelOption) levelSelect.value = levelOption.value;
    }

    if (domainSelect && selectedCourseDomain) {
      const domainOption = Array.from(domainSelect.options).find((opt) => opt.value === selectedCourseDomain || opt.textContent.trim() === selectedCourseDomain);
      if (domainOption) domainSelect.value = domainOption.value;
    }

    if (messageField && !messageField.value.trim()) {
      messageField.value = isEnglishPage
        ? `I would like to enroll in the course "${courseValue}".`
        : `Doresc înscriere la cursul "${courseValue}".`;
    }
  }
}

// Registration form email notifications (internal + applicant autoresponder).
const enrollmentForm = document.querySelector("form[name='admitere-netacad'], form[name='admission-netacad']");
if (enrollmentForm && !enrollmentForm.dataset.emailHookBound) {
  enrollmentForm.dataset.emailHookBound = "true";
  enrollmentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const thankYouTarget = form.getAttribute("action") || (isEnglishPage ? "multumim-en.html" : "multumim.html");
    const formData = new FormData(form);
    const payload = {
      nume: (formData.get("nume") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      telefon: (formData.get("telefon") || "").toString().trim(),
      nivel: (formData.get("nivel") || "").toString().trim(),
      domeniu: (formData.get("domeniu") || "").toString().trim(),
      curs_selectat: (formData.get("curs_selectat") || "").toString().trim(),
      mesaj: (formData.get("mesaj") || "").toString().trim(),
      company: (formData.get("company") || "").toString().trim(),
      form_started_at: (formData.get("form_started_at") || "").toString().trim(),
      lead_source: (formData.get("lead_source") || "").toString().trim(),
      page_url: location.href,
      user_agent: navigator.userAgent,
      sent_at: new Date().toISOString()
    };

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 2800);
    try {
      await fetch("/.netlify/functions/send-enrollment-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
        keepalive: true
      });
    } catch {
      // Form submission must continue even if notification email fails.
    } finally {
      window.clearTimeout(timeoutId);
      location.href = thankYouTarget;
    }
  });
}

// Premium scroll reveal for homepage sections/cards.
const homeMain = document.querySelector(".home-main");
if (homeMain && "IntersectionObserver" in window) {
  const revealTargets = homeMain.querySelectorAll("section, .card, .program-card, .impact-media-card, .badge-card--marketing");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  revealTargets.forEach((el) => revealObserver.observe(el));
} else if (homeMain) {
  homeMain.querySelectorAll("section, .card, .program-card, .impact-media-card, .badge-card--marketing")
    .forEach((el) => el.classList.add("is-visible"));
}

// Catalog print action moved from inline handler for CSP compatibility.
const catalogPrintBtn = document.querySelector("#catalog-print-btn");
if (catalogPrintBtn) {
  catalogPrintBtn.addEventListener("click", () => window.print());
}

// Soft anti-inspect protection (deterrent only, not true security).
const antiInspectEnabled = document.documentElement.dataset.antiInspect !== "off";
if (antiInspectEnabled) {
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  window.addEventListener("keydown", (event) => {
    const key = String(event.key || "").toLowerCase();
    const isF12 = key === "f12";
    const isCtrlShiftInspect = event.ctrlKey && event.shiftKey && (key === "i" || key === "j" || key === "c");
    const isCmdAltInspect = event.metaKey && event.altKey && (key === "i" || key === "j" || key === "c");
    const isViewSource = (event.ctrlKey || event.metaKey) && key === "u";

    if (isF12 || isCtrlShiftInspect || isCmdAltInspect || isViewSource) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
}

// Elegant keyword emphasis for high-intent course phrases (RO/EN).
const keywordRoot = document.querySelector("main");
if (keywordRoot && !keywordRoot.dataset.keywordFxApplied) {
  keywordRoot.dataset.keywordFxApplied = "true";

  const phraseList = isEnglishPage
    ? [
        "Cisco Networking Academy",
        "CCNA",
        "CCNP",
        "Cybersecurity",
        "Networking",
        "Programming",
        "IoT",
        "Automation",
        "practical labs",
        "career path",
        "certification",
        "admission"
      ]
    : [
        "Cisco Networking Academy",
        "CCNA",
        "CCNP",
        "Cybersecurity",
        "Networking",
        "Programming",
        "IoT",
        "Automation",
        "rețelistică",
        "laboratoare practice",
        "parcurs de carieră",
        "certificări",
        "admitere"
      ];

  const escapedPhrases = phraseList
    .sort((a, b) => b.length - a.length)
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const phraseRegex = new RegExp(`\\b(${escapedPhrases.join("|")})\\b`, "gi");
  const blockSelector = "h1, h2, h3, p, li";
  const blockedTags = new Set(["A", "BUTTON", "SUMMARY", "LABEL", "CODE", "PRE", "SCRIPT", "STYLE", "TEXTAREA", "SELECT", "INPUT"]);
  let highlightBudget = 18;

  const wrapPhrases = (node) => {
    if (!node || highlightBudget <= 0) return;
    const original = node.nodeValue;
    if (!original || original.trim().length < 3 || !phraseRegex.test(original)) {
      phraseRegex.lastIndex = 0;
      return;
    }
    phraseRegex.lastIndex = 0;

    const frag = document.createDocumentFragment();
    let lastIndex = 0;
    let match;

    while ((match = phraseRegex.exec(original)) !== null && highlightBudget > 0) {
      const [matchedText] = match;
      const start = match.index;
      if (start > lastIndex) {
        frag.appendChild(document.createTextNode(original.slice(lastIndex, start)));
      }

      const span = document.createElement("span");
      span.className = "attention-phrase";
      if (/Cisco Networking Academy|CCNA|CCNP/i.test(matchedText)) {
        span.classList.add("attention-phrase--strong");
      }
      span.textContent = matchedText;
      frag.appendChild(span);
      lastIndex = start + matchedText.length;
      highlightBudget -= 1;
    }

    if (lastIndex < original.length) {
      frag.appendChild(document.createTextNode(original.slice(lastIndex)));
    }

    node.parentNode.replaceChild(frag, node);
  };

  keywordRoot.querySelectorAll(blockSelector).forEach((block) => {
    if (highlightBudget <= 0) return;
    if (blockedTags.has(block.tagName) || block.closest(".nav, .submenu, .footer, .mobile-quick-actions")) return;

    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let current;
    while ((current = walker.nextNode())) {
      if (!current.parentElement) continue;
      if (blockedTags.has(current.parentElement.tagName)) continue;
      if (current.parentElement.closest("a, button, summary, .attention-phrase")) continue;
      nodes.push(current);
    }
    nodes.forEach(wrapPhrases);
  });
}
