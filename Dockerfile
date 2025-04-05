# Build stage
FROM node:22-alpine as builder

# Install pnpm globally
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN pnpm install --frozen-lockfile

# Copy app source
COPY . .

# Build the app
RUN pnpm run build

# Production stage
FROM node:22-alpine

# Install pnpm globally
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
