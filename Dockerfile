FROM mhart/alpine-node:6

RUN npm i kubernetes-client --save

WORKDIR /app
COPY . /app
EXPOSE 3000
CMD ["node", "/app/server.js"]
