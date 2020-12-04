FROM node:15.0.1-alpine3.10

WORKDIR /usr/climatelocator/api  

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm",  "start"]
