# ==========================================
# EduEnlighten Monorepo - Server Container
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root & workspace manifests
COPY package.json package-lock.json* ./
COPY server/package.json ./server/
COPY server/tsconfig.json ./server/

# Install dependencies for server workspace
RUN npm ci --workspace=server --include=dev

# Copy server code
COPY server/src ./server/src

# Compile backend
RUN npm run build --workspace=server

# ==========================================
# Production Runtime Stage
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

COPY package.json package-lock.json* ./
COPY server/package.json ./server/

RUN npm ci --workspace=server --omit=dev && npm cache clean --force

COPY --from=builder /app/server/dist ./server/dist
RUN mkdir -p server/uploads

EXPOSE 5001

CMD ["node", "server/dist/server.js"]
