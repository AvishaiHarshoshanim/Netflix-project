#include "Help.h"
#include <iostream>
Help::Help() {}

std::string Help::execute() {
    std::string message = 
            "200 Ok\n\n"
            "DELETE, arguments: [userid] [movieid1] [movieid2] ...\n"
            "GET, arguments: [userid] [movieid]\n"
            "PATCH, arguments: [userid] [movieid1] [movieid2] ...\n"
            "POST, arguments: [userid] [movieid1] [movieid2] ...\n"
            "help\n";
    return message;
}