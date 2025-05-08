FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
    nodejs \
    npm \
    yarn

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

USER node

EXPOSE 8001

CMD ["npm", "run", "start"]