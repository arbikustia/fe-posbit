# Use a Node.js Alpine image for the builder stage
FROM node:22-alpine AS builder
WORKDIR /app
# RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.shrc" SHELL="$(which sh)" sh -
COPY package*.json ./
RUN corepack enable
RUN corepack prepare pnpm@10.10 --activate
RUN pnpm install
RUN npm update
RUN npm ci
COPY . .
ENV NODE_OPTIONS="--max_old_space_size=4096"
# RUN node --max-old-space-size=4096 `which npm` run build
RUN npm run build
# RUN npm prune --production
# RUN pwd
# RUN ls -la

# Use another Node.js Alpine image for the final stage
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]
