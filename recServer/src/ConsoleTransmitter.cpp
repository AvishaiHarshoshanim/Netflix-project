#include "ConsoleTransmitter.h"

// Implementation of the transmit method for ConsoleTransmitter
void ConsoleTransmitter::transmit(const std::string& message) {
    std::cout << message << std::endl;
}