FROM node:14 as build-stage

WORKDIR /usr/src/app
COPY package.json package.json
COPY src src
RUN npm install
RUN npm run build


FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*.*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /usr/src/app/production /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
