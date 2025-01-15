#include "ServerSocket.h"

ServerSocket::ServerSocket(int port) {
    // Creating a socket
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket < 0) {
        throw std::runtime_error("Error creating socket");
    }

    // Preparing the structure of the IP and Port that is a member of the class
    memset(&server_addr, 0, sizeof(server_addr));
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY;
    server_addr.sin_port = htons(port);

    // Bind the address of the server to the created socket
    if (bind(serverSocket, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
        throw std::runtime_error("Bind failed");
    }

    // Put the socket in listening mode, the server is ready to accept connection requests from 5 clients
    if (listen(serverSocket, SOMAXCONN) < 0) {
        throw std::runtime_error("Listen failed");
    }
}

// Accepting a connection from a client by the server
int ServerSocket::acceptClient() {
    // Defining a structure that represents the client address
    struct sockaddr_in client_addr{};
    socklen_t client_addr_len = sizeof(client_addr);

    // Waiting for an incoming connection from a client socket and accepts it
    int client_sock = accept(serverSocket, (struct sockaddr *)&client_addr, &client_addr_len);
    if (client_sock < 0) {
        throw std::runtime_error("Error accepting client");
    }
    
    return client_sock;
}

ServerSocket::~ServerSocket() {
    close(serverSocket);
}