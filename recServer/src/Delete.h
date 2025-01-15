#ifndef DELETE_H
#define DELETE_H

#include "Update.h"

class Delete : public Update {
public:
    Delete(unsigned long int user_id, std::vector<unsigned long int> movie_vector);
    std::string execute() override;

private:
    bool does_movies_exist(unsigned long int user_id, std::vector<unsigned long int> movie_vector);
    void delete_movies_from_user(unsigned long int user_id,std::vector<unsigned long int> movie_vector);
};

#endif // DELETE_H