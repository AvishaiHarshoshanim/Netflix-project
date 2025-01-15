#ifndef SERVER_SOCKET_H
#define SERVER_SOCKET_H

#include <netinet/in.h>
#include <stdexcept>
#include <cstring>
#include <unistd.h>

class ServerSocket {
public:
    // Initializes the server socket with a given port
    explicit ServerSocket(int port);

    // Accepts a new client connection and return the client socket descriptor
    int acceptClient();

    // Clean the server socket
    ~ServerSocket();

private:
    int serverSocket;
    struct sockaddr_in server_addr{};
};

#endif // SERVER_SOCKET_H
