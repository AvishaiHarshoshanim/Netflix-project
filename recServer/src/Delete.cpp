#include "Delete.h"
#include <algorithm>

Delete::Delete(unsigned long int user_id, std::vector<unsigned long int> movie_vector)
    : Update(user_id, movie_vector) {}

std::string Delete::execute() {
    // Protect the file and the critical section
    std::lock_guard<std::mutex> lock(userToMoviesMutex);

    //if this user exist and all the movies are exist delete
    if (does_user_exist(user_id) && does_movies_exist(user_id, movie_vector)) {
        delete_movies_from_user(user_id, movie_vector);
        update_file("data/users.txt");
        //if not return 404
        return "204 No Content\n";
    } else {
        return "404 Not Found\n";
    }
}
//checks if he user watched all the movies if not it return false
bool Delete::does_movies_exist(unsigned long int user_id, std::vector<unsigned long int> movie_vector) {
    std::vector<unsigned long int> movies = userToMovies[user_id];
    for (unsigned long int movieID : movie_vector) {
        if (std::find(movies.begin(), movies.end(), movieID) == movies.end()) {
            return false;
        }
    }
    return true;
}
void Delete::delete_movies_from_user(unsigned long int user_id,std::vector<unsigned long int> movie_vector) {
    //refrence to the vector that contains the movies of the user
   std::vector<unsigned long int>& movies = userToMovies[user_id];
   //delete the movies from the user
    for (unsigned long int movieID : movie_vector) {
        auto iter = std::find(movies.begin(), movies.end(), movieID);
        if (iter != movies.end()) {
            movies.erase(iter);
       }
    }
}