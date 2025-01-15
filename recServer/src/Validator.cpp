#include "Validator.h"
#include <iostream>  
//constructor
Validator::Validator(std::map<std::string, std::function<ICommand*(std::vector<unsigned long int>)>> cmds)
    : commands(cmds) {
        //init the validation map
    validationMap = {
        {"POST", validateUPDATE},
        {"PATCH", validateUPDATE},
        {"DELETE", validateUPDATE},
        {"GET", validateGet},
        {"help", validateHelp}
    };
}
//checks if the input valid
bool Validator::isInputValid(const std::string input) {
    std::istringstream stream(input);
    std::string command;
    stream >> command;
//checks how many args in the stream except the command
    int num = NumOfArgs(stream);

    // Reset the stream
    stream.clear();
    stream.str(input);
    stream >> command;

    // checks if the command is in the commands map if not its illeagal command
    if (commands.find(command) == commands.end()) {
        return false;
    }

    return validationMap[command](command, num, stream);
}

//function that checks if the arguments are unsigned int
bool Validator::areArgsUnsignedInt(std::istringstream& stream) {
    std::string arg;
    while (stream >> arg) {
        if (!isUnsignedInt(arg)) {
            return false;
        }
    }
    return true;
}

//checks if the input is an unsigned int
bool Validator::isUnsignedInt(const std::string& input) {
    if (input.empty() || input[0] == '-') {
        return false;
    }
    try {
        std::stoull(input);
    } catch (...) {
        return false;
    }
    return true;
}

//function that validate the UPDATE command
bool Validator::validateUPDATE(std::string userId, int num, std::istringstream& stream) {
    //if the number of args > 2 and the args are unsignedint true else false
    return num >= 2 && areArgsUnsignedInt(stream);
}

//function that validate the help command
bool Validator::validateHelp(std::string, int num, std::istringstream& stream) {
    //if the number of args = 0 true
    return num == 0;
}

//function that validate the GET command
bool Validator::validateGet(std::string userId, int num, std::istringstream& stream) {
    //if the number of args = 2 and the args are unsignedint true
    return num == 2 && areArgsUnsignedInt(stream);
}

//checks how many args are in the stream
int Validator::NumOfArgs(std::istringstream& stream) {
    std::vector<std::string> args;
    std::string arg;
    while (stream >> arg) {
        args.push_back(arg);
    }
    return args.size();
}