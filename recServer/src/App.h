#ifndef APP_H
#define APP_H

#include "IReciver.h"
#include "ITransmitter.h"
#include "Validator.h"
#include "ICommand.h"
#include <map>
#include <functional>
#include <vector>
#include <string>

class App {
    IReciver* reciver; 
    ITransmitter* transmitter;
    std::map<std::string, std::function<ICommand*(std::vector<unsigned long int>)>> commands; // Copy of commands
    Validator validator;

public:
    App(IReciver* reciver, ITransmitter* transmitter,  std::map<std::string, std::function<ICommand*(std::vector<unsigned long int>)>> cmds);
    void run();
};

#endif // APP_H