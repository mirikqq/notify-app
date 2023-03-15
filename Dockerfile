FROM node

WORKDIR /notify

COPY package*.json ./

RUN yarn install
RUN apt-get update
RUN apt-get install -y libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev libasound-dev

COPY . .

EXPOSE 5173

CMD ["yarn", "dev"]