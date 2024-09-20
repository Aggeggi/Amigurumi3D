# Install dependencies only when needed
FROM node:lts-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# Rebuild the source code only when needed
FROM node:lts-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG NEXT_PUBLIC_AMIGURUMI_URL
ARG NEXT_PUBLIC_AMIGURUMI_FE_URL

RUN npm run build

# Production image, copy all the files and run next
FROM node:lts-alpine AS runner
WORKDIR /app

ENV NODE_ENV production


COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 8000
ENV PORT 8000

CMD ["node", "server.js"]