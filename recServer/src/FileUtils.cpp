#include "FileUtils.h"
#include <fstream>
#include <sstream>

// Declaration of the global userToMovies map that will hold the user IDs and their associated movie IDs
std::map<unsigned long int, std::vector<unsigned long int>> userToMovies;

// Declaration of the global mutex key
std::mutex userToMoviesMutex;

// Function to read data from a file and update the userToMovies map
std::map<unsigned long int, std::vector<unsigned long int>> read_from_file(const std::string& filename) {
    std::ifstream file(filename);

    if (!file.is_open()) {
        return userToMovies; // Return empty map in case of an error
    }

    // Read the file line by line
    std::string line;
    while (std::getline(file, line)) {
        // Create a string stream to parse the current line
        std::istringstream stream_of_line(line);

        // Read the user ID from the beginning of the line
        unsigned long int userId;
        if (!(stream_of_line >> userId)) {
            continue;
        }

        // Vector for the movie IDs of the current user
        std::vector<unsigned long int> movies;

        // Read movie IDs from the remaining part of the line
        unsigned long int movieId;
        while (stream_of_line >> movieId) {
            movies.push_back(movieId);
        }

        // Update the userToMovies map
        userToMovies[userId] = movies;
    }

    file.close();
    return userToMovies;
}
