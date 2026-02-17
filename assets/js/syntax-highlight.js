/**
 * Coloration syntaxique via la CSS Custom Highlight API
 * https://developer.mozilla.org/en-US/docs/Web/API/Highlight
 *
 * Crée des Range sur les nœuds texte contenus dans les <pre><code>
 * et les enregistre dans CSS.highlights pour un style via ::highlight().
 *
 * Tokens reconnus (HTML) :
 *   - syntax-tag        : noms de balises (<div>, </div>)
 *   - syntax-attr-name  : noms d'attributs (class, data-layout)
 *   - syntax-attr-value : valeurs d'attributs ("switcher", "m")
 *   - syntax-punctuation: < > </ /> =
 *   - syntax-entity     : entités HTML (&lt; &amp; &#8239;)
 *   - syntax-comment    : commentaires HTML (<!-- ... -->)
 */

// Vérifie que l'API est disponible
const supportsHighlightAPI =
  typeof CSS !== "undefined" &&
  typeof CSS.highlights !== "undefined" &&
  typeof Highlight !== "undefined"

/**
 * Définition des tokens via des regex.
 * Chaque regex doit capturer le groupe entier.
 * L'ordre détermine la priorité (premier match gagne).
 */
const TOKEN_TYPES = [
  { name: "syntax-comment", re: /<!--[\s\S]*?-->/g },
  { name: "syntax-entity", re: /&(?:#[0-9]+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g },
  { name: "syntax-attr-value", re: /"[^"]*"/g },
  {
    name: "syntax-attr-name",
    re: /(?<=<\/?[a-zA-Z][a-zA-Z0-9-]*[\s\S]*?\s)[a-zA-Z][a-zA-Z0-9_:.-]*(?=\s*=)/g,
  },
  { name: "syntax-tag", re: /(?<=<\/?)([a-zA-Z][a-zA-Z0-9-]*)/g },
  { name: "syntax-punctuation", re: /(?:<\/?|\/?>|=)/g },
]

/**
 * Récupère tous les nœuds texte d'un élément, dans l'ordre du document.
 * @param {Node} root
 * @returns {{ node: Text, start: number }[]}
 */
function getTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes = []
  let offset = 0

  while (walker.nextNode()) {
    const node = walker.currentNode
    nodes.push({ node, start: offset })
    offset += node.textContent.length
  }

  return nodes
}

/**
 * Crée un Range ciblant [absStart, absEnd) dans une liste de nœuds texte.
 * @param {{ node: Text, start: number }[]} textNodes
 * @param {number} absStart — position de départ absolue
 * @param {number} absEnd   — position de fin absolue
 * @returns {Range | null}
 */
function createRangeFromAbsoluteOffsets(textNodes, absStart, absEnd) {
  let startNode = null
  let startOffset = 0
  let endNode = null
  let endOffset = 0

  for (const { node, start } of textNodes) {
    const end = start + node.textContent.length

    if (!startNode && absStart >= start && absStart < end) {
      startNode = node
      startOffset = absStart - start
    }

    if (absEnd > start && absEnd <= end) {
      endNode = node
      endOffset = absEnd - start
      break
    }
  }

  if (!startNode || !endNode) return null

  try {
    const range = new Range()
    range.setStart(startNode, startOffset)
    range.setEnd(endNode, endOffset)
    return range
  } catch {
    return null
  }
}

/**
 * Tokenise le texte brut et retourne un tableau de matches,
 * en excluant les chevauchements (premier token décelé l'emporte).
 * @param {string} text
 * @returns {{ name: string, start: number, end: number }[]}
 */
function tokenize(text) {
  /** @type {{ name: string, start: number, end: number }[]} */
  const matches = []

  for (const { name, re } of TOKEN_TYPES) {
    const regex = new RegExp(re.source, re.flags)
    let m

    while ((m = regex.exec(text)) !== null) {
      const start = m.index
      const end = start + m[0].length

      // Vérifie qu'il n'y a pas de chevauchement avec un token déjà trouvé
      const overlaps = matches.some(
        (existing) => start < existing.end && end > existing.start,
      )

      if (!overlaps) {
        matches.push({ name, start, end })
      }
    }
  }

  return matches
}

/**
 * Applique la coloration syntaxique sur tous les <pre> de la page.
 * Appelé au chargement et après chaque navigation SPA.
 */
export function highlightAllPreBlocks() {
  if (!supportsHighlightAPI) return

  // Regroupe les ranges par type de token
  /** @type {Map<string, Range[]>} */
  const rangesMap = new Map()

  for (const { name } of TOKEN_TYPES) {
    rangesMap.set(name, [])
  }

  const preElements = document.querySelectorAll("pre")

  for (const pre of preElements) {
    const textNodes = getTextNodes(pre)
    const fullText = textNodes.map(({ node }) => node.textContent).join("")
    const tokens = tokenize(fullText)

    for (const { name, start, end } of tokens) {
      const range = createRangeFromAbsoluteOffsets(textNodes, start, end)
      if (range) {
        rangesMap.get(name).push(range)
      }
    }
  }

  // Enregistre (ou met à jour) chaque highlight dans le registry
  for (const [name, ranges] of rangesMap) {
    if (ranges.length > 0) {
      CSS.highlights.set(name, new Highlight(...ranges))
    } else {
      CSS.highlights.delete(name)
    }
  }
}
