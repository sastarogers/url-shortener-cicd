FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY app.js server.js ./

COPY public ./public

RUN mkdir -p /data

ENV PORT=3000
ENV DATA_DIR=/data

EXPOSE 3000

CMD ["node", "server.js"]