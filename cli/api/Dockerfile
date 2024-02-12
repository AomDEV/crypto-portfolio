# ================= #
# Build image
# ================= #

FROM node:18-alpine as builder

# Create app directory
WORKDIR /usr/src/app

# Install OpenSSL
RUN apk update && apk upgrade openssl

# Copy package manager lock files
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# Copy prisma schema files
COPY prisma/schema ./prisma/schema

# Install dependencies based on the preferred package manager
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Generate all of prisma schema files
RUN yarn prisma:generate

# Copy all source-code
COPY . .

# Build an app
RUN yarn build

# ================= #
# Production image
# ================= #
FROM node:18-alpine

ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /usr/src/app

# Copy all the files from builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Run an app
CMD [ "node", "dist/src/main.js" ]