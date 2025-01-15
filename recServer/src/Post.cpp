#include "Post.h"

Post::Post(unsigned long int user_id, std::vector<unsigned long int> movie_vector)
    : Update(user_id, movie_vector) {}

std::string Post::execute() {
    // Protect the file and the critical section
    std::lock_guard<std::mutex> lock(userToMoviesMutex);

    //if the exist 404 Not Found
    if (does_user_exist(user_id)) {
        return "404 Not Found\n";
    //if the user does not exist add movie, update file,and return 201 Created
    } else {
        add_movie_to_new_user(user_id, movie_vector);
        update_file("data/users.txt");
        return "201 Created\n";
    }
}