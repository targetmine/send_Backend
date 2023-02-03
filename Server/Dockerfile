# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /app

# copy configuration files to the WORKDIR
COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "./"]
# copy source directory to WORKDIR/src
COPY ["src/", "./src/"]
# install all the packages
RUN npm install
RUN npm run build
CMD ["node", "./dist/app.js"]