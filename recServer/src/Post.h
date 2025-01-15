#ifndef POST_H
#define POST_H

#include "Update.h"

class Post : public Update {
public:
    Post(unsigned long int user_id, std::vector<unsigned long int> movie_vector);
    std::string execute() override;
};

#endif // POST_H