FROM node:18.13.0

ENV PORT=80
ENV JWT=jwt__ksjs2jrjwer

WORKDIR /usr/src/app

COPY ./dist/ .

COPY ./package.json .

RUN npm install

ENV TZ America/Santiago

CMD [ "node", "index.js" ]
