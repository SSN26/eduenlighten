# ==========================================
# EduEnlighten Backend - Production Dockerfile
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json tsconfig.json ./

# Install all dependencies including devDependencies for build
RUN npm install

# Copy source code
COPY src ./src

# Compile TypeScript to dist/
RUN npm run build

# ==========================================
# Production Runtime Stage
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

# Copy package manifest
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5001

CMD ["node", "dist/server.js"]
