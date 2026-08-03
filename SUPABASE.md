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

## La notification par courriel

À chaque demande, le serveur envoie un courriel récapitulatif à `info@woodez.ca`,
mis en page aux couleurs de la marque, avec un bouton **Répondre** qui écrit
directement au visiteur. L'enregistrement en base fait foi : si le courriel
échoue, la demande est quand même sauvée et le visiteur voit un succès.

L'envoi passe par [Resend](https://resend.com) et est déjà en place, en local
comme sur Vercel. Trois variables le pilotent :

```
RESEND_API_KEY
COURRIEL_DESTINATAIRE=info@woodez.ca
COURRIEL_EXPEDITEUR=Woodez <notifications@tryswind.com>
```

Sans `RESEND_API_KEY`, l'envoi est simplement sauté — rien ne casse.

### Pourquoi l'expéditeur est sur tryswind.com

Le forfait gratuit de Resend n'autorise qu'un seul domaine vérifié, et il est
déjà pris. Ça ne pose pas de problème : ce courriel est une notification
interne, envoyée à `info@woodez.ca`, et le bouton **Répondre** écrit
directement au visiteur. Le domaine de l'expéditeur ne sert qu'à prouver au
serveur de réception que le message est légitime.

Le jour où le site enverra de vrais courriels aux clients — un accusé de
réception, par exemple — il faudra vérifier `woodez.ca` chez Resend, ce qui
demande le forfait payant ou de libérer le domaine actuel.
