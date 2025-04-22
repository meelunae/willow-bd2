FROM node:20

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Copy package.json in container folder for packages installation
COPY package*.json /usr/src/app
RUN npm install
# copies source code in container folder
COPY . /usr/src/app
RUN npm rebuild bcrypt --build-from-source
EXPOSE 3000
CMD ["sh", "-c", "npm run build && npm run start"]
