FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Set the production API URL
ENV REACT_APP_API_URL=https://task-manager-production-b420.up.railway.app/api/v1
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
# Railway provides the PORT environment variable
CMD ["sh", "-c", "serve -s build -l $PORT"]
