FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18 AS production
WORKDIR /app
COPY --from=build /app/build /app/build
RUN npm install serve
CMD ["npx", "serve", "-s", "build", "-l", "3000"]