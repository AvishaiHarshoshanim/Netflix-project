#ifndef CONSOLE_RECIVER_H
#define CONSOLE_RECIVER_H

#include "IReciver.h"
#include <iostream>
#include <string>

class ConsoleReciver : public IReciver {
    std::string command;

public:
    std::string nextCommand() override;
    void displayError(std::string& error) override;
};

#endif 