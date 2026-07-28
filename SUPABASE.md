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

## Ce qu'il reste à faire

Les clés existent en local mais pas encore sur Vercel, donc le formulaire
enregistre en développement et échoue en ligne. Dans Vercel :

**Settings → Environment Variables**, ajouter pour Production, Preview et
Development :

```
SUPABASE_URL=https://pyvpahtysfandswhyppf.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<la clé service_role>
```

La clé se trouve dans Supabase → **Project Settings → API → service_role**.
Puis redéployer.

## Si l'envoi échoue

Le formulaire affiche un message avec l'adresse courriel plutôt que de perdre
la demande en silence. La cause est presque toujours une variable
d'environnement absente ou mal copiée.
