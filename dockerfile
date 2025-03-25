# Build Stage
FROM node:20-alpine AS build
WORKDIR /app

# Check if using npm or pnpm and enable accordingly
COPY package.json ./
COPY package-lock.json* pnpm-lock.yaml* ./
RUN if [ -f "pnpm-lock.yaml" ]; then \
        npm install -g pnpm && \
        pnpm install; \
    else \
        npm ci; \
    fi

# Copy the rest of the application
COPY . .

# Build the Nuxt application
RUN if [ -f "pnpm-lock.yaml" ]; then \
        pnpm run build; \
    else \
        npm run build; \
    fi

# Production Stage
FROM node:20-alpine
WORKDIR /app

# Copy only the build output from the build stage
COPY --from=build /app/.output ./.output

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=80
ENV NODE_ENV=production

# Expose the port
EXPOSE 80

# Start the application
CMD ["node", ".output/server/index.mjs"]