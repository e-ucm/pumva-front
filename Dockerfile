FROM node:24-alpine

WORKDIR /home/node/app

COPY package*.json ./

COPY . .

RUN chown -R node:node /home/node/app

RUN npm install -g tsx watch
RUN npm install --workspaces --include=dev

USER node

EXPOSE 5173

CMD ["tsx", "apps/bff/src/server.ts"]