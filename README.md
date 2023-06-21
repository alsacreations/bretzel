# Bretzel

Bretzel est un outil d'assistance à la [méthodologie Cube CSS](https://cube.fyi/) conçu par l'agence web Alsacréations pour ses projets d'intégration. 

Voir : http://bretzel.alsacreations.com/

Bretzel fournit :

- un Reset CSS,
- un annuaire de Layouts (compositions),
- un Constructeur de classes utilitaires.

## Un Reset CSS

Le fichier reset CSS est un fichier employé à la base de tous nos projets CSS. Il apporte des fonctionnalités basiques utiles partout.

https://github.com/alsacreations/bretzel/blob/main/_base/_reset.scss

## Un annuaire de Layouts

Les "Layouts" sont des zones d'affichages destinées à gérer la façon dont les composants vont s'afficher et interagir entre eux. Leurs caractéristiques :

- Neutres : non liées à un framework, une structure, ou un design particulier.
- Flexibles : adaptatifs (responsive) automatiquement, sans besoin de Media Queries.
- Réutilisables : prêtes à être employées à divers entroits d'une page web, voire d'être imbriquées.
  
## un Constructeur de classes CSS utilitaires

Enfin Bretzel est un _Constructeur de classes CSS utilitaires_.

**TODO : fonctionnalité en cours de développement**

Bretzel est conçu à partir du pré-processeur Sass et est configuré pour fonctionner dans tout environnement d'intégration front-end :

- statique (HTML, CSS, JavaScript),
- avec CMS tel que WordPress, etc.
- avec frameworks HTML / CSS tels que Bootstrap, etc.
- avec frameworks JS tels que Vue / Nuxt, React, Angular, etc.
- avec méthodologies telles que BEM, SMACSS, ITCSS, etc.

Bretzel, bien qu'indépendant de tout outil, est toutefois développé dans l'esprit de la **méthodologie [Cube CSS](https://cube.fyi/)**. Des connaissances de cette méthodologie peuvent faciliter la compréhension de certains choix au sein de Bretzel.

## À quoi ça sert ?

Un Classe Utilitaire (_Utility Class_) est une classe CSS qui fait un seul job et qui le fait bien.

Un constructeur de classes utilitaires va puiser au sein de ["design tokens"](https://css-tricks.com/what-are-design-tokens/) configurés pour chaque projet et s'en servir pour générer un ensemble de classes utilitaires responsive.

Quelques exemples :

```scss
// tokens de tailles
$sizes: (
  "0": 0,
  "1": 1px,
  "2": 0.125rem,
  "4": 0.25rem,
  "8": 0.5rem,
) !default;
```

```scss
// exemples de classes générées
.p-2 {padding: 0.125rem;}
.pt-4 {padding-top: 0.25rem;}
.mx-4 {margin-inline: 0.25rem;}
.gap-1 {gap: 1px;}
```

```html
<!-- exemple de structure associée --> 
<section class="[ info-main ] [ mx-8 md:max-auto gap-32 ]"></section>
```

_Note : la syntaxe employant des crochets (`[]`) est issue de la méthodologie [CubeCSS](https://piccalil.li/blog/cube-css/)_

## Comment on s'en sert ?

Nos projets web sont constitués de :

- un fichier CSS Reset ([exemple](https://github.com/elad2412/the-new-css-reset))
- une convention de nommage au choix (par exemple BEM)
- un framework au choix, ou pas
- des classes utilitaires responsive

Bretzel se charge de la dernière partie.

Pour l'instant, il suffit de :

- Compiler le fichier SCSS principal `bretzel.scss` en CSS&hellip; et c'est tout
- Optionnel mais souhaitable : modifier le fichier `_config.scss`&hellip; si vous souhaitez changer les valeurs générées

## Un peu d'histoire

- Vers 2012, Alsacréations élabore son propre micro-framework nommé [KNACSS](https://www.knacss.com/), destiné à intégrer nos bonnes pratiques d'Accessibilité et demeurer très léger face aux usines à gaz telles que Bootstrap
- De 2014 à 2020, KNACSS s'enrichit au fur et à mesure (grilles de mise en forme, composants-types). Plus complexe, plus contraignant à mettre à jour, &hellip; plus proche de Bootstrap
- En 2020, Alsacréations adopte un framework CSS 100% axé sur des classes utilitaires, [TailwindCSS](https://www.alsacreations.com/tuto/lire/1812-Tailwind-CSS-decouverte-du-framework-original-et-innovant.html).
- À partir de 2022, [nos Guidelines](https://github.com/alsacreations/guidelines) concernant Tailwind démontrent qu'on y trouve autant d'inconvénients que d'avantages, et que le principal avantage consiste en classes utilitaires bien spécifiques.

## Checklist des classes utilitaires prises en charge

### Done

- Colors (color, background-color) √
- Font size √
- Font weight √
- Font style √
- Text transform √
- Line Height √
- Gaps √
- Radius √
- Paddings (top, right, bottom, left, inline, block) √
- Margins (top, right, bottom, left, inline, block) √
- Displays (none, revert, inline, inline-block, grid, inline-grid, flex, inline-flex) √
- Text alignment (left, right, center, justify) √
- Text overflow √
- `.visually-hidden` √
- Media Queries √

### Todo globale (WARNING : c'est le bazar ici)

Idées en vrac de choses à faire ou clarifier.

- récup JSON de Figma ?
- comment récupérer les valeurs du côté CSS :
  - variable de type `$size-small" ?
  - ou fonction de typt `get-size` / `get-color` / `get-utility` (<https://github.com/hankchizljaw/gorko/blob/main/src/functions/_get-color.scss>) ?
- valeur `revert` ou `unset` pour initialiser
- Classer au sein de `@layer`
- Combiner les MQ : <https://codepen.io/raphaelgoetter/pen/jOrPRbj>

- Dark / Ligh mode
- Préfixes
- Z-index
- Width (min- / max-)
- Height (min- / max-)
- Font families
- Liste style
- Text-decoration
- Border Width
- Border Color
- Opacity
- Cursor

### Todo PurgeCSS

- Tester avec PurgeCSS (classes avec échappement des `:`)

<https://stackoverflow.com/questions/65554596/purgecss-and-tailwind-css-how-to-preserve-responsive-classes-using-the-command>

### Todo Utils misc ?

Compositions ? <https://web.dev/design-system/css-compositions/>

`.auto-grid`

A flexible layout that will create an auto-fill grid with configurable grid item sizes.

`.breakout` ("full-bleed")

A layout that allows you to break a an element out of the bounds of its parent, with a sensible lock to prevent it bleeding out.

```css
.breakout {
    width: calc(100vw - 2.5rem);
    max-width: var(--breakout-max-width, 65rem);
    margin-left: 50%;
    transform: translateX(-50%);
}
```

```css
.full-bleed {
  width: 100vw;
  margin-left: 50%;
  transform: translateX(-50%);
}
```

background breakout : <https://codepen.io/raphaelgoetter/pen/qBxJYwX?editors=1100>

`.wrapper`

```css
.wrapper {
  margin-inline: auto;
  max-width: 60rem;
}
```

`.reel`

The Reel provides a scrollable, overflow container. To add a scrollbar, you apply the .scrollbar utility, which provides consistent scrollbars where needed.

```css
.reel {
    --reel-space: 2rem;
    display: flex;
    height: auto;
    max-width: 100%;
    margin-inline: auto;
    padding: 0.5rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}
```

```css
.reel>* {
    flex-basis: var(--reel-item-width, calc(33.333% - var(--reel-space)));
    flex-shrink: 0;
}
.reel[data-scroll=snap] {
    scroll-snap-type: x mandatory;
}
.reel[data-scroll=snap]>* {
    scroll-snap-align: start;
}
```

## Licence

Auteur : Alsacréations

Les contenus de ce dépôt sont disponibles sous une licence Creative Commons « Attribution - Pas d'Utilisation Commerciale - Partage à l'Identique 2.0 France (CC BY-NC-SA 2.0) ».
