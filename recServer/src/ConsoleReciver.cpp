#include "ConsoleReciver.h"

// Read a command from the console
std::string ConsoleReciver::nextCommand() {
    std::getline(std::cin, command);
    return command;
}

// Display an error message to the console
void ConsoleReciver::displayError(std::string& error) {
    std::cerr << "Error: " << error << std::endl;
}