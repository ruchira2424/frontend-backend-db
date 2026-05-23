# Stage 1: Build the React application
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Add this line right here to bypass the OpenSSL version conflict
ENV NODE_OPTIONS=--openssl-legacy-provider


RUN npm run build

# Stage 2: Serve the build files using Nginx
FROM nginx:alpine
# Copy the built static files from Stage 1 to Nginx's public folder
COPY --from=builder /app/build /usr/share/nginx/html
# Copy a custom Nginx configuration to handle React routing correctly
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
