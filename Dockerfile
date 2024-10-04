# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

# Deps stage
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json .
RUN npm ci --omit=dev

# Prod stage
FROM node:18-alpine AS production
WORKDIR /app
COPY package*.json .
COPY --from=build /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
CMD ["npm", "run", "start"]
