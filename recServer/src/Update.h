#ifndef UPDATE_H
#define UPDATE_H

#include "ICommand.h"
#include "FileUtils.h"
#include <vector>
#include <map>     
#include <fstream>

extern std::map<unsigned long int, std::vector<unsigned long int>> userToMovies;

class Update : public ICommand {
protected:
    unsigned long int user_id;
    std::vector<unsigned long int> movie_vector;
    void update_file(std::string file_name);
    void add_movie_to_new_user(unsigned long int user_id, std::vector<unsigned long int>& movie_vector);
    void add_movie_to_user(unsigned long int user_id, std::vector<unsigned long int>& movie_vector);
    bool does_user_exist(unsigned long int user_id);

public:
    Update(unsigned long int user_id, std::vector<unsigned long int> movie_vector);
    virtual std::string execute() override;
};
#endif // UPDATE_H