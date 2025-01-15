#include "SocketReciver.h"
#include <unistd.h> 
#include <cstring> 
#include <stdexcept>

// constructor
// The constructor receives a 'sock' argument from which it will read data
SocketReciver::SocketReciver(int sock) : socket(sock) {}

void SocketReciver::displayError(std::string& error) {}

std::string SocketReciver::nextCommand() {
    char buffer[4096];  // The data received from the socket will be stored in the buffer.
    memset(buffer, 0, sizeof(buffer));  // Resets all buffer contents to zeros.

    // Reading data from the socket
    ssize_t bytesRead = recv(socket, buffer, sizeof(buffer) - 1, 0);


    // Treatment of special situations
    // If the value of bytesRead is less than 0, reading from the socket failed.
    if (bytesRead < 0) {
        throw std::runtime_error("Failed to read from socket: " + std::string(strerror(errno)));
    } 

    // If the client closed the connection
    if (bytesRead == 0) {
        return "quit";
    } 

    // If the read was successful, the function returns the read data
    return std::string(buffer);
}