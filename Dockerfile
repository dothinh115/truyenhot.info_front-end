FROM node:18-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN cd /app &&  npm install 

COPY next.config.js ./next.config.js

COPY pages ./pages

COPY public ./public


COPY . .

RUN cd /app &&  npm run build 
CMD [ "yarn", "start" ]
EXPOSE 3000