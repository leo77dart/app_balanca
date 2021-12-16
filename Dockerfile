FROM node
WORKDIR /app
COPY . /app
RUN npm install nodemon -g && npm install
