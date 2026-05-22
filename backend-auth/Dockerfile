FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
# Generate Prisma Client
RUN npm run prisma:generate
RUN npm prune --omit=dev
EXPOSE 5000
CMD ["node", "src/server.js"]
