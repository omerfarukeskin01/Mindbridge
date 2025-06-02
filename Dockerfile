# Use official Node.js runtime as base image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S mindbridge -u 1001

# Copy application code
COPY --chown=mindbridge:nodejs . .

# Create uploads directory
RUN mkdir -p public/uploads && chown -R mindbridge:nodejs public/uploads

# Switch to non-root user
USER mindbridge

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["npm", "start"] 