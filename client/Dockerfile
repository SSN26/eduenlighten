# ==========================================
# EduEnlighten Frontend - Next.js Dockerfile
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Disable Next.js telemetry in Docker
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Copy package and config files
COPY package*.json tsconfig.json postcss.config.mjs next.config.ts ./

# Install dependencies
RUN npm install

# Copy source and static assets
COPY src ./src
COPY public ./public

# Build Next.js application
RUN npm run build

# ==========================================
# Production Runtime Stage
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package file
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy build output and public folder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "start"]
