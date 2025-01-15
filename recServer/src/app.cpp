#include "App.h"
#include <sstream>
#include <iostream>

// App constructor: initializes reciver, transmitter and commands
App::App(IReciver* reciver, ITransmitter* transmitter, std::map<std::string, std::function<ICommand*(std::vector<unsigned long int>)>> cmds)
    : reciver(reciver), transmitter(transmitter), commands(cmds), validator(cmds) {}

// Main application loop
void App::run() {
    while (true) {
        //get command
        std::string task = reciver->nextCommand();

        //if the input is quit so the client quited
       if (task == "quit") {
            break;
        }

        //if the input is not valid get another input
        if (!validator.isInputValid(task) || task == "\n") {
            transmitter->transmit("400 Bad Request\n");
            continue;
        }

        std::istringstream stream(task);
        std::string commandName;
        stream >> commandName;  // Reading the first word from the stream
        std::vector<unsigned long int> args;
        std::string ids;
        
        //put the ids in vector
        while (stream >> ids) {
            args.push_back(std::stoul(ids));
        }

        //create the command
        ICommand* command = commands[commandName](args);

        //execute
        std::string message = command->execute();

        // transmit the output of the commend with the transmitter
        transmitter->transmit(message);

        delete command;
    }
}