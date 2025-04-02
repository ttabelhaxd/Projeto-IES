FROM node:23.1 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g serve

COPY . .

RUN npm run build

EXPOSE 3000

# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
CMD ["serve", "-s", "dist"]
