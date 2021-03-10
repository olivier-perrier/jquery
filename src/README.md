# hello-world

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# Application

Chemin d'accès au client /
Chemin d'accès à l'administration /admin

Le type paramétré
    Un type dans le menu administration
    Permet de créer des types avec un nom et de proprietes
    Les propriétés sont text json de paramétrage
    Structure des propriétés :
        une liste d'attributs
        name : définit le nom de l'attribut
        type : type de l'atribut (String, Checkbox, Textarea...
        hideTab : cacher l'attribut du tableau de posts
        options : pour les attributs Select
        disabled : desactiver la saisie d'une nouvelle valeur
        ...
    Les types paramétrés apparaissent dans la barre de menu d'administration
    Il est possible de créer, supprimer et modifier des types paramétrés
    Renomer un type paramétré nécessite une modification du nom de la table du type paramétré (à amaliorer)
    Il existe une base de données pour chaque type paramétré

    Pour chaque types paramétré il est possible de lui créer des posts selon le schéma que le type paramétré définit
    Un type paramétré peut créer, supprimer, modifier un post

    Types paramétrés de base :
        Posts
        Pages
        Menus
        Users
        Settings

        Templates
        Widgets

    Les types de champs disponible sont (FieldType):
        Checkbox
        Date
        Password
        Relationship
        Select
        String
        Textarea

    Les attributs possible sont :
        name : String
        type : (FieldType)
        hideTab : boolean
        options : []
        disabled : boolean
        postType : String (pour le type Relationship)
        postField : String (pour le type Relationship)

# Web services

* Un onglet web services
Un web service sera entrant ou sortant

## Entrant : appel de web services

Un web servce aura : un nom, un type (post, get), une adresse (à ajouter à celle de l'api), une fonction prenant en paramètre la requete (req) et le résultat (res) et qui envoie le résultat  

## Sortant : mise à disposition de web services

Un web service sortant est une request. Elle porte un nom, un type (get, post), une adresse, une fonction et un trigger
Un trigger peut être :
    Un interval de temps dans lequel le requete sera éxecutée
    (La création d'un post) 


# Evolutions

    Fix relationship : sauvegarder uniquement l'ID (solution propre) mais trouver une solution pour dans les menus et dans l'affichage des posts (pour l'auteur par exemple)
    Menus
        L'ihm doit demander la query, la sort, la limit etc
    Query de selection, de sort et de limit dans les requetes -> à améliorer
    Widgets
        Une collection de widgets de bases qui seront classés et augmentés quotidiennement

    Framework front end pour les utilisateurs de création de themes. Par exemples il font appels à getSetting() ou get Post()...

    Web services -> à améliorer

# Evolutions majeurs

    Base de données

    Template client -> En cours
        Selection de template -> ok
        Upload de template
        Administration des templates
    
    Vérification des types de champs

    Faire documentation

# Evolutions mineurs

    Champ paramétré Json
        Check automatique de l'objet settings pour éviter les erreurs
    Cast des types 
    Organisation API
    Organisation template frontend
    Signup

    Gestion des logs serveur

    Chargement dynamique des données à d'autres moment pour meilleur fluidité

    Moteur de requete pour le frontend (plutot que des requetes axios à chaque fois)

    Ajouter des widgets

    Visualisation d'un post (à voir si important)

## Petites améliorations

# Fonctionnalités majeures

## Types paramétrés

### Fiels disponibles

String
Textarea
Select
Relationship
...
TODO : json, checkbox

## Templates

### Widgets



## Web services

## Base de données

BUG  (à traiter plus tard)

    Il est necessaire de redemarer l'api pour l'utilisation d'une nouveau type paramétré. A la création d'un type paramétré il faut créer aussi sa base de données
