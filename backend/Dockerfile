# Stage 1: Build TypeScript backend
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production runtime environment
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# Create persistent data directory for SQLite database
RUN mkdir -p /app/data

EXPOSE 5000

CMD ["node", "dist/server.js"]
