#include "Patch.h"

Patch::Patch(unsigned long int user_id, std::vector<unsigned long int> movie_vector)
    : Update(user_id, movie_vector) {}

std::string Patch::execute() {
    // Protect the file and the critical section
    std::lock_guard<std::mutex> lock(userToMoviesMutex);

    //if the user exist add movie, update file,and return 204 No Content
    if (does_user_exist(user_id)) {
        add_movie_to_user(user_id, movie_vector);
        update_file("data/users.txt");
        return "204 No Content\n";
    } else {
        //if the user does not exist 404 Not Found
        return "404 Not Found\n";
    }
}