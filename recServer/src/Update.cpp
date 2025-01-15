#include "Update.h"
#include <algorithm>

Update::Update(unsigned long int user_id, std::vector<unsigned long int> movie_vector)
    : user_id(user_id), movie_vector(movie_vector) {}

std::string Update::execute() {
    if (does_user_exist(user_id))
        add_movie_to_user(user_id, movie_vector);
    else
        add_movie_to_new_user(user_id, movie_vector);

    update_file("data/users.txt");
    return "Operation Successful";
}

void Update::update_file(std::string file_name) {
    std::ofstream file_stream(file_name);
    if (!file_stream) return;

    for (const auto& pair : userToMovies) {
        file_stream << pair.first;
        for (unsigned long int movieID : pair.second) {
            file_stream << " " << movieID;
        }
        file_stream << std::endl;
    }
    file_stream.close();
}

bool Update::does_user_exist(unsigned long int user_id) {
    return userToMovies.count(user_id) > 0;
}

void Update::add_movie_to_new_user(unsigned long int user_id, std::vector<unsigned long int>& movie_vector) {
    userToMovies[user_id] = movie_vector;
}

void Update::add_movie_to_user(unsigned long int user_id, std::vector<unsigned long int>& movie_vector) {
    auto& movies = userToMovies[user_id];
    for (unsigned long int newMovieId : movie_vector) {
        if (std::find(movies.begin(), movies.end(), newMovieId) == movies.end()) {
            movies.push_back(newMovieId);
        }
    }
}