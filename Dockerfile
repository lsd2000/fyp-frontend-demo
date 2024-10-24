FROM node:alpine
WORKDIR /app
COPY . ./
RUN npm install
# COPY src ./src
# COPY public ./public
CMD ["npm", "run", "prod"]