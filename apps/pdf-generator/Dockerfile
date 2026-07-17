FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml nx.json ./
RUN npm install -g pnpm@10.19.0
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm nx run pdf-generator:build

FROM --platform=linux/amd64 node:20-slim

WORKDIR /app

RUN npm install -g pnpm@10.19.0

COPY --from=builder /app/dist/apps/pdf-generator ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile --ignore-scripts
RUN apt-get update && apt-get install -y ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc-s1 libgdk-pixbuf-2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxshmfence1 libxss1 libxtst6 wget xdg-utils --no-install-recommends && rm -rf /var/lib/apt/lists/*
RUN pnpm exec puppeteer browsers install chrome

CMD ["node", "main.js"]

# Note: 
# 1. docker build -f apps/pdf-generator/Dockerfile -t pdf-generator:local .
