# Multi-stage build for Next.js optimization
FROM node:lts-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with optimizations
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force

# Install dev dependencies in separate layer for building
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies for build
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Set Next.js to produce standalone output + disable telemetry
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create nextjs user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Set correct ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]