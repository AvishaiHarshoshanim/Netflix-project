# Use the official Python 3 base image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /myapp/client

# Copy the Python client code to the container
COPY ./src/client/ .

# Build arguments for the client IP and port
ARG CLIENT_IP
ARG CLIENT_PORT

# Set environment variables for runtime
ENV CLIENT_IP=${CLIENT_IP}
ENV CLIENT_PORT=${CLIENT_PORT}

# Command to run the Python client with the server IP and port
CMD bash -c "python3 client.py $CLIENT_IP $CLIENT_PORT"
