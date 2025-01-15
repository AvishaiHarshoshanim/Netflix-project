#ifndef PATCH_H
#define PATCH_H

#include "Update.h"

class Patch : public Update {
public:
    Patch(unsigned long int user_id, std::vector<unsigned long int> movie_vector);
    std::string execute() override;
};

#endif // PATCH_H