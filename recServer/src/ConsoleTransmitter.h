#ifndef CONSOLETRANSMITTER_H
#define CONSOLETRANSMITTER_H

#include "ITransmitter.h"
#include <iostream>

// Class for transmitting messages to the console
class ConsoleTransmitter : public ITransmitter {
    public:
        void transmit(const std::string& message) override;
};

#endif // CONSOLETRANSMITTER_H