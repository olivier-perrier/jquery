
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

# Systeme

## Autorisations
Chacune des routes fait l'objet d'une autorisation. Elles sont définit au chargement de l'application.
A la demande d'une page ou resources via l'API les autorisations sont vérifiées.
Une ressources est accessible à un utilisateur en fonction de sont niveau de role.
Les différentes niveaux de roles doivent etre définit (il n'y a pas de ysteme de hierarchie des roles).
Une resources ou API peut etre déclarée comme public donc toujours accessible.

Si une route n'est pas définit alors une sous route est recherchée comme définition de l'autorisation. Ainsi il est possible de définir une autorisation commune à toutes les routes /posts et une sous route spécifique à /posts/delete

En production si une route n'est pas définit d'atorisation alors la route est refusée.
En developpement si une route n'est pas définit d'autorisation alors la route est autorisé

# Evolutions

Évolutions majeures à venir


- [ ] Organisation admin keystone
  - [ ] Apprendre plus sur le framwork keystone pour prendre des idées sur 


# Correction

# Template

Le template courant est celui utilisé dans le dossier public du serveur.
Il doit correspondre à un projet Vuejs (ou autre) faisant appel à l'API du serveur.
Il y a donc 3 perties distinctes : Le serveur, le client admin et le client visible.
Le projet du client visible est publique est doit etre amélioré par des utilisateurs.

Protocole de création d'un nouveau template :
	Pull request du projet Git du client visible
	Modification et création des vues
	Construction du fichier de build
	Upload du fichier de build sur la platfome globale
	
Protocole utilisateur d'un template
	Se connecter à son client admin et visualiser les templates
	Selectionner un template
	Possibilité de selectionner le template de base
	
Protocole systeme
	Upload sur la platfome globale correspond :
		Création d'une ligne en base de données pour le type template avec le nom
		Placement des fichiers dans un repertoires du serveur
	Selection d'un template
		Chargement des fichiers depuis la platforme globale
		Copie des fihciers dans le dossier statique du serveur


# Type de champs

- Image : pour le chargement d'image sur le serveur. Valeur sauvée : nom de l'image. Effet de bord : l'image est sauvegadé sur le serveur dans le dossier public media avec un sous dossier du nom du modele.

