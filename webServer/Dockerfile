# Use an official Node.js runtime as a parent image
FROM node:16-slim

# Set the working directory in the container
WORKDIR /myapp/webserver

# Copy package.json and package-lock.json to the container
COPY ./webServer/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY ./webServer/ ./

# Install MongoDB client tools (optional, for debugging)
# RUN apt-get update && apt-get install -y mongodb-tools && apt-get clean

# Build arguments for the client IP and port
ARG REC_TO_WEB_IP
ARG REC_TO_WEB_PORT
ARG USER_TO_WEB_PORT

# Set environment variables for runtime
ENV REC_TO_WEB_IP=${REC_TO_WEB_IP}
ENV REC_TO_WEB_PORT=${REC_TO_WEB_PORT}
ENV USER_TO_WEB_PORT=${USER_TO_WEB_PORT}

# Command to run the web server
CMD ["npm", "start"]