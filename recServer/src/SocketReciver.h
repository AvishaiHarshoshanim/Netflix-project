 #ifndef SOCKETRECIVER_H
#define SOCKETRECIVER_H

#include "IReciver.h"
#include <string>
#include <sys/socket.h>

class SocketReciver : public IReciver {

private:
    int socket;

public:
    // constructor
    explicit SocketReciver(int sock);
    void displayError(std::string& error) override;
    std::string nextCommand() override; 
};

#endif // SOCKETRECIVER_H