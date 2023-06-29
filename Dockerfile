# Stage 1: install dependencies
FROM node:17-alpine AS deps
WORKDIR /app
COPY package*.json .
ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
RUN npm install

# Stage 2: build & run
FROM node:17-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]