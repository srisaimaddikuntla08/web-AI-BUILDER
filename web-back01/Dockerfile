# Build stage
FROM oven/bun:alpine

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lock for dependency installation
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["bun", "run", "src/server.ts"]
