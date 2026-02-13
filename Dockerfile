FROM node:22-alpine

WORKDIR /home/node/app

COPY package*.json ./

RUN npm ci
RUN npm install

COPY . .

RUN chown -R node:node /home/node/app

USER node

EXPOSE 5173

CMD ["npm", "run", "dev"]