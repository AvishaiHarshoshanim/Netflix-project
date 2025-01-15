#ifndef IRECIVER_H
#define IRECIVER_H

#include <string>

// IReciver interface: abstracts user interaction
class IReciver {
public:
    virtual std::string nextCommand() = 0;
    virtual void displayError(std::string& error) = 0;
    virtual ~IReciver() = default;
};

#endif//IRECIVER_H