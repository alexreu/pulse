---
name: Pulse
description: Un tableau de bord commercial calme sur un sol chaud — cartes blanches sans filet, lime pour l'actif, noir pour l'action.
colors:
  canvas: "oklch(0.966 0.004 95)"
  sunk: "oklch(0.941 0.005 95)"
  surface: "oklch(1 0 0)"
  ink: "oklch(0.215 0.005 95)"
  ink-muted: "oklch(0.52 0.006 95)"
  ink-subtle: "oklch(0.498 0.006 95)"
  line: "oklch(0.912 0.005 95)"
  line-strong: "oklch(0.855 0.006 95)"
  brand: "oklch(0.855 0.19 130)"
  brand-hover: "oklch(0.815 0.19 130)"
  brand-ink: "oklch(0.215 0.005 95)"
  brand-tint: "oklch(0.855 0.19 130 / 0.22)"
  action: "oklch(0.215 0.005 95)"
  action-hover: "oklch(0.3 0.005 95)"
  action-ink: "oklch(0.99 0 0)"
  neutral: "oklch(0.52 0.006 95)"
  neutral-tint: "oklch(0.52 0.006 95 / 0.1)"
  info: "oklch(0.52 0.13 245)"
  info-tint: "oklch(0.52 0.13 245 / 0.11)"
  purple: "oklch(0.5 0.19 300)"
  purple-tint: "oklch(0.5 0.19 300 / 0.11)"
  warning: "oklch(0.545 0.14 58)"
  warning-tint: "oklch(0.545 0.14 58 / 0.13)"
  success: "oklch(0.5 0.14 150)"
  success-tint: "oklch(0.5 0.14 150 / 0.11)"
  danger: "oklch(0.51 0.2 27)"
  danger-tint: "oklch(0.51 0.2 27 / 0.11)"
  chart-idle: "oklch(0.925 0.005 95)"
  scrim: "oklch(0.215 0.005 95 / 0.35)"
typography:
  figure:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: "2.25rem"
    letterSpacing: "-0.028em"
    fontFeature: "tabular-nums"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: "1.75rem"
    letterSpacing: "-0.022em"
  panel:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: "1.5rem"
    letterSpacing: "-0.014em"
  lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: "1.5rem"
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.375rem"
    letterSpacing: "normal"
  ui-title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: "1.375rem"
    letterSpacing: "-0.006em"
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: "1.125rem"
    letterSpacing: "0.01em"
  micro:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: "1rem"
    letterSpacing: "normal"
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: "1.125rem"
    fontFeature: "tabular-nums"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  2xl: "1.25rem"
  full: "999px"
spacing:
  hairline: "1px"
  tight: "0.375rem"
  control: "0.5rem"
  inline: "0.75rem"
  panel: "1rem"
  figure-panel: "1.25rem"
  section: "1.5rem"
  page: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.brand-ink}"
    rounded: "{rounded.md}"
    padding: "0 0.875rem"
    height: "2.25rem"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.brand-hover}"
    textColor: "{colors.brand-ink}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 0.875rem"
    height: "2.25rem"
    typography: "{typography.body}"
  button-secondary-hover:
    backgroundColor: "{colors.canvas-sunk}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    height: "2.25rem"
  button-ghost-hover:
    backgroundColor: "{colors.canvas-sunk}"
    textColor: "{colors.ink}"
  button-danger:
    backgroundColor: "{colors.danger-tint}"
    textColor: "{colors.danger}"
    rounded: "{rounded.md}"
    height: "2.25rem"
  button-danger-hover:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.brand-ink}"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.brand-text}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 0.75rem"
    height: "2.25rem"
    typography: "{typography.body}"
  input-invalid:
    backgroundColor: "{colors.danger-tint}"
    textColor: "{colors.ink}"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "1rem"
  status-badge:
    backgroundColor: "{colors.info-tint}"
    textColor: "{colors.info}"
    rounded: "{rounded.full}"
    padding: "0.125rem 0.5rem"
    typography: "{typography.label}"
  nav-item-active:
    backgroundColor: "{colors.brand-tint}"
    textColor: "{colors.brand-text}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.625rem"
    typography: "{typography.body}"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.md}"
    padding: "0.5rem 0.625rem"
  dialog:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    width: "36rem"
  tooltip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.375rem 0.625rem"
    typography: "{typography.label}"
---

# Design System: Pulse

## Overview

**Creative North Star : « L'instrument calme »**

Pulse est un poste de travail, pas une affiche. Toute la mise en scène tient dans trois matériaux : un canevas neutre et froid, une surface blanche posée dessus, et un filet d'un pixel qui sépare. L'élévation existe mais reste au plus bas de sa rampe ; la couleur n'est dépensée que sur ce qui est actif ou sur ce qui porte un état. Ce qui reste — l'écrasante majorité de chaque écran — est de l'encre sur de la surface, aligné sur une seule chasse quand ce sont des chiffres.

**Lignage.** Ce système est le système Nexa, le projet personnel de l'auteur, porté d'une densité marketing vers une densité produit. L'axe neutre OKLCH sur la teinte 278, le violet de marque, Geist et Geist Mono, la rampe de rayons et la rampe d'élévation à quatre niveaux viennent de `nexa/src/app/globals.css` et n'ont pas été redessinés ici : seules l'échelle typographique et les hauteurs de contrôle ont été resserrées pour un produit. C'est un fait durable : une évolution future ne doit pas défaire ce lignage par accident, ni réinventer un axe neutre à côté de celui-ci.

Le monde refuse explicitement les deux arrangements habituels de la catégorie : la grille de cartes KPI arrondies flottant au-dessus d'un graphique en aire dégradée, et le terminal analytique sombre à accent néon. Le thème sombre existe, mais c'est le même système sur la rampe sombre de Nexa, à parité de contraste — pas un autre monde.

**Key Characteristics:**
- Axe neutre froid unique en OKLCH, teinte 278, du canevas jusqu'au filet
- Un seul violet de marque, réservé à l'action primaire, à la destination courante et à l'état actif
- Six tons d'état sémantiques, chacun toujours accompagné de son mot
- Filet d'un pixel comme séparateur principal ; l'ombre ne fait que confirmer
- Geist partout, Geist Mono pour les identifiants et les mesures
- Échelle typographique fixe, jamais fluide
- Chiffres tabulaires partout où une colonne se compare

## Colors

Une palette d'un seul accent posée sur un gris froid légèrement violacé : tout le neutre partage la teinte 278 du violet de marque, ce qui fait tenir l'ensemble sans qu'aucune surface ne paraisse colorée.

### Primary
- **Violet Pulse** : l'action primaire remplie, la destination courante du rail (en teinte à 8 %), l'état coché d'une case, l'interrupteur actif, la barre du graphique de chiffre d'affaires, le curseur de saisie et la sélection de texte. Rien d'autre. Sa variante `brand-text` existe parce que le violet plein ne tient pas le contraste en texte sur surface claire ; sa variante `brand-hover` s'assombrit en clair et s'éclaircit en sombre.

### Secondary
Aucune. Le système n'a qu'un accent ; ce qui ressemble à une seconde couleur est toujours un ton d'état.

### Tertiary — le vocabulaire d'état
Six tons, un par étape du pipeline, chacun avec sa version pleine (trait, texte, barre) et sa version teintée (fond) :
- **Neutre** (`Nouveau`) : gris froid, l'étape sans qualité.
- **Info** (`Contacté`) : bleu.
- **Violet d'état** (`Qualifié`) : magenta-violet, distinct du violet de marque par la teinte 335.
- **Ambre** (`Proposition`) : l'attente.
- **Vert** (`Gagné`) : la signature ; sert aussi à la tendance en hausse.
- **Rouge** (`Perdu`) : la clôture sans signature ; sert aussi à l'erreur, à l'action destructive et à la tendance en baisse.

### Neutral
- **Canevas** : le fond de page en thème clair, presque blanc mais jamais blanc.
- **Canevas creusé** : le rail, les pieds de boîte de dialogue, les emplacements en attente, les états survolés des contrôles fantômes.
- **Surface** : blanc pur en clair, gris relevé en sombre ; tout ce qui est posé sur le canevas.
- **Encre / encre atténuée / encre discrète** : le texte principal, les étiquettes et les métadonnées, en trois degrés seulement.
- **Filet / filet renforcé** : la bordure par défaut de tout l'applicatif et le degré au-dessus, pour le survol des champs, l'ascenseur et la case à cocher au repos.
- **Voile** : le fond des couches modales.

### Named Rules
**La règle du token unique.** Aucun composant ne code une couleur en dur. Toute couleur passe par une variable CSS ou par la classe Tailwind qui la référence — y compris dans les graphiques, où Recharts reçoit `var(--line)`, `var(--brand)`, `var(--ink-subtle)`.

**La règle de la parité sombre.** Le thème sombre est le même système sur l'autre rampe : mêmes noms de tokens, mêmes rôles, contraste équivalent. On n'invente pas un token qui n'existe que dans un thème.

**La règle du mot avec la couleur.** Un état n'est jamais porté par la couleur seule : l'étiquette d'étape affiche son mot et une pastille, une tendance affiche une flèche, un signe typographique (`+` / `−`) et un mot (« en hausse », « en baisse », « stable »). La couleur ne fait que confirmer.

## Typography

**Police de texte :** Geist (avec `ui-sans-serif`, `system-ui`)
**Police de mesure :** Geist Mono (avec `ui-monospace`)

**Caractère :** une seule famille de texte pour toute l'interface. Un produit n'a pas besoin d'une fonte d'affichage séparée : la hiérarchie se fait par la taille, le poids et un interlettrage qui se resserre à mesure que le corps grandit. Geist Mono n'est pas décoratif — il signale qu'une valeur est une mesure.

### Hierarchy
- **Chiffre** (600, `text-figure`, interlettrage serré, chasse fixe) : le chiffre de tête d'un indicateur. Porté par `.ui-figure`.
- **Titre de page** (600, `text-title`, interlettrage serré) : le `h1` de chaque route, une seule fois par page.
- **Titre de section** (600, `text-panel`) : titre de boîte de dialogue, titre d'état vide, titre d'état d'erreur.
- **Intertitre** (600, `text-lead`) : le mot-symbole du rail, la valeur mise en avant d'une info-bulle de graphique.
- **Corps** (400, `text-body`) : la valeur par défaut du `body`. Tout le texte courant, les cellules, les libellés de navigation. Les paragraphes explicatifs sont bornés à 68ch (entête de page) ou 46ch (états vides).
- **Titre d'élément** (600, `text-body`) : les titres de panneau, portés par `.ui-title` — casse normale, jamais de capitales suivies.
- **Étiquette** (500, `text-label`, +0.01em) : entêtes de colonne, libellés de champ, métadonnées. Portée par `.ui-label`.
- **Micro** (400, `text-micro`) : disponible dans l'échelle pour les mentions les plus fines.
- **Mesure** (Geist Mono, `text-label`) : dates absolues, horodatages, identifiants techniques, détail d'erreur.

### Named Rules
**La règle de l'échelle fixe.** L'échelle typographique est fixe, jamais fluide. Aucun `clamp()` dans l'application : un tableau de bord se lit à la même taille sur un écran de 13 et de 27 pouces ; c'est la densité qui change, pas le corps.

**La règle de la mesure.** Une date absolue ou un horodatage est une mesure et prend Geist Mono ; un mot relatif (« Aujourd'hui », « Hier ») reste en Geist. `formatRelativeDayParts` renvoie le drapeau `relative` précisément pour que l'appelant choisisse la bonne fonte.

**La règle de la colonne.** Tout ce qui se compare verticalement s'aligne sur la même chasse : `[data-slot="figure"]`, `table` et `time` reçoivent `tabular-nums` depuis la couche de base, et la classe de signature `.ui-figure` y ajoute le poids et l'interlettrage serré du chiffre de tête.

## Layout

Une coquille unique partagée par les six routes : un rail fixe de 248 px sur le canevas creusé, séparé du contenu par un filet, et un entête collant de 56 px sur la surface translucide avec flou d'arrière-plan. Sous 1024 px, le rail devient un tiroir de 280 px (85 vw maximum) qui glisse depuis la gauche.

Le contenu vit dans un `main` sans largeur maximale : la marge horizontale passe de 1 rem à 1,5 rem puis 2 rem (`sm`, `lg`), la marge verticale reste à 1,5 rem. Il n'y a pas de conteneur centré — un tableau de bord occupe l'écran qu'on lui donne.

Le rythme d'espacement est un pas de 4 px, exploité sur une poignée de crans seulement : 0,5 rem entre contrôles voisins, 0,75 rem entre groupes en ligne, 1 rem pour le rembourrage d'un panneau, 1,25 rem pour un bloc de chiffre, 1,5 rem entre sections d'une page.

Les points de rupture sont ceux de Tailwind, employés par ordre d'importance : `sm` (640 px) pour passer les barres d'outils en ligne, `md` (768 px), `lg` (1024 px) pour le rail permanent, `xl` (1280 px) pour la quatrième colonne d'indicateurs. Les colonnes de tableau ont un ordre de sacrifice explicite : la société tombe sous `md`, la date de création sous `lg`, l'e-mail sous `xl`.

### Named Rules
**La règle du filet plutôt que de la carte.** Les routes ne sont pas construites en cartes flottantes. Une bande d'indicateurs est un seul panneau dont les quatre quartiers sont séparés par une gouttière d'un pixel remplie de la couleur de filet ; une liste ou un pipeline est une suite de lignes séparées par `divide-y`. Le blanc entre deux blocs est de l'espace, pas une ombre.

## Elevation & Depth

Le système est presque plat. La profondeur vient d'abord du contraste entre canevas, canevas creusé et surface, et du filet qui les sépare ; l'ombre n'arrive qu'en second et sert à dire à quelle couche appartient un élément. Chaque ombre porte un vrai décalage vertical et un flou doux — jamais un halo centré. La rampe est celle de Nexa, à quatre niveaux, et elle est plus dense en thème sombre.

### Shadow Vocabulary
- **Discrète** (`--elevation-subtle`) : le repos. Panneaux, champs, boutons primaires et secondaires, case à cocher, pastille d'interrupteur.
- **Carte** (`--elevation-card`) : les info-bulles, seuls éléments qui flottent d'un cran sans être un menu.
- **Soulevée** (`--elevation-lifted`) : le contenu détaché qui se superpose au contenu — menu de sélection, menu déroulant, popover — et le survol d'un bouton primaire.
- **Voile** (`--elevation-overlay`) : réservée à la couche modale — boîte de dialogue, toast, lien d'évitement au focus.

### Named Rules
**La règle de la couche.** L'ombre encode la distance, pas l'importance. Un élément ne monte d'un cran que s'il quitte réellement le flux : rien au repos ne dépasse l'ombre discrète, et l'ombre de voile appartient à la couche modale.

## Shapes

Les formes sont douces mais fermes, jamais des pilules — sauf là où la pilule a un sens. La rampe de rayons de Nexa est employée par fonction : `0,375 rem` pour l'anneau de focus et les plus petits éléments, `0,5 rem` pour les contrôles (boutons, champs, éléments de menu, boutons d'icône), `0,75 rem` pour les surfaces (panneaux, boîte de dialogue, popover, blocs d'état), et le rond complet pour ce qui est un jeton par nature : étiquette d'étape, pastille, avatar de rail, pouce d'ascenseur, interrupteur. Les crans `xl` et `2xl` existent dans le thème mais ne sont pas utilisés par l'applicatif.

Le filet d'un pixel est la géométrie par défaut : la couche de base donne la couleur de filet à toute bordure, si bien qu'un composant n'a qu'à dire `border`. Les boutons portent une bordure transparente même quand elle ne se voit pas, pour que l'apparition d'une bordure au survol ne déplace rien.

## Components

### Buttons
- **Forme :** coins doux (`0,5 rem`), `0,75 rem` sur la grande taille. Cinq tailles : 32 px, 36 px, 40 px, et deux carrés d'icône (36 et 32 px).
- **Primaire :** violet de marque plein, encre blanche, ombre discrète, et un filet clair d'un pixel en haut (`inset-shadow`) — la profondeur de Nexa, obtenue sans dégradé visible. Au survol : violet assombri et ombre soulevée.
- **Secondaire** (variante par défaut) : surface, bordure de filet, ombre discrète ; au survol la bordure se renforce et le fond passe au canevas creusé.
- **Fantôme :** pas de fond, encre atténuée ; au survol, fond creusé et encre pleine.
- **Danger :** fond en teinte rouge et texte rouge au repos ; au survol seulement, le rouge devient plein et le texte blanc. Une action destructive s'annonce avant de crier.
- **Lien :** texte en violet lisible, souligné au survol à 4 px de décalage.
- **Transition :** 200 ms sur `--ease-out-soft`, sur la couleur et l'ombre uniquement — jamais sur la géométrie.

### Status Badge (signature)
Un jeton à coins ronds complets : fond en teinte du ton, texte dans le ton plein, une pastille de 6 px en `currentColor`, puis le mot. Les six tons sont déclarés une seule fois, dans `STATUS_CONFIG` et `TONE_CLASSES` ; `TONE_VAR` donne la même famille de couleurs aux barres et aux graphiques.

### Panneaux / Conteneurs
- **Coins :** `0,75 rem`, contenu rogné.
- **Fond :** surface, sur canevas.
- **Ombre :** discrète, et rien de plus.
- **Bordure :** un filet.
- **Rembourrage :** 1 rem dans le corps ; l'entête de panneau vaut 1 rem horizontal et 0,75 rem vertical, séparé par un filet bas.

### Inputs / Fields
- **Style :** hauteur 36 px, surface, filet, coins de contrôle, ombre discrète, texte au corps courant.
- **Survol :** la bordure passe au filet renforcé.
- **Focus :** aucun style local — l'anneau global s'en charge.
- **Invalide :** bordure rouge adoucie et fond en teinte rouge, déclenchés par `aria-invalid`.
- **Désactivé :** fond creusé, curseur interdit, opacité réduite.
- **Étiquette :** la classe d'étiquette en encre pleine, au-dessus du champ.

### Navigation
Cinq destinations en casse normale, icône de 16 px et libellé au corps courant, dans un rail sur canevas creusé. Au repos, encre atténuée ; au survol, fond de surface et encre pleine ; en cours, teinte de marque et texte violet lisible, doublés par `aria-current="page"`. Le mot-symbole s'assied en haut dans un carré violet de 28 px portant le même filet clair que le bouton primaire ; l'utilisateur courant occupe le pied, derrière un filet.

### Indicateurs (signature)
Un indicateur, c'est trois lignes : une étiquette discrète, un chiffre tabulaire au corps le plus grand avec sa ligne de contexte, et une tendance. Aucune icône décorative n'accompagne le chiffre. Les quatre indicateurs partagent un seul panneau, séparés par des gouttières d'un pixel qui laissent voir la couleur de filet.

### États vides et états d'erreur
Même silhouette : un carré de 40 px à coins de surface contenant une icône de 18 px, un titre de section, une explication bornée à 46ch, puis une action. L'état vide reste neutre ; l'état d'erreur prend un cadre et un fond en teinte rouge, porte `role="alert"` et peut afficher un détail technique en Geist Mono dans un encart de surface.

## Do's and Don'ts

### Do:
- **Do** faire passer toute couleur par un token : une classe Tailwind mappée dans `@theme inline`, ou `var(--…)` quand une bibliothèque tierce exige une valeur.
- **Do** accompagner tout état d'un mot, et toute tendance d'une flèche et d'un signe.
- **Do** mettre Geist Mono sur les dates absolues et les horodatages, et laisser « Aujourd'hui » et « Hier » en Geist.
- **Do** poser `data-slot="figure"` ou `.ui-figure` sur tout nombre qui se compare dans une colonne.
- **Do** choisir le rayon par fonction : contrôle `0,5 rem`, surface `0,75 rem`, jeton rond complet.
- **Do** monter d'un cran d'élévation seulement quand l'élément quitte le flux, et rester sur l'ombre discrète au repos.
- **Do** animer sur `--ease-out-soft` en 150 à 200 ms, sur la couleur et l'ombre.
- **Do** dessiner les icônes en SVG de trait à 16 px (jeu Lucide), toujours `aria-hidden`, le sens étant porté par le texte à côté.
- **Do** définir le contraste des deux thèmes ensemble : tout nouveau token existe dans `:root` et dans `.dark`.

### Don't:
- **Don't** écrire une couleur littérale dans un composant — ni hexadécimal, ni `oklch()` inline, hors du filet clair d'inset qui est un blanc pur par définition.
- **Don't** styler `:focus-visible` localement : l'anneau de 2 px en violet à 2 px de décalage est défini une fois dans la couche de base.
- **Don't** introduire de taille fluide : pas de `clamp()` dans l'échelle applicative.
- **Don't** utiliser l'ombre de voile hors de la couche modale, ni empiler deux ombres sur un même élément.
- **Don't** construire une page en cartes flottantes : le filet et la gouttière d'un pixel sont la structure.
- **Don't** mettre de capitales suivies dans un titre de panneau ou de page.
- **Don't** ajouter une icône décorative à côté d'un chiffre d'indicateur.
- **Don't** faire porter un état, une étape ou une tendance par la seule couleur.
- **Don't** introduire un second accent : le violet de marque est le seul, et les six tons d'état sont sémantiques, pas décoratifs.
- **Don't** redessiner l'axe neutre ou la rampe d'élévation : ils viennent de Nexa et ce lignage est un acquis, pas un point de départ.
