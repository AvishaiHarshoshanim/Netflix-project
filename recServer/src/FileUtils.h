#ifndef FILE_UTILS_H
#define FILE_UTILS_H

#include <map>
#include <string>
#include <vector>
#include <mutex>
#include <thread>

// Declaration of the global userToMovies map that will hold the user IDs and their associated movie IDs
extern std::map<unsigned long int, std::vector<unsigned long int>> userToMovies;

// Mutex to protect userToMovies
extern std::mutex userToMoviesMutex;

// Function declaration to read data from a file function
std::map<unsigned long int, std::vector<unsigned long int>> read_from_file(const std::string& filename);

#endif // FILE_UTILS_H
