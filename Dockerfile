FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN cd /app &&  npm install --legacy-peer-deps

COPY next.config.js ./next.config.js

COPY . .

RUN cd /app &&  npm run build && npm prune --production
CMD [ "npm", "start" ]
EXPOSE 3000