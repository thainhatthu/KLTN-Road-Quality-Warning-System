FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm config set cache /tmp/.npm --global

RUN npm install
RUN npm install @tanstack/react-query

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]
