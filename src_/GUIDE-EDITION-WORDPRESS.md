# 📋 Guide d'édition NoLimit Manager v8
## Où modifier quoi depuis WordPress

---

## 🏠 Page d'accueil (HomePage)

| Section | Menu WordPress | Endpoint API |
|---------|---------------|--------------|
| Carousel / Slides | **NoLimit → Hero / Carousel** | `GET /hero` |
| Badge ("L'aventure commence ici") | **NoLimit → Hero / Carousel** → Badge | `GET /hero` |
| Titre principal ("L'aventure vous appelle") | **NoLimit → Hero / Carousel** → Titre | `GET /hero` |
| Vidéo | **NoLimit → Hero / Carousel** → Vidéo | `GET /hero` |
| Grille de stats (5 parcs, 98%...) | **NoLimit → Stats & Features** | `GET /stats` |
| Features (Sécurité, Pour tous, Nature) | **NoLimit → Stats & Features** → Features | `GET /stats` |
| Section Parcs (titre, sous-titre) | **NoLimit → Page Accueil** → Section Parcs | `GET /home-config` |
| Section Activités (titre) | **NoLimit → Page Accueil** → Section Activités | `GET /home-config` |
| Section Pour Qui (titre + cartes) | **NoLimit → Pour Qui** | `GET /pour-qui` |
| Section Actualités (titre + articles) | **NoLimit → Page Accueil** + **Actualités (CPT)** | `GET /actualites` |
| Section Avis (titre) | **NoLimit → Page Accueil** → Section Avis | `GET /home-config` |
| Section Newsletter (textes, avantages) | **NoLimit → Newsletter** | `GET /newsletter` |
| Sections activées/désactivées | **NoLimit → Page Accueil** (checkboxes) | `GET /home-config` |

---

## 📄 Header & Footer

| Élément | Menu WordPress |
|---------|---------------|
| Logo | **NoLimit → Paramètres** → Header → Logo |
| Couleurs (primaire, secondaire, vert) | **NoLimit → Paramètres** → Header → Couleurs |
| Bouton CTA (texte, page) | **NoLimit → Paramètres** → Header → CTA |
| Items de menu | **NoLimit → Menu Items** (CPT) |
| Sélecteur de parcs | **NoLimit → Paramètres** → Header |
| Footer - Contact | **NoLimit → Paramètres** → Footer → Contact |
| Footer - Stats | **NoLimit → Paramètres** → Footer → Statistiques |
| Footer - Réseaux sociaux | **NoLimit → Paramètres** → Footer → Réseaux |
| Footer - Liens rapides | **NoLimit → Paramètres** → Footer → Liens Rapides |
| Footer - Liens légaux | **NoLimit → Paramètres** → Footer → Liens Légaux |
| Footer - CTA | **NoLimit → Paramètres** → Footer → CTA |

---

## 🏞️ Parcs

| Élément | Menu WordPress |
|---------|---------------|
| Liste des parcs | **NoLimit → Parcs** (CPT avec champs ACF) |
| Nom, localisation, emoji | Champs ACF sur chaque parc |
| Image, galerie | Champs ACF sur chaque parc |
| Activités, équipements | Champs ACF (virgules) |
| Prix, âge min, note | Champs ACF |
| Contact (tel, email, adresse) | Champs ACF |
| Horaires haute/basse saison | **NoLimit → Horaires des parcs** |
| Jours fermés | **NoLimit → Horaires des parcs** → Fermeture hebdo |
| Fermetures exceptionnelles | **NoLimit → Horaires des parcs** → Fermetures excep. |
| Ouvertures exceptionnelles | **NoLimit → Horaires des parcs** → Ouvertures excep. |
| Services sur site (parking, snack...) | **NoLimit → Config Globale** → Services sur site |
| Accessibilité (PMR, etc.) | **NoLimit → Config Globale** → Accessibilité |
| Réseaux sociaux par parc | **NoLimit → Config Globale** → Réseaux sociaux |

---

## 🎯 Activités

| Élément | Menu WordPress |
|---------|---------------|
| Liste des activités | **NoLimit → Activités** (CPT) |
| Nom, emoji, slug | Champs ACF |
| Image, durée, âge min | Champs ACF |
| Participants, intensité | Champs ACF |
| Niveaux de difficulté (labels, couleurs) | **NoLimit → Config Globale** → Niveaux de difficulté |
| Types de publics | **NoLimit → Config Globale** → Types de publics |
| Filtres d'activités | **NoLimit → Config Globale** → Filtres d'activités |

---

## 👥 Pages "Pour Qui"

| Page | Menu WordPress | Endpoint API |
|------|---------------|--------------|
| Hub (4 cartes) | **NoLimit → Pour Qui** | `GET /pour-qui` |
| Page Duo | Options WP `nl_pq_duo_*` | `GET /pour-qui/duo` |
| Page Enfant | Options WP `nl_pq_enfant_*` | `GET /pour-qui/enfant` |
| Page Entreprise | Options WP `nl_pq_entreprise_*` | `GET /pour-qui/entreprise` |
| Page Famille | Options WP `nl_pq_famille_*` | `GET /pour-qui/famille` |

> Les données des sous-pages (activités, moments, témoignages, sécurité, packs, etc.)
> sont stockées en JSON dans les options WordPress. Modifiables depuis la base WP
> ou via un éditeur JSON dans une future vue admin.

---

## 👥 Pages Groupes

| Page | Menu WordPress | Endpoint API |
|------|---------------|--------------|
| Hub Groupes | **NoLimit → Page Groupes** | `GET /groups` |
| Entreprises / Corporate | Options WP `nl_grp_corp_*` | `GET /groups/corporate` |
| Enfants / Ados | Options WP `nl_grp_kids_*` | `GET /groups/kids` |
| Adultes / Fêtes | Options WP `nl_grp_adults_*` | `GET /groups/adults` |
| Familles | Options WP `nl_grp_family_*` | `GET /groups/family` |
| Types de groupes (corporate, kids...) | **NoLimit → Page Groupes** → Types | `GET /groups` |
| Avantages | **NoLimit → Page Groupes** → Avantages | `GET /groups` |
| CTA devis | **NoLimit → Page Groupes** → CTA | `GET /groups` |
| CSE section | **NoLimit → Page Groupes** → CSE | `GET /groups` |

---

## 📖 Pages À Propos

| Page | Menu WordPress | Endpoint API |
|------|---------------|--------------|
| Hub À Propos | **NoLimit → À Propos** → Page Principale | `GET /about` |
| Notre Histoire (timeline) | **NoLimit → À Propos** → Histoire | `GET /about/history` |
| Nos Valeurs (values, manifesto) | **NoLimit → À Propos** → Valeurs | `GET /about/values` |
| Nos Emplois (perks, postes) | **NoLimit → À Propos** → Emplois | `GET /about/jobs` |
| Partenaires & RSE | **NoLimit → À Propos** → Partenaires | `GET /about/partners` |

> Toutes les données (timeline, valeurs, manifesto, perks, positions, partenaires, RSE)
> sont en JSON dans les champs textarea de la page admin. Utilisez le format JSON indiqué.

---

## ❓ FAQ

| Élément | Menu WordPress |
|---------|---------------|
| Questions/Réponses | **NoLimit → FAQ** (CPT) |
| Catégories FAQ | **NoLimit → FAQ Config** → Catégories |
| Titre / Sous-titre page | **NoLimit → FAQ Config** |
| Catégorie par question | Champ ACF sur chaque FAQ |

---

## 📰 Actualités

| Élément | Menu WordPress |
|---------|---------------|
| Articles d'actualité | **NoLimit → Actualités** (CPT) |
| À la une (flag) | Champ ACF "À la une" |
| Est un événement | Champ ACF "Est un événement" |
| Lien d'inscription événement | Champ ACF conditionnel |
| Catégorie affichée | Champ ACF texte libre |

---

## 📝 Blog / Conseils

| Élément | Menu WordPress |
|---------|---------------|
| Articles de blog | **NoLimit → Blog** (CPT) |
| Catégories blog | Taxonomie "Catégories Blog" |
| Titre / Sous-titre page | **NoLimit → Blog Config** |
| Sous-titre, temps de lecture, auteur | Champs ACF |
| Tags, niveau, vues | Champs ACF |
| Parc associé | Champ ACF (relation post_object) |

---

## ⭐ Avis

| Élément | Menu WordPress |
|---------|---------------|
| Avis clients | **NoLimit → Avis** (CPT) |
| Note, auteur, date | Champs ACF |
| Parc associé | Champ ACF (relation post_object) |
| Avatar | Champ ACF image |

---

## ✉️ Newsletter

| Élément | Menu WordPress |
|---------|---------------|
| Titre, sous-titre, textes | **NoLimit → Newsletter** |
| Avantages (3 cartes) | **NoLimit → Newsletter** → Avantages |
| Brevo API (clé, liste) | **NoLimit → Newsletter** → Brevo |

---

## 📞 Contact

| Élément | Menu WordPress |
|---------|---------------|
| Titre, sous-titre | **NoLimit → Contact** |
| Adresse, horaires | **NoLimit → Contact** |
| Google Maps URL | **NoLimit → Contact** |
| Sujets du formulaire | **NoLimit → Contact** → Sujets |
| Message de succès | **NoLimit → Contact** |
| Email réception | **NoLimit → Paramètres** → Footer → Email |

---

## 🎫 Réservation

| Élément | Menu WordPress |
|---------|---------------|
| Titre, sous-titre | **NoLimit → Réservation** |
| URL Quickle | **NoLimit → Réservation** → Quickle |
| Créneaux horaires | **NoLimit → Réservation** → Créneaux (JSON) |
| Min/Max participants | **NoLimit → Réservation** |
| Activé/Désactivé | **NoLimit → Réservation** |

---

## ⚙️ Configuration Globale

| Élément | Menu WordPress |
|---------|---------------|
| Réseaux sociaux (TikTok, LinkedIn) | **NoLimit → Config Globale** |
| Menu d'ancrage homepage | **NoLimit → Config Globale** → Menu ancrage (JSON) |
| Filtres d'activités | **NoLimit → Config Globale** → Filtres (JSON) |
| Accessibilité | **NoLimit → Config Globale** → Accessibilité (JSON) |
| Services sur site | **NoLimit → Config Globale** → Services (JSON) |
| Types de tarifs | **NoLimit → Config Globale** → Tarifs (JSON) |
| Transports | **NoLimit → Config Globale** → Transports (JSON) |
| Niveaux de difficulté | **NoLimit → Config Globale** → Difficulté (JSON) |
| Types de publics | **NoLimit → Config Globale** → Publics (JSON) |

---

## 🔌 Tous les endpoints API

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/nolimit/v1/header` | GET | Header complet |
| `/nolimit/v1/footer` | GET | Footer complet |
| `/nolimit/v1/home` | GET | Page accueil |
| `/nolimit/v1/home-config` | GET | Config sections accueil |
| `/nolimit/v1/hero` | GET | Carousel + badge + titre |
| `/nolimit/v1/stats` | GET | Stats + features |
| `/nolimit/v1/pour-qui` | GET | Hub Pour Qui |
| `/nolimit/v1/pour-qui/duo` | GET | Page Duo |
| `/nolimit/v1/pour-qui/enfant` | GET | Page Enfant |
| `/nolimit/v1/pour-qui/entreprise` | GET | Page Entreprise |
| `/nolimit/v1/pour-qui/famille` | GET | Page Famille |
| `/nolimit/v1/newsletter` | GET | Config newsletter |
| `/nolimit/v1/newsletter/subscribe` | POST | Inscription |
| `/nolimit/v1/actualites` | GET | Actualités homepage |
| `/nolimit/v1/parks` | GET | Liste parcs |
| `/nolimit/v1/parks/{id}` | GET | Détail parc |
| `/nolimit/v1/activities` | GET | Liste activités |
| `/nolimit/v1/activities/{id}` | GET | Détail activité |
| `/nolimit/v1/faqs` | GET | FAQ + catégories |
| `/nolimit/v1/reviews` | GET | Avis clients |
| `/nolimit/v1/news` | GET | Liste actualités |
| `/nolimit/v1/news/{slug}` | GET | Détail actualité |
| `/nolimit/v1/groups` | GET | Hub groupes |
| `/nolimit/v1/groups/corporate` | GET | Page entreprises |
| `/nolimit/v1/groups/kids` | GET | Page enfants |
| `/nolimit/v1/groups/adults` | GET | Page adultes |
| `/nolimit/v1/groups/family` | GET | Page familles |
| `/nolimit/v1/about` | GET | Hub à propos |
| `/nolimit/v1/about/history` | GET | Histoire |
| `/nolimit/v1/about/values` | GET | Valeurs |
| `/nolimit/v1/about/jobs` | GET | Emplois |
| `/nolimit/v1/about/partners` | GET | Partenaires |
| `/nolimit/v1/blog` | GET | Liste blog |
| `/nolimit/v1/blog/{slug}` | GET | Article blog |
| `/nolimit/v1/booking/config` | GET | Config réservation |
| `/nolimit/v1/contact` | GET | Config contact |
| `/nolimit/v1/contact` | POST | Envoi formulaire |
| `/nolimit/v1/horaires` | GET | Tous les horaires |
| `/nolimit/v1/horaires/{slug}` | GET | Horaires d'un parc |
| `/nolimit/v1/site-config` | GET | Config globale |
| `/nolimit/v1/site-config/park/{slug}` | GET | Config parc |
| `/nolimit/v1/pages/{slug}` | GET | Page personnalisée |
