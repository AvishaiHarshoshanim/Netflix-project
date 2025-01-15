#ifndef SOCKET_TRANSMITTER_H
#define SOCKET_TRANSMITTER_H

#include "ITransmitter.h"
#include <string>
#include <sys/socket.h>

class SocketTransmitter : public ITransmitter {
public:
    explicit SocketTransmitter(int sock);
    void transmit(const std::string& message) override;

private:
    int socket;
};

#endif // SOCKET_TRANSMITTER_H