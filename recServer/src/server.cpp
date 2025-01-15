#include "SocketReciver.h"
#include "SocketTransmitter.h"
#include "ICommand.h"
#include "IThread.h"
#include "FileUtils.h"
#include "App.h"
#include "ServerSocket.h"
#include "regularThread.h"
#include "ThreadPool.h"
#include <map>
#include <functional>
#include <iostream>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <cstring>
#include <thread>
#include <vector>
#include "Help.h"
#include "Update.h"
#include "Patch.h"
#include "Post.h"
#include "Delete.h"
#include "Get.h"

// Command creation functions
ICommand* CreatePatchCommand(std::vector<unsigned long int> args) {
    if (args.empty()) return nullptr;
    unsigned long int user_id = args[0];
    std::vector<unsigned long int> movie_vector(args.begin() + 1, args.end());
    return new Patch(user_id, movie_vector);
}

ICommand* CreatePostCommand(std::vector<unsigned long int> args) {
    if (args.empty()) return nullptr;
    unsigned long int user_id = args[0];
    std::vector<unsigned long int> movie_vector(args.begin() + 1, args.end());
    return new Post(user_id, movie_vector);
}

ICommand* CreateGetCommand(std::vector<unsigned long int> args) {
    if (args.size() < 2) return nullptr;
    unsigned long int userId = args[0];
    unsigned long int movieId = args[1];
    return new Get(userId, movieId);  
}

ICommand* CreateDeleteCommand(std::vector<unsigned long int> args) {
    if (args.empty()) return nullptr;
    unsigned long int user_id = args[0];
    std::vector<unsigned long int> movie_vector(args.begin() + 1, args.end());
    return new Delete(user_id, movie_vector);
}

ICommand* CreateHelpCommand(std::vector<unsigned long int> args) {
    return new Help();
}

void handleClient(int clientSocket) {
        try {
            // Creating transmitter and receiver for the App
            SocketTransmitter transmitter(clientSocket);
            SocketReciver receiver(clientSocket);

            // Creating the command map
            std::map<std::string, std::function<ICommand*(std::vector<unsigned long int>)>> commands;
            commands["PATCH"] = CreatePatchCommand;
            commands["POST"] = CreatePostCommand;
            commands["GET"] = CreateGetCommand;
            commands["DELETE"] = CreateDeleteCommand;
            commands["help"] = CreateHelpCommand;

            // Creating and running app
            App app(&receiver, &transmitter, commands);
            app.run();
        } catch (const std::exception& ex) {
            std::cerr << "Client error: " << ex.what() << std::endl;
        }

        close(clientSocket);
    }

int main(int argc, char *argv[]) {
    // If a port is not received we will not allow progress
    if (argc <= 1) {
        std::cerr << "No port provided. Exiting..." << std::endl;
        return 0; 
    }

    // Check validation of the port
    int port = std::atoi(argv[1]);  // convert to int
    if (port <= 0 || port > 65535) {
        std::cerr << "Invalid port number. Exiting..." << std::endl;
        return 0; 
    }

    // Update userToMovies from the file
    read_from_file("data/users.txt");

    // Creating socket for the server
    ServerSocket serverSocket(port);

    // Creating a threadManager with task for handaling the clients
    ThreadPool threadManager(handleClient);

    // Handle incoming clients in a loop
    while (true) {
        try {
            int clientSocket = serverSocket.acceptClient();
            threadManager.start(clientSocket);
        } catch (const std::exception& ex) {
            std::cerr << "Error accepting client: " << ex.what() << std::endl;
        }
    }
    
    return 0;
}