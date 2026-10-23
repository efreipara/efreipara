# Étape 1 : Construction
FROM oven/bun:1.4-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

ARG CDN_URL
ARG PLAUSIBLE_URL
ARG PLAUSIBLE_DOMAIN

ENV CDN_URL=$CDN_URL
ENV PLAUSIBLE_URL=$PLAUSIBLE_URL
ENV PLAUSIBLE_DOMAIN=$PLAUSIBLE_DOMAIN

COPY . .
RUN bun run generate


# Étape 2 : Service - image non-root
FROM nginxinc/nginx-unprivileged:alpine-slim

ARG CDN_URL
ARG PLAUSIBLE_URL

ENV CDN_URL=${CDN_URL}
ENV PLAUSIBLE_URL=$PLAUSIBLE_URL

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY nginx/security-headers.conf.template /etc/nginx/templates/security-headers.conf.template
COPY --from=builder /app/.output/public /usr/share/nginx/html

USER 101

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
