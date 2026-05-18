FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
# Generate Prisma Client
RUN npx prisma generate
EXPOSE 5000
CMD ["node", "src/server.js"]
