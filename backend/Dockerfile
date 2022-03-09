FROM node:lts

WORKDIR /usr/src/app

COPY package.json .
COPY src src

RUN npm install
RUN npm run build

EXPOSE 3100

CMD ["npm", "run", "prod"]
