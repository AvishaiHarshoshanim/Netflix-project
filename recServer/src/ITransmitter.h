#ifndef ITRANSMITTER_H
#define ITRANSMITTER_H

#include <string>

class ITransmitter 
{
public:
    virtual ~ITransmitter() = default;
    virtual void transmit(const std::string& message) = 0;
};

#endif // ITRANSMITTER_H