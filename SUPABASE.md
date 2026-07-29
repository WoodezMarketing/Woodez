# Le formulaire et sa base de données

Les demandes envoyées par le formulaire sont enregistrées dans Supabase.

## Ce qui est déjà en place

- **Projet** : « Woodez Website », région `ca-central-1`
  (réf. `pyvpahtysfandswhyppf`)
- **Table** `demandes` : `id`, `cree_le`, `parcours`, `prenom`, `entreprise`,
  `courriel`, `reponses` (le détail complet des réponses, en JSON)
- La sécurité au niveau des lignes est activée et aucune règle n'ouvre l'accès :
  personne ne peut lire ni écrire depuis un navigateur. Seul le serveur du site
  insère, avec la clé de service.
- Les clés sont dans `.env.local`, qui n'est jamais versionné.

Pour consulter les demandes : Supabase → **Table Editor → demandes**.

Les deux variables `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont posées
sur Vercel pour Production, Preview et Development. L'enregistrement est
vérifié en ligne.

## Si tu changes la clé

Elle vit à deux endroits, et il faut la mettre à jour aux deux :

- `.env.local` à la racine du projet, pour le développement
- Vercel → **Settings → Environment Variables**, puis redéployer : les
  variables ne s'appliquent qu'au déploiement suivant

## Si l'envoi échoue

Le formulaire affiche un message avec l'adresse courriel plutôt que de perdre
la demande en silence. La cause est presque toujours une variable
d'environnement absente ou mal copiée.
