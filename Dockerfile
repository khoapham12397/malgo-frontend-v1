FROM node:16-alpine as builder
WORKDIR /app
RUN npm install
RUN 