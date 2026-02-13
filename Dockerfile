FROM node:22-alpine

WORKDIR /home/node/app

COPY package*.json ./

COPY . .

RUN chown -R node:node /home/node/app

RUN npm install -g pm2 tsx watch
RUN npm install --workspaces --include=dev

USER node

EXPOSE 5173

CMD ["pm2", "start", "ecosystem.config.js"]