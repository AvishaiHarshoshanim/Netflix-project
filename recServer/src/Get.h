#ifndef Get_H
#define Get_H

#include "ICommand.h"
#include "ITransmitter.h"
#include "FileUtils.h"
#include <vector>
#include <map>
#include <set>

extern std::map<unsigned long int, std::vector<unsigned long int>> userToMovies;

#define MAX_GET_RECOMMENDATIONS 10 

class Get : public ICommand {

    public:

        unsigned long int userId;
        unsigned long int movieId;
        ITransmitter* transmitter;

        // constructor
        Get(unsigned long int userId, unsigned long int movieId);

       std::string execute() override;

        // Comparison function for sorting pairs
        static bool comparePairs(const std::pair<unsigned long int, unsigned long int>& a, const std::pair<unsigned long int, unsigned long int>& b);


        // Function to get users who watched a specific movie
        std::map<unsigned long int, std::vector<unsigned long int>> getUsersWhoWatchedSpecificMovie(unsigned long int movieId);

        // Function to sort movies by similarity score
        std::vector<std::pair<unsigned long int, unsigned long int>> sortMoviesByScore(const std::map<unsigned long int, unsigned long int>& movieRecommendationScores, unsigned long int userId);

        // Calculates similarity scores based on common movies between userid and other users.
        std::map<unsigned long int, unsigned long int> calculateSimilarityScores(const std::map<unsigned long int, std::vector<unsigned long int>>& usersWhoWatchedMovies, unsigned long int currentUserId);
    
        // Calculates movie recommendation scores based on user similarity
        std::map<unsigned long int, unsigned long int> calculateMovieScores(const std::map<unsigned long int, std::vector<unsigned long int>>& usersWhoWatchedMovies, const std::map<unsigned long int, unsigned long int>& similarityScores, unsigned long int movieId);
    
       std::string printTopMovies(const std::vector<std::pair<unsigned long int, unsigned long int>>& sortedRecommendations, size_t maxMoviesToPrint);
       
       bool does_user_exist(unsigned long int user_id);

};

#endif // Get_H