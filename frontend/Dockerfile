# frontend/Dockerfile
# Użyj oficjalnego obrazu Node.js jako bazowego
FROM node:23.4.0-alpine

# Ustaw katalog roboczy w kontenerze
WORKDIR /app

# Skopiuj pliki package.json i package-lock.json do katalogu roboczego
COPY package.json package-lock.json ./

# Zainstaluj zależności
RUN npm install

# Skopiuj resztę plików aplikacji do katalogu roboczego
COPY . .

#RUN npm run build

# Ustaw zmienną środowiskową dla Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Uruchom aplikację w trybie deweloperskim
CMD ["npm", "run", "dev"]