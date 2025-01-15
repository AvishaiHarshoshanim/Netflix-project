#ifndef HELP_H
#define HELP_H

#include "ICommand.h"
#include <string>

class Help : public ICommand {
public:
    Help();
    std::string execute() override;
};

#endif // HELP_H