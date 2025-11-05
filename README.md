# Bretzel 🥨

Bretzel est un ensemble de **Layouts CSS utilitaires** modernes et réutilisables, conçu par [Alsacréations](https://www.alsacreations.fr/) pour simplifier la création de mises en page responsives.

Ces outils sont inspirés du projet [Every-Layout](https://every-layout.dev/) et de la méthode [CUBE CSS](https://cube.fyi/).

## 🎯 Principe

Les Layouts sont des classes CSS neutres qui gèrent **l'agencement et l'interaction** des composants entre eux, sans imposer de style visuel. Ils sont :

- **Responsives** par défaut
- **Paramétrables** via variables CSS
- **Réutilisables** sur tous vos projets

## 📦 Installation

Copiez le fichier [`layouts.css`](public/layouts.css) dans votre projet et importez-le dans votre feuille de styles principale :

```css
@import "layouts.css";
```

💡 **Conseil** : Placez ce fichier dans un `@layer` au-dessus de votre `reset` CSS pour une meilleure gestion de la cascade.

## 🧩 Layouts disponibles

- **Stack** : empilage vertical avec espacement consistant
- **Cluster** : disposition horizontale avec retour à la ligne automatique
- **Autogrid** : grille automatique responsive
- **Switcher** : bascule entre affichage horizontal et vertical
- **Repel** : écarte deux éléments aux extrémités
- **Reel** : défilement horizontal avec scroll-snap
- **Duo** : deux colonnes avec rapports personnalisables
- **Boxed** : conteneur centré avec largeur maximale

## 🚀 Utilisation

Appliquez un layout via l'attribut `data-layout` :

```html
<div data-layout="stack">
  <div>Élément 1</div>
  <div>Élément 2</div>
  <div>Élément 3</div>
</div>
```

### Modification des gouttières

Ajustez l'espacement avec `data-gap` :

```html
<div data-layout="cluster" data-gap="l">
  <!-- Gouttière large -->
</div>

<div data-layout="stack" data-gap="xl">
  <!-- Gouttière extra-large -->
</div>

<div data-layout="autogrid" data-gap="none">
  <!-- Sans gouttière -->
</div>
```

### Variables CSS

Personnalisez les layouts via des variables CSS :

```css
:root {
  --gap-m: 1.5rem; /* gouttière par défaut */
  --gap-l: 2.5rem; /* gouttière large */
  --gap-xl: 4rem; /* gouttière extra-large */
}
```

## 📚 Documentation complète

Consultez la [documentation interactive](https://alsacreations.github.io/bretzel/) avec exemples et démos pour chaque layout.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou soumettre une pull request.

## 📄 Licence

**Auteur** : Alsacréations

Les contenus de ce dépôt sont disponibles sous licence **Creative Commons BY-NC-SA 2.0 FR** (Attribution - Pas d'Utilisation Commerciale - Partage à l'Identique).
