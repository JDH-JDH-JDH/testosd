Ce dossier contient la version autonome du site de l’Orchestre Symphonique des Dômes.

Pour l’ouvrir sur l’ordinateur, ouvrir index.html. Les 84 pages comprennent la page de recherche. Les pages, styles, scripts, polices, documents et fichiers audio nécessaires sont inclus dans ce dossier. Les vidéos restent sur YouTube ; les liens vers la billetterie et les artistes sont conservés. Les icônes des réseaux sociaux et leurs liens ont été supprimés de toutes les pages. La carte de contact utilise Google Maps.

Le formulaire de contact prépare un e-mail dans la messagerie du visiteur, à destination de osdomes.contact@gmail.com. Aucun serveur de l’ancien site n’est utilisé. Le destinataire peut être modifié dans contact-config.js. Le bouton n’affiche pas de confirmation d’envoi : le visiteur doit envoyer son message dans sa messagerie.

Pour publier sur GitHub Pages :

1. Créer un dépôt public pour l’essai, par exemple `osd`, sur le compte GitHub choisi. Importer le contenu de ce dossier sur la branche `main`, y compris `.github`, `tools` et `.nojekyll`. Utiliser Git ou GitHub Desktop pour transférer les fichiers audio volumineux ; ne pas importer `_site`, les sauvegardes ni les dossiers temporaires.
2. Dans les paramètres du dépôt, ouvrir **Pages**, puis choisir **GitHub Actions** comme source. Dans l’onglet **Actions**, lancer **Publier le site OSD** si nécessaire. Les prochaines modifications envoyées sur `main` seront publiées automatiquement.
3. Après publication, ouvrir l’adresse affichée dans Pages, généralement `https://COMPTE.github.io/osd/`, et vérifier l’accueil, Concerts, Médias, Recherche et Contact. Aucun changement du domaine actuel n’est nécessaire pour cet essai.
4. Le nom de domaine personnalisé pourra être configuré après validation du nouveau site.

Les chemins relatifs permettent une publication à la racine d’un domaine ou dans le sous-dossier d’un projet GitHub Pages. Le workflow prépare une copie dans `_site` avec les adresses canoniques, les données structurées OSD, `sitemap.xml` et `robots.txt`, en utilisant l’adresse réelle fournie par GitHub Pages. Il ne modifie pas les pages sources. Aucune dépendance applicative à installer.

Pour vérifier la préparation localement, lancer `powershell -NoProfile -ExecutionPolicy Bypass -File tools/prepare-pages.ps1 -BaseUrl https://COMPTE.github.io/osd/` en remplaçant l’adresse par celle du site. Le script exige que `_site` n’existe pas déjà et contrôle la taille avant copie.

Pour le référencement : le sigle OSD est associé au nom complet dans le titre, le texte et les données structurées de l’accueil. Une fois le site publié, ajouter son adresse exacte comme propriété de préfixe d’URL dans Google Search Console, effectuer la vérification demandée par Google, puis soumettre `sitemap.xml`. La page de recherche interne est marquée `noindex`. L’essai est indexable ; sa présence et sa position dans Google ne sont ni immédiates ni garanties. Le nom de site personnalisé dans Google n’est pas pris en charge pour les sous-dossiers ; il faudra réexaminer ce point au choix du domaine définitif.

Le site pèse environ 995 Mio, essentiellement à cause des 40 enregistrements. Leur contenu sonore a été conservé. La marge avant 1 Gio est d’environ 29 Mio ; tenir compte de cette marge lors de futurs ajouts.

Documentation : [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [limites de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), [seuil utilisé par l’action de déploiement](https://github.com/actions/deploy-pages/blob/main/src/internal/deployment.js).

Le dépôt utilisé pour l’essai est `JDH-JDH-JDH/testosd`, dans le dossier local `C:\SiteInternet\testosd`. L’état de la publication et son adresse sont consultables dans les onglets Actions et Settings > Pages du dépôt. Les modifications préparées dans `OSD-autonome` doivent être reportées dans `testosd` avant leur envoi sur GitHub.
