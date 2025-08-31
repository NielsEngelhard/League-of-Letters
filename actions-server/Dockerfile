# Use multi-stage build for smaller final image
FROM node:lts-alpine AS dependencies

WORKDIR /app

# Copy only package files first (better caching)
COPY package*.json ./

# Install all dependencies (including devDependencies for potential build steps)
RUN npm ci --ignore-scripts

# Production stage
FROM node:lts-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts && \
    npm cache clean --force && \
    rm -rf ~/.npm

# Copy application code
COPY . .

# Remove unnecessary files
RUN rm -rf \
    node_modules/.cache \
    package-lock.json \
    .git \
    .gitignore \
    README.md \
    Dockerfile* \
    .dockerignore \
    *.md

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

EXPOSE 8000

CMD ["node", "server.js"]