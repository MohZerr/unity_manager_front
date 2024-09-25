# Étape 1 : Build de l'application avec Node.js 18.16
FROM node:18.16-alpine AS build

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances (package.json et package-lock.json)
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier le reste du code source de l'application dans le conteneur
COPY . .

# Ajouter les arguments pour passer les variables d'environnement au moment du build
ARG VITE_ENV
ARG VITE_DEV_URL
ARG VITE_PROD_URL

# Exporter les variables comme des variables d'environnement pour Vite
ENV VITE_ENV=$VITE_ENV
ENV VITE_DEV_URL=$VITE_DEV_URL
ENV VITE_PROD_URL=$VITE_PROD_URL

# Construire l'application pour la production
RUN npm run build

# Étape 2 : Servir l'application avec Nginx
FROM nginx:alpine

# Copier les fichiers de build générés dans le répertoire de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration Nginx personnalisée (sans SSL)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80 (HTTP seulement)
EXPOSE 80

# Démarrer Nginx en mode non-détaché
CMD ["nginx", "-g", "daemon off;"]
