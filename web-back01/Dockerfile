# Build stage
FROM oven/bun:alpine AS build
ENV DATABASE_URL=""

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lock for dependency installation
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN bun run prisma:generate

# Build the application using Bun
RUN bun build --outfile=server.js --outdir=dist ./src/server.ts --target=bun

# Runtime stage
FROM oven/bun:alpine AS runtime

# Set the working directory
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["bun", "run", "dist/server.js"]