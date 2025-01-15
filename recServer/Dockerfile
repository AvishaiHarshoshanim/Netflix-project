# Use a C++ base image to compile the server code
FROM gcc:latest

# Set the working directory in the container
WORKDIR /myapp/server

# Copy C++ source code files to the container
COPY ./recServer/src/ .

# Install necessary libraries for networking (if needed)
RUN apt-get update && apt-get install -y \
    libboost-system-dev libboost-thread-dev

# Set build arguments for the port
ARG REC_TO_WEB_PORT

# Expose the port that the server will use
EXPOSE ${REC_TO_WEB_PORT}

# Compile the C++ server code
RUN g++ *.cpp -o server

# Command to run the server with the provided port
CMD bash -c "./server ${REC_TO_WEB_PORT}"