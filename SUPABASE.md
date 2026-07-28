# Brancher le formulaire à Supabase

Le formulaire envoie déjà ses réponses à `/api/demande`. Il ne manque que la
base de données pour les recevoir. Trois étapes.

## 1. Créer le projet

Sur [supabase.com](https://supabase.com) : **New project**, région
`ca-central-1` (Canada, la plus proche). Note le mot de passe de la base, tu
n'en auras pas besoin ici mais il ne se retrouve nulle part ailleurs.

## 2. Créer la table

Dans le projet, ouvre **SQL Editor** et colle ceci, puis **Run** :

```sql
create table demandes (
  id         bigint generated always as identity primary key,
  cree_le    timestamptz not null default now(),
  parcours   text        not null,
  prenom     text,
  entreprise text,
  courriel   text        not null,
  reponses   jsonb       not null
);

-- Personne ne lit ni n'écrit depuis le navigateur : seul le serveur du site
-- insère, avec la clé de service qui contourne ces règles.
alter table demandes enable row level security;
```

## 3. Donner les clés au site

Dans Supabase : **Project Settings → API**. Il te faut deux valeurs :

- **Project URL** (`https://xxxx.supabase.co`)
- **service_role** — la clé secrète, celle marquée `secret`. Ne la colle nulle
  part d'autre : elle contourne toutes les règles de sécurité.

Ajoute-les à deux endroits.

**En local**, dans `.env.local` à la racine du projet :

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=la_cle_service_role
```

**Sur Vercel**, dans Settings → Environment Variables : les deux mêmes,
pour Production, Preview et Development. Puis redéploie.

## Vérifier

Remplis le formulaire sur le site. La demande doit apparaître dans
**Table Editor → demandes**. Tant que les clés sont absentes, le formulaire
affiche un message d'erreur avec l'adresse courriel : aucune piste n'est
perdue entre-temps.
