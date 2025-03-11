FROM node:alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

CMd ["npm", "start"]