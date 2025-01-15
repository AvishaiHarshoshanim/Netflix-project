#ifndef VALIDATOR_H
#define VALIDATOR_H

#include <string>
#include <map>
#include <vector>
#include <sstream>
#include <functional>
#include "ICommand.h"

class Validator {
private:
    std::map<std::string, std::function<ICommand*(std::vector<unsigned long int>)>> commands;
    std::map<std::string, std::function<bool(const std::string&, int, std::istringstream&)>> validationMap;

    static bool areArgsUnsignedInt(std::istringstream& stream);
    static bool isUnsignedInt(const std::string& input);
    static bool validateUPDATE(std::string userId, int num, std::istringstream& stream);
    static bool validateHelp(std::string userId, int num, std::istringstream& stream);
    static bool validateGet(std::string userId, int num, std::istringstream& stream);
    static int NumOfArgs(std::istringstream& stream);

public:
    // Constructor
    Validator(std::map<std::string, std::function<ICommand*(std::vector<unsigned long int>)>> cmds);
    //the logic of the validation process
    bool isInputValid(const std::string input);
};

#endif // VALIDATOR_H