
# Présentation

OP CMS est un site web orienté CMS avec des fonctionnalités spécifiques apportant de nombreux avantages.

* Nodejs technologie pour la rapidité, technologie actuelle et multi thread
* Nedb pour la légereté et la symplification du déploiement

* express et dérivés pour la simification de fonctionnalités coté serveur

* handlebars pour la simplicité de la syntaxe, fonctionnalités poussées et la communauté
* Vuejs pour des fonctionnalités plus poussées et avec plus d'avenir (migration vuejs potentielle à l'avenir)

# Fonctionnalités

## Posts

Les posts au sens large permettent la gestion d'un grand nombre de données

Les Posts sont 
* post
* page
* menu
* media

Les différents objets gérés par les posts sont identifiés pour le type de post > postType

### post

- Permet la création de multiples post de contenu, article, produit, etc

- title : titre global
- name : nom metier
- content : contenu sous forme de text enrichi
- description : description rapide
- postType = post : définition du post
- category : definie une categorie (livre, voyage, cuisine, etc) (sera evolué en une collection)
- tags[] : tags liés au contenu du post (itali, poulet, bleu, etc) (mots plus géneraux que la category) 
- format : format du post (audio, video, text, link, default...)
- createdAt : date de création
- updatedAt : date de la derniére mise à jour

### page

- Permet la création d'une page pour un contenu unique ou une page de présentation

Cf post
- postType = page

### menu

- Permet la création d'un menu pour la navigation du site. Un menu constitue une entrée du menu général du site.

Cf post
- title : titre affiché du menu
- content : contenu du lien vers le menu (url, nom de post ou page, nom de categorie) (les noms de post ou page chanegrons pour les id)
- postType = menu
- format : type de lien vers post, page, categorie (post, posts, page, direct) (à changer posts par categorie)
 - post : lien vers un post
  - posts : lien vers une liste de posts d'une cathegorie spécifique
  - page : lien ver une page
  - link : lien direct vers une URL


### media

- Permet la création d'un media (pour l'instant uniquement des images)

Cf post
- title : titre de l'image pouvant servire comme caption
- name : nom du fichier
- postType = media


## Utilisateurs

- Permet la création d'tulisateurs du site. Il existe plusieurs niveaux pour différentes actions

- Niveaux d'utilisateur (pas encore disponible) : 
  - admin : accés complet au site (interface et adminitration)
  - editor : ...
  - author : utilisateur pouvant écrir des post (accès adminstrateur)
  - contributor : utilisateur pouvant écrir des commentaires (accés unique interface)
  - subscriber : utilisateur uniquement enregistré. Ne peut faire aucune action

## Commentaires
- Pas encore disponible

## Settings
- Liste d'options disponibles pour le site en général
  - Title du site
  - Sous titre
  - icon du site
  - ...

## Widgets


# Evolutions

Évolutions majeures à venir

- [x] Utilisation des types de post (post, page, menu, media)
- [x] Gestion des menus
- [x] Gestion des pages

- [ ] Gestion des médias (en cours)
- [ ] Gestion de commentaires
- [ ] Gestion des utilisateurs (en cours)

- [ ] Gestion des Widgets (en cours)

# Correction

Corrections à faire

- Réorganisation des API et routes
- Réorganisation des modèles et base de données

- Amélioration de l'interface