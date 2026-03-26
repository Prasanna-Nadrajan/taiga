# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with custom config
FROM nginx:alpine
# Copy our custom config file
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the built React app
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]