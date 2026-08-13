# Étape 1 : Construction
FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

ARG CDN_URL
ARG PLAUSIBLE_URL
ARG PLAUSIBLE_DOMAIN
ARG NUXT_PUBLIC_SITE_URL

ENV CDN_URL=$CDN_URL
ENV PLAUSIBLE_URL=$PLAUSIBLE_URL
ENV PLAUSIBLE_DOMAIN=$PLAUSIBLE_DOMAIN
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL

COPY . .
RUN bun run generate


FROM nginx:alpine

ARG CDN_URL
ARG PLAUSIBLE_URL

ENV CDN_URL=${CDN_URL}
ENV PLAUSIBLE_URL=$PLAUSIBLE_URL

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY nginx/security-headers.conf.template /etc/nginx/templates/security-headers.conf.template
COPY --from=builder /app/.output/public /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
