#include <gtest/gtest.h>
#include <fstream>
#include <filesystem>
#include <map>
#include <vector>
#include <string>
#include <functional>
#include "SocketReciver.h"
#include "SocketTransmitter.h"
//#include "ICommand.h"
//#include "IThread.h"
#include "FileUtils.h"
#include "App.h"
#include "ServerSocket.h"
#include "regularThread.h"
#include "Help.h"
#include "Update.h"
#include "Patch.h"
#include "Post.h"
#include "Delete.h"
#include "Get.h"
#include "Validator.h"
#include "ICommand.h"
#include "Help.h"
class MockCommand : public ICommand {
public:
    std::string execute() override { return ""; }
};

// Create mock commands for the validator
ICommand* CreatePatchCommand1(std::vector<unsigned long int> args) {
    return new MockCommand();
}

ICommand* CreatePostCommand1(std::vector<unsigned long int> args) {
    return new MockCommand();
}

ICommand* CreateGetCommand1(std::vector<unsigned long int> args) {
    return new MockCommand();
}

ICommand* CreateDeleteCommand1(std::vector<unsigned long int> args) {
    return new MockCommand();
}

ICommand* CreateHelpCommand1(std::vector<unsigned long int> args) {
    return new MockCommand();
}
std::map<std::string, std::function<ICommand*(std::vector<unsigned long int>)>> commands1 = {
    {"PATCH", CreatePatchCommand1},
    {"POST", CreatePostCommand1},
    {"GET", CreateGetCommand1},
    {"DELETE", CreateDeleteCommand1},
    {"HELP", CreateHelpCommand1}
};
// Helper function to create a mock file for testing
void create_mock_file(const std::string& filename, const std::string& content) {
    std::ofstream file(filename);
    file << content;
    file.close();
}

class UpdateTest : public ::testing::Test {
protected:
    std::string testFile = "users.txt";

    void SetUp() override {
        std::string mockContent = "1 101 102 103\n2 201 202\n";
        create_mock_file(testFile, mockContent);
        userToMovies = read_from_file(testFile);
    }

    void TearDown() override {
        std::filesystem::remove(testFile);
    }
};


class PostTest : public UpdateTest {
  
};

class PatchTest : public UpdateTest {

};

class DeleteTest : public UpdateTest {
};

// Test for reading from file
TEST_F(UpdateTest, ReadFromFile) {
    std::map<unsigned long int, std::vector<unsigned long int>> result = read_from_file(testFile);

    ASSERT_EQ(result.size(), 2);
    ASSERT_EQ(result[1], std::vector<unsigned long int>({101, 102, 103}));
    ASSERT_EQ(result[2], std::vector<unsigned long int>({201, 202}));
}

// Test for legal post command
TEST_F(PostTest, AddMovieToNewUser) {
    Post post(3, {301, 302});
    post.execute();
    std::map<unsigned long int, std::vector<unsigned long int>> result = read_from_file(testFile);

    ASSERT_EQ(result[3], std::vector<unsigned long int>({301, 302}));
    ASSERT_EQ(userToMovies[3], std::vector<unsigned long int>({301, 302}));
}

// Test for illegal post command
TEST_F(PostTest, AddMovieToExistingUser) {
    userToMovies = read_from_file(testFile);
    Post post(1, {104, 105});
    EXPECT_EQ(post.execute(), "404 Not Found\n");
    ASSERT_EQ(userToMovies[1], std::vector<unsigned long int>({101, 102, 103}));
}

// Test patch command when one movie is a duplicate and one is new
TEST_F(PatchTest, AddDuplicateMovies) {
    userToMovies = read_from_file(testFile);
    Patch patch(1, {103, 104});
    patch.execute();

    ASSERT_EQ(userToMovies[1], std::vector<unsigned long int>({101, 102, 103, 104}));
}
// Test patch command when user exist 
TEST_F(PatchTest, AddeMovies) {
    userToMovies = read_from_file(testFile);
    Patch patch(1, {105});
    patch.execute();
    EXPECT_EQ(patch.execute(), "204 No Content\n");
    ASSERT_EQ(userToMovies[1], std::vector<unsigned long int>({101, 102, 103, 105}));
}
//test patch command when user does not exist
TEST_F(PatchTest, AddMovieTononeExistingUser) {
    userToMovies = read_from_file(testFile);
    Patch patch(5, {501, 502});
    EXPECT_EQ(patch.execute(), "404 Not Found\n");
    ASSERT_TRUE(userToMovies[5].empty());
}
//test for legal delete command
TEST_F(DeleteTest, DeleteExistingMovies) {
    Delete del(1, {102, 103});
    std::string result = del.execute();

    ASSERT_EQ(result, "204 No Content\n");
    ASSERT_EQ(userToMovies[1], std::vector<unsigned long int>({101}));
}
//test for illegal delete command: the movie does not exist
TEST_F(DeleteTest, DeleteNonExistingMovies) {
    Delete del(1, {104});
    std::string result = del.execute();

    ASSERT_EQ(result, "404 Not Found\n");
    ASSERT_EQ(userToMovies[1], std::vector<unsigned long int>({101, 102, 103}));
}
//test for deleting all movies
TEST_F(DeleteTest, DeleteAllMovies) {
    Delete del(2, {201, 202});
    std::string result = del.execute();

    ASSERT_EQ(result, "204 No Content\n");
    ASSERT_TRUE(userToMovies[2].empty());
}
//test for illegal delete command: user does not exist
TEST_F(DeleteTest, DeleteMoviesForNonExistingUser) {
    Delete del(4, {401});
    std::string result = del.execute();

    ASSERT_EQ(result, "404 Not Found\n");
}
//test to check help
TEST(HelpTest, ExecuteReturnsCorrectMessage) {
    Help helpCommand;

    std::string expectedMessage =
         "200 Ok\n\n"
        "DELETE, arguments: [userid] [movieid1] [movieid2] ...\n"
        "GET, arguments: [userid] [movieid]\n"
        "PATCH, arguments: [userid] [movieid1] [movieid2] ...\n"
        "POST, arguments: [userid] [movieid1] [movieid2] ...\n"
        "help\n";

    std::string result = helpCommand.execute();

    ASSERT_EQ(result, expectedMessage);
}

// Validator tests
TEST(ValidatorTest, ValidPatchCommand) {
    Validator validator(commands1);
    std::string input = "PATCH 1 2 3";
    EXPECT_TRUE(validator.isInputValid(input));
}

TEST(ValidatorTest, ValidPostCommand) {
    Validator validator(commands1);
    std::string input = "POST 1 2 3";
    EXPECT_TRUE(validator.isInputValid(input));
}

TEST(ValidatorTest, InvalidCommand) {
    Validator validator(commands1);
    std::string input = "123 123";
    EXPECT_FALSE(validator.isInputValid(input));
}

TEST(ValidatorTest, InvalidCommandNegNumber) {
    Validator validator(commands1);
    std::string input = "PATCH 1 -12";
    EXPECT_FALSE(validator.isInputValid(input));
}

TEST(ValidatorTest, GetCommandWithTooFewArguments) {
    Validator validator(commands1);
    std::string input = "GET 123";
    EXPECT_FALSE(validator.isInputValid(input));
}

TEST(ValidatorTest, GetCommandWithTooManyArguments) {
    Validator validator(commands1);
    std::string input = "GET 123 123 123";
    EXPECT_FALSE(validator.isInputValid(input));
}

// Helper Function - Initialize Mock Data
void mock_user_data() {
    userToMovies = {
        {1, {100, 101, 102}},  // User 1 watched 3 movies
        {2, {101, 103, 104}},
        {3, {100, 104, 105}},
        {4, {106, 107, 108}},
    };
}

// GetTest fixture class
class GetTest : public ::testing::Test {
protected:
    unsigned long int userId = 1;
    unsigned long int movieId = 101;
    Get* get;

    // Setup function that runs before each test
    void SetUp() override {
        mock_user_data();  // Data initialization
        get = new Get(userId, movieId);  // Creating the test object
    }

    // TearDown function that runs after each test
    void TearDown() override {
        delete get;  // Cleaning up
    }
};

// Tests for the getUsersWhoWatchedSpecificMovie function (The function checks which users have watched a certain movie)
TEST_F(GetTest, GetUsersWhoWatchedSpecificMovie) {
    // The function getUsersWhoWatchedSpecificMovie is called with the movieId (set as 101 in the Fixture)
    // The function returns a collection of users who watched this movie (101)
    auto users = get->getUsersWhoWatchedSpecificMovie(movieId);

    ASSERT_EQ(users.size(), 2);          // Checking that the function returns exactly two users

    // Checking that certain users are included in the list
    ASSERT_TRUE(users.count(1) > 0);    // User 1 watched the movie
    ASSERT_TRUE(users.count(2) > 0);    // User 2 watched the movie
}

// Test for the calculateSimilarityScores function (The function checks similarity between a user and other users)
TEST_F(GetTest, CalculateSimilarityScores) {
    // Preparation of the data
    auto usersWhoWatched = get->getUsersWhoWatchedSpecificMovie(movieId);

    // Calculation of similarity scores
    auto similarityScores = get->calculateSimilarityScores(usersWhoWatched, userId);

    ASSERT_EQ(similarityScores.size(), 1);  // Checking that there is only 1 user in similarityScores (since only 1 user has seen the movie 101)

    // The similarity score of users in relation to the tested user (userId) was tested
    ASSERT_EQ(similarityScores[2], 1);     // User 2 watched 1 movie in common with the tested user, so their similarity score is 1
    ASSERT_EQ(similarityScores[3], 0);
    ASSERT_EQ(similarityScores[1], 0);
}

// Test for the calculateMovieScores function (Check the movie score according to users' preferences)
TEST_F(GetTest, CalculateMovieScores) {
    // Finding users who have watched a particular movie
    auto usersWhoWatched = get->getUsersWhoWatchedSpecificMovie(movieId);

    // Calculation of similarity scores
    auto similarityScores = get->calculateSimilarityScores(usersWhoWatched, userId);

    // Score calculation for movies
    auto movieScores = get->calculateMovieScores(usersWhoWatched, similarityScores, movieId);

    ASSERT_GT(movieScores.size(), 0);         // Checking that there are recommended movies (the algorithm works)

    // In the data set, movie 104 is a movie that user 2 watched (and therefore relevant to recommendations for user 1).
    // This test checks if it appears in the recommendations, and if its score is calculated correctly.
    ASSERT_TRUE(movieScores.find(104) != movieScores.end());  // Checks that movie 104 is inside the movieScores map

    // The ASSERT_GT command checks that the value of movieScores[104] (the score of Movie 104) is greater than 0.
    // This means that the movie "104" received a positive score in the calculation process, so it is considered worthy of a recommendation.
    ASSERT_GT(movieScores[104], 0);  // Movie 104 should be recommended
}

// Test checks that two operations are performed correctly
// Sort movies by score, and only movies that the user has not watched should be listed.
// At the end of the test, we expect: There should be exactly 2 recommended movies after filtering and sorting,
// And that the first movie on the list will be movie number 103
TEST_F(GetTest, SortMoviesByScore) {
    // Getting users who have watched movieId
    auto usersWhoWatched = get->getUsersWhoWatchedSpecificMovie(movieId);

    // Calculation of the degree of similarity
    auto similarityScores = get->calculateSimilarityScores(usersWhoWatched, userId);

    // Score calculation for each movie
    auto movieScores = get->calculateMovieScores(usersWhoWatched, similarityScores, movieId);

    // Sorting and filtering movies
    auto sortedMovies = get->sortMoviesByScore(movieScores, userId);

    ASSERT_EQ(sortedMovies.size(), 2); // The test verifies that after filtering and sorting there are exactly 2 recommended movies left
    ASSERT_EQ(sortedMovies[0].first, 103); // Movie 103 should be the top recommendation
    ASSERT_EQ(sortedMovies[1].first, 104);
}

// Test printTopMovies function (Check that the correct movies are printed in the recommendations)
TEST_F(GetTest, PrintTopMovies) {
    auto usersWhoWatched = get->getUsersWhoWatchedSpecificMovie(movieId);
    auto similarityScores = get->calculateSimilarityScores(usersWhoWatched, userId);
    auto movieScores = get->calculateMovieScores(usersWhoWatched, similarityScores, movieId);
    auto sortedMovies = get->sortMoviesByScore(movieScores, userId);

    // Call the function and store the returned output
    std::string output = get->printTopMovies(sortedMovies, 3);

    // Check that the output contains the expected movie IDs
    ASSERT_NE(output.find("104"), std::string::npos) << "Movie 104 was not found in the output. Captured Output:\n" << output;
}
class SocketTest : public ::testing::Test {
protected:
//arry that holds the sockets
    int sockets[2]; 

    void SetUp() override {
        ASSERT_EQ(socketpair(AF_UNIX, SOCK_STREAM, 0, sockets), 0);
    }

    void TearDown() override {
        // Close the sockets
        close(sockets[0]);
        close(sockets[1]);
    }
};

// Test that checks the communaction between the socktReciver and  socktTeciver
TEST_F(SocketTest, TransmitAndReceive) {
    SocketTransmitter transmitter(sockets[0]);
    SocketReciver receiver(sockets[1]);

    std::string message = "Hello, its me!";
    transmitter.transmit(message);

    std::string receivedMessage = receiver.nextCommand();

    ASSERT_EQ(receivedMessage, message);
}
// Main function to run all tests
int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}