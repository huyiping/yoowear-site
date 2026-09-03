(function () {
  const dict = window.YOOWEAR_I18N;
  const storageKey = "yoowear-lang";

  function detectLang() {
    const saved = localStorage.getItem(storageKey);
    if (saved === "zh" || saved === "en") return saved;
    const sys = (navigator.language || navigator.userLanguage || "en").toLowerCase();
    return sys.startsWith("zh") ? "zh" : "en";
  }

  function applyLang(lang) {
    const pack = dict[lang] || dict.zh;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.body.dataset.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (pack[key] != null) el.textContent = pack[key];
    });

    const nextLabel = lang === "zh" ? "EN" : "中文";
    document.querySelectorAll("[data-lang-label]").forEach((el) => {
      el.textContent = nextLabel;
    });

    if (pack["meta.title"]) document.title = pack["meta.title"];
    const desc = document.querySelector('meta[name="description"]');
    if (desc && pack["meta.description"]) {
      desc.setAttribute("content", pack["meta.description"]);
    }

    localStorage.setItem(storageKey, lang);
  }

  function toggleLang() {
    const next = document.body.dataset.lang === "zh" ? "en" : "zh";
    applyLang(next);
  }

  applyLang(detectLang());

  const langSwitch = document.getElementById("langSwitch");
  const langSwitchMobile = document.getElementById("langSwitchMobile");
  if (langSwitch) langSwitch.addEventListener("click", toggleLang);
  if (langSwitchMobile) langSwitchMobile.addEventListener("click", toggleLang);

  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");

  function closeMenu() {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    mobileNav.hidden = true;
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!open));
      mobileNav.hidden = open;
    });

    mobileNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeMenu);
    });
  }

  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
})();
