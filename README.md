# Bretzel

Bretzel est un outil d'assistance à la [méthodologie Cube CSS](https://cube.fyi/) conçu par l'agence web Alsacréations pour ses projets d'intégration.

Voir : <http://bretzel.alsacreations.com/>

Bretzel fournit :

- un Reset CSS,
- un annuaire de Layouts (compositions),
- un Constructeur de classes utilitaires (en cours de développement).

## Un Reset CSS

Le fichier reset CSS est un fichier employé à la base de tous nos projets CSS. Il apporte des fonctionnalités basiques utiles partout.

<https://github.com/alsacreations/bretzel/blob/main/_reset/>

## Un annuaire de Layouts

Les "Layouts" sont des zones d'affichages destinées à gérer la façon dont les composants vont s'afficher et interagir entre eux.

<https://github.com/alsacreations/bretzel/blob/main/_layouts/>

## Un Constructeur de classes CSS utilitaires

Enfin Bretzel est un _Constructeur de classes CSS utilitaires_.

**TODO : fonctionnalité en cours de développement**

### Un peu d'histoire

- Vers 2012, Alsacréations élabore son propre micro-framework nommé [KNACSS](https://www.knacss.com/), destiné à intégrer nos bonnes pratiques d'Accessibilité et demeurer très léger face aux usines à gaz telles que Bootstrap
- De 2014 à 2020, KNACSS s'enrichit au fur et à mesure (grilles de mise en forme, composants-types). Plus complexe, plus contraignant à mettre à jour, &hellip; plus proche de Bootstrap
- En 2020, Alsacréations adopte un framework CSS 100% axé sur des classes utilitaires, [TailwindCSS](https://www.alsacreations.com/tuto/lire/1812-Tailwind-CSS-decouverte-du-framework-original-et-innovant.html).
- À partir de 2022, [nos Guidelines](https://github.com/alsacreations/guidelines) concernant Tailwind démontrent qu'on y trouve autant d'inconvénients que d'avantages, et que le principal avantage consiste en classes utilitaires bien spécifiques.

## Licence

Auteur : Alsacréations

Les contenus de ce dépôt sont disponibles sous une licence Creative Commons « Attribution - Pas d'Utilisation Commerciale - Partage à l'Identique 2.0 France (CC BY-NC-SA 2.0) ».
