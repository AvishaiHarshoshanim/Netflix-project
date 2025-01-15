#include "SocketTransmitter.h"
#include <unistd.h> // for send() function

// The SocketTransmitter object is responsible for sending messages through the socket passed to it.
// When the 'transmit' function is called with a particular string,
// the function takes that string and sends it through the socket received in the constructor.

// constructor
// The constructor accepts a socket as an argument (ocket that allows data to be sent through it)
SocketTransmitter::SocketTransmitter(int sock) : socket(sock) {}

// The function receives a message (string) and sends it through the socket defined in the constructor.
// 'socket' - The socket ID from which the message is sent
//  'send' is a function for sending messages between sockets.
void SocketTransmitter::transmit(const std::string& message) {
    send(socket, message.c_str(), message.length(), 0);    
}

// 'message.length()' Converts the string message to a pointer to the first character in the string,
// which is what the send function expects to receive.

// When you call the send function' The operating system looks at the information stored
// together with the socket (IP address and port) and understands where to sendthemessage.