#include "Get.h"
#include <iostream>
#include <map> 
#include <vector>
#include <set>
#include <algorithm>  //for set_intersection

#define MAX_RECOMMENDATIONS 10
using namespace std;


// Constructor + initialize the class variables
Get::Get(unsigned long int userId, unsigned long int movieId) : userId(userId), movieId(movieId) {}

std::string Get::execute() {
    // Protect the file and the critical section
    std::lock_guard<std::mutex> lock(userToMoviesMutex);

    //if there is no userId it i
    if(!does_user_exist(userId)){
        return "404 Not Found\n";
        }

    // Retrieve the map of users who watched the given movie and the movies they watched
    std::map<unsigned long int, std::vector<unsigned long int>> usersWhoWatchedMovies = getUsersWhoWatchedSpecificMovie(movieId);

    // A map to store similarity scores between users (the key is the userid and the value is the number of common movies)
    std::map<unsigned long int, unsigned long int> similarityScores = calculateSimilarityScores(usersWhoWatchedMovies, userId);

    // map to store total similarity scores for each movie (key = movieId, value = sum of similarities)
    std::map<unsigned long int, unsigned long int> movieGetationScores = calculateMovieScores(usersWhoWatchedMovies, similarityScores, movieId);

    // At this point, movieGetationScores contains the total similarity scores for each movie

    // Now we call the sort function to get the sorted list of Geted movies
    // We will move from map to vector because map is always sorted according to the key and not according to the similarity value
    std::vector<std::pair<unsigned long int, unsigned long int>> sortedRecommendations = sortMoviesByScore(movieGetationScores, userId);

    // Print the top MAX_RECOMATIONS Geted movies
   return printTopMovies(sortedRecommendations, MAX_RECOMMENDATIONS);
}



std::map<unsigned long int, std::vector<unsigned long int>> Get::getUsersWhoWatchedSpecificMovie(unsigned long int movieId) 
{
    // Create a map to store the result: the key is the userId, and the value is a vector of movies the user watched
    std::map<unsigned long int, std::vector<unsigned long int>> result;

    // Iterate over all the users in the global userToMovies map
    for (const auto& userEntry : userToMovies) 
    {
        unsigned long int userId = userEntry.first; // Get the user ID (key in userToMovies map)
        const std::vector<unsigned long int>& movies = userEntry.second; // Get the list of movies the user has watched (value in userToMovies map)

        // Check if the specific movieId is in the list of movies the user has watched
        if (std::find(movies.begin(), movies.end(), movieId) != movies.end()) {
            // If the movieId is found, add this user to the result map
            result[userId] = movies; // Add the userId and their watched movies to the result map
        }
    }
    // Return the map of users who watched the specified movie
    return result;
}




// Function to sort the movieGetationScores map in descending order by similarity score
std::vector<std::pair<unsigned long int, unsigned long int>> Get::sortMoviesByScore(const std::map<unsigned long int, unsigned long int>& movieGetationScores, unsigned long int userId)
 {
    // Create a vector of pairs to store the sorted movies
    std::vector<std::pair<unsigned long int, unsigned long int>> sortedRecommendations;

    // Move the data from the map to the vector
    for (const auto& entry : movieGetationScores) {
        sortedRecommendations.push_back(entry);
    }

    // Sort the vector using the comparePairs function
    std::sort(sortedRecommendations.begin(), sortedRecommendations.end(), Get::comparePairs);


    // Now we will delete all the movies that userid has seen and there is no need to Get them to him

    // Create a set of movies the user has already watched
    std::set<unsigned long int> watchedMovies(userToMovies[userId].begin(), userToMovies[userId].end());

    // Create a set of movies in the sortedRecommendations
    std::set<unsigned long int> GetedMovies;
    for (const auto& Getation : sortedRecommendations) {
        GetedMovies.insert(Getation.first);
    }

    // Remove movies from sortedRecommendations that the user has already watched
    std::vector<std::pair<unsigned long int, unsigned long int>> finalGetations;
    for (const auto& Getation : sortedRecommendations) 
    {
        // If find() does not find the movie at the list of movies that userid has watched, it returns the end of the set 
        // That is - if a movie is not in the userid movie list, it will enter finalGetations
        if (watchedMovies.find(Getation.first) == watchedMovies.end())
         {
            finalGetations.push_back(Getation);
        }
    }
    // Return the sorted vector
    return finalGetations;  
}




// Comparison function to sort pairs by the second value in descending order.
// Returns true if the second value of pair 'a' is greater than the second value of pair 'b'.
// This function is used as a custom comparator in sorting algorithms like std::sort.
bool Get::comparePairs(const std::pair<unsigned long int, unsigned long int>& a, const std::pair<unsigned long int, unsigned long int>& b) 
{
    return a.second > b.second;  // Sort in descending order by the second value
}



std::map<unsigned long int, unsigned long int> Get::calculateSimilarityScores(const std::map<unsigned long int, std::vector<unsigned long int>>& usersWhoWatchedMovies, unsigned long int currentUserId) 
{
    // A map to store similarity scores between users - the key is the otherUserId and the value is the number of common movies (similarity score)
    std::map<unsigned long int, unsigned long int> similarityScores; 

    // Iterate over all users who watched the given movie
    for (const auto& entry : usersWhoWatchedMovies) {
        unsigned long int otherUserId = entry.first;   // userid to compare with our userid 
        const std::vector<unsigned long int>& otherUserMovies = entry.second;  // Vector of the movies this userid has watched

        // Skip if it's the current user (we wouldn't want to find similarities between our user and himself)
        if (otherUserId != currentUserId)
         {
            // Convert the vectors to sets so that it is convenient to calculate the intersection between them
            std::set<unsigned long int> userMoviesSet(userToMovies[currentUserId].begin(), userToMovies[currentUserId].end()); // Conversion of the currentUserId to set  (using global data structure - userToMovies)
            std::set<unsigned long int> otherUserMoviesSet(otherUserMovies.begin(), otherUserMovies.end());  // Conversion of the otherUserId (the user we want to compare to ours)

            // Calculate the intersection
            // Create a set to store the intersection of the two sets (common movies between the users)
            std::set<unsigned long int> intersection;

            // Find the intersection of the two sets (common movies between the users)
            // The common elements are inserted into the 'intersection' set
            std::set_intersection(userMoviesSet.begin(), userMoviesSet.end(), otherUserMoviesSet.begin(), otherUserMoviesSet.end(), std::inserter(intersection, intersection.begin())
            );

            // Store the similarity value of otherUserId
            similarityScores[otherUserId] = intersection.size();
        }
    }

    return similarityScores;
}


std::map<unsigned long int, unsigned long int> Get::calculateMovieScores(const std::map<unsigned long int, std::vector<unsigned long int>>& usersWhoWatchedMovies, const std::map<unsigned long int, unsigned long int>& similarityScores, unsigned long int movieId) 
{
    // Map to store total similarity scores for each movie (key = movieId, value = sum of similarities)
    std::map<unsigned long int, unsigned long int> movieRecommendationScores;

    // Go through all users who watched the movieId
    for (const auto& entry : usersWhoWatchedMovies) 
    {
        unsigned long int otherUserId = entry.first;
        const std::vector<unsigned long int>& otherUserMovies = entry.second;

        // For each movie the user watched, add the similarity score of that user to the movie Getation score
        for (unsigned long int movie : otherUserMovies) 
        {
            if (movie != movieId) 
            {  // Skip the movie we are Geting
                auto it = similarityScores.find(otherUserId);
                if (it != similarityScores.end()) 
                {  
                    // If the userId is found in similarityScores map
                    movieRecommendationScores[movie] += it->second;
                }
            }
        }
    }
    return movieRecommendationScores;
}


std::string Get::printTopMovies(const std::vector<std::pair<unsigned long int, unsigned long int>>& sortedRecommendations, size_t maxMoviesToPrint)
 {
    // 'count' will be at most the maximum number of movies we would like to Get
    size_t count = std::min(maxMoviesToPrint, sortedRecommendations.size());

    bool first = true;  // Flag to manage spaces between movie IDs
    std::string output; // string to store the result for printing 

    // store the result in the 'output' string and do not print directly while calculating,
    // then send the entire string at once through the transmitter.


    for (size_t i = 0; i < count; ++i) {
        unsigned long int movieId = sortedRecommendations[i].first;
        unsigned long int score = sortedRecommendations[i].second;

        // If we reach a movie with score 0, stop printing further movies
        if (score == 0) {
            break;
        }

        // do space between every movieid except for the first one
        if (!first) {
            output += " ";
        }
        // Add movieId to the 'output' string
        output += std::to_string(movieId);


        // After "printing" the first movie, set 'first' to false
        first = false;
    }
    output += "\n";
    return std::string("200 Ok\n\n") + output; // Send the result via the transmitter  
}
// Check if a user exists
bool Get::does_user_exist(unsigned long int user_id) {
    return userToMovies.count(user_id) > 0;
}