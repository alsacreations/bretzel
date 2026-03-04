# AGENTS.md

Bretzel est une bibliothèque de layouts utilitaires HTML/CSS modernes, facilitant la création de structures responsives via des attributs `data-layout` paramétrables.

## Stack technique

- **Cœur** : HTML5, CSS3 natif (PostCSS), JS ES2022
- **Build & Dev** : Vite (MPA), Handlebars (templating), pnpm
- **Qualité** : ESLint, Stylelint, Prettier

## Commandes essentielles

- `pnpm install` : Installation des dépendances
- `pnpm dev` : Lancement du serveur de développement
- `pnpm build` : Génération du build de production (`dist/`)

## Conventions critiques (projet)

- **Layouts** : Utiliser exclusivement le système **Bretzel** via les attributs `data-layout` (`stack`, `cluster`, `duo`, etc.) plutôt que des classes utilitaires ou du CSS ad-hoc.
- **Thème** : Utiliser uniquement les variables sémantiques (`tokens`) définies dans `assets/css/theme.css`.
- **Media Queries** : Utiliser la syntaxe Custom Media listée dans le thème (ex: `@media (--md)`).
- **Architecture** : Les composants et pages sont des partials Handlebars situés dans `templates/`.

## Conventions critiques (global)

- **CSS** : Jamais de styles inline (bloqués par CSP). Utilisation de CSS natif uniquement (pas de Tailwind/Bootstrap).
- **Commits** : Conventional Commits (type en anglais, description en français).
- **Documentation** : Commentaires et documentation obligatoirement en français.
