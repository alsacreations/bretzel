/**
 * Initialise l'état de la navigation selon la taille de l'écran
 * Desktop (>= 48rem) : opened
 * Mobile (< 48rem) : closed
 */
function initializeNavigationState() {
  const target = document.querySelector("#main-content")
  const button = document.querySelector(".burger-button")

  if (!target) return

  // Utilise matchMedia pour détecter le breakpoint 48rem
  const isDesktop = window.matchMedia("(width >= 48rem)").matches

  if (isDesktop) {
    target.setAttribute("data-state", "opened")
    if (button) button.setAttribute("aria-expanded", "true")
  } else {
    target.setAttribute("data-state", "closed")
    if (button) button.setAttribute("aria-expanded", "false")
  }

  // Synchronise l'état inert
  syncMainInertState()
}

/**
 * Synchronise l'attribut inert sur <main> en fonction de l'état de la navigation
 * Sur mobile, si la navigation est ouverte, main doit être inert
 */
function syncMainInertState() {
  const target = document.querySelector("#main-content")
  const mainElement = document.querySelector(".main")

  if (!target || !mainElement) return

  const isMobile = !window.matchMedia("(width >= 48rem)").matches
  const isNavigationOpened = target.getAttribute("data-state") === "opened"

  // Sur mobile avec navigation ouverte, main doit être inert
  if (isMobile && isNavigationOpened) {
    mainElement.setAttribute("inert", "")
  } else {
    mainElement.removeAttribute("inert")
  }
}

/**
 * Active le bouton burger pour le menu mobile uniquement
 * Sur desktop, la navigation reste toujours ouverte
 */
function setupBurgerMenu() {
  const button = document.querySelector(".burger-button")
  const target = document.querySelector("#main-content")

  if (!button || !target) return

  button.addEventListener("click", () => {
    // Le toggle ne fonctionne que sur mobile
    const isMobile = !window.matchMedia("(width >= 48rem)").matches

    if (!isMobile) return // Sur desktop, ne rien faire

    const currentState = target.getAttribute("data-state")

    if (!currentState || currentState === "closed") {
      target.setAttribute("data-state", "opened")
      button.setAttribute("aria-expanded", "true")
    } else {
      target.setAttribute("data-state", "closed")
      button.setAttribute("aria-expanded", "false")
    }

    // Synchronise l'état inert
    syncMainInertState()
  })
}

/**
 * Ferme la navigation lors d'un clic sur un lien de navigation (mobile uniquement)
 */
function setupNavigationClose() {
  const target = document.querySelector("#main-content")
  const navigation = document.querySelector("#navigation")
  const button = document.querySelector(".burger-button")

  if (!target || !navigation) return

  // Écoute les clics sur tous les liens de navigation
  navigation.addEventListener("click", (event) => {
    // Vérifie si l'élément cliqué est un lien de navigation
    const link = event.target.closest("a.nav-item")

    if (link) {
      // Ferme la navigation uniquement sur mobile (< 48rem)
      const isMobile = !window.matchMedia("(width >= 48rem)").matches

      if (isMobile) {
        target.setAttribute("data-state", "closed")
        if (button) button.setAttribute("aria-expanded", "false")
      }
    }
  })
}

// Initialise l'état de la navigation au chargement
initializeNavigationState()

// Active le menu burger
setupBurgerMenu()

// Active la fermeture de la navigation au clic sur un lien
setupNavigationClose()

/**
 * Initialise le commutateur de thème (clair/sombre)
 */
function setupThemeSwitcher() {
  const button = document.querySelector(".js-theme-switcher")
  if (!button) return

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")

  /**
   * Applique le thème choisi
   * @param {'light' | 'dark'} theme
   */
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
    button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false")
  }

  // Initialisation
  const storedTheme = localStorage.getItem("theme")
  const initialTheme = storedTheme || (prefersDark.matches ? "dark" : "light")
  setTheme(initialTheme)

  // Événements
  button.addEventListener("click", () => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark"
    setTheme(currentTheme)
  })

  prefersDark.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light")
    }
  })
}

// Active les fonctionnalités globales
setupThemeSwitcher()
// Active les contrôles de démo si présents (protection si non fournis)
if (typeof setupDemoControls === "function") {
  setupDemoControls()
}

/* -----------------------------
   Routage client léger (SPA)
   Charge les partials depuis
   `templates/partials/*.hbs` et
   remplace le <main> sans recharger
   la page — compatible avec la
   réécriture serveur existante.
   Utilise import.meta.glob pour que
   Vite fournisse les partials en dev.
   ----------------------------- */

// Charge toutes les partials Handlebars comme raw via Vite (dev + build)
const __partialsModules = import.meta.glob("/templates/partials/*.hbs", {
  query: "?raw",
  import: "default",
})

/**
 * Récupère le nom de la page à partir du pathname
 * '/' -> 'homepage', '/page-type' -> 'page-type'
 */
function getPageNameFromPath(pathname) {
  const p = pathname.replace(/(^\/+|\/+$$)/g, "")
  return p === "" ? "homepage" : p
}

/**
 * Remplace le <main> courant par le markup récupéré
 * @param {string} htmlText
 */
function replaceMainContent(htmlText) {
  // Cherche l'élément <main> dans la réponse
  const tmp = document.createElement("div")
  tmp.innerHTML = htmlText
  const newMain = tmp.querySelector("main.main")
  if (!newMain) return false

  const currentMain = document.querySelector(".main-wrapper .main")
  if (currentMain) currentMain.replaceWith(newMain)
  else {
    // Si absent (cas improbable), injecte simplement
    const wrapper = document.querySelector(".main-wrapper")
    if (wrapper) wrapper.appendChild(newMain)
  }

  // Met à jour le titre de la page si possible
  const titleEl = newMain.querySelector("#component-title")
  if (titleEl) document.title = `${titleEl.textContent} — Bretzel`

  return true
}

/**
 * Charge la page (HTML ou partial) et l'injecte — fallback non-destructif
 * @param {string} pathname
 */
async function loadPageEnhanced(pathname) {
  const base = document.body.dataset.base || "/"
  const pageName = getPageNameFromPath(pathname)

  // Essayer HTML complet (index.html ou page-name.html)
  const htmlUrl =
    pageName === "homepage" ? `${base}index.html` : `${base}${pageName}.html`
  try {
    const res = await fetch(htmlUrl, { cache: "no-store" })
    if (res.ok) {
      const text = await res.text()
      if (replaceMainContent(text)) {
        postLoadUIUpdates(pageName)
        return
      }
    }
  } catch (e) {
    // ignore
  }

  // Sinon essayer la partial Handlebars — preferer import.meta.glob (Vite)
  const partialKey = Object.keys(__partialsModules).find((k) =>
    k.endsWith(`/${pageName}.hbs`),
  )
  if (partialKey) {
    try {
      const text = await __partialsModules[partialKey]()
      if (replaceMainContent(text)) {
        postLoadUIUpdates(pageName)
        return
      }
    } catch (e) {
      // ignore and try fetch fallback below
    }
  }

  // Fallback : essayer de récupérer la partial via fetch si le glob n'a pas marché
  const partialUrl = `${base}templates/partials/${pageName}.hbs`
  try {
    const res = await fetch(partialUrl, { cache: "no-store" })
    if (!res.ok) throw new Error("Not found")
    const text = await res.text()
    if (replaceMainContent(text)) {
      postLoadUIUpdates(pageName)
      return
    }
  } catch (e) {
    // ignore
  }
}

/**
 * Charge le partial correspondant à la route et l'injecte
 * @param {string} pathname
 */
async function loadPage(pathname) {
  const base = document.body.dataset.base || "/"
  const pageName = getPageNameFromPath(pathname)
  const partialUrl = `${base}templates/partials/${pageName}.hbs`

  try {
    const res = await fetch(partialUrl, { cache: "no-store" })
    if (!res.ok) throw new Error("Not found")
    const text = await res.text()

    const replaced = replaceMainContent(text)
    if (replaced) {
      // Ferme la navigation sur mobile si besoin
      const target = document.querySelector("#main-content")
      const button = document.querySelector(".burger-button")
      const isMobile = !window.matchMedia("(width >= 48rem)").matches
      if (isMobile && target) {
        target.setAttribute("data-state", "closed")
        if (button) button.setAttribute("aria-expanded", "false")
      }

      // Met à jour le lien actif dans la sidebar
      document.querySelectorAll("a.nav-item").forEach((a) => {
        const href = a.getAttribute("href")
        const normalized = href.replace(/(^\/+|\/+$$)/g, "")
        a.classList.toggle("is-active", normalized === pageName)
      })
    }
  } catch (err) {
    // Si échec, ne rien faire — laisse le contenu actuel
    // (utile pour pages spéciales comme /styleguide qui ont leur propre HTML)
    // console.debug(err);
  }
}

/**
 * Intercepte les clics sur les liens de navigation internes
 */
function setupSpaRouting() {
  const base = document.body.dataset.base || "/"

  // Gestion du clique sur liens internes
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a.nav-item")
    if (!a) return

    const href = a.getAttribute("href")
    // Ignore les liens absolus ou fichiers
    if (!href || href.includes(":") || href.includes(".")) return

    // Normalize base / absolute
    const url = new URL(href, location.origin + base)
    const pathname = url.pathname.replace(new RegExp(`^${base}`), "/")

    e.preventDefault()
    history.pushState({}, "", url.pathname)
    loadPageEnhanced(url.pathname)
  })

  // Back / forward
  window.addEventListener("popstate", () => loadPageEnhanced(location.pathname))

  // Chargement initial en fonction de l'URL
  loadPageEnhanced(location.pathname)
}

// Active le routage client léger
setupSpaRouting()
