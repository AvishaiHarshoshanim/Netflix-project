#ifndef THREADPOOL_H
#define THREADPOOL_H

#include <vector>
#include <thread>
#include <queue>
#include <functional>
#include <mutex>
#include <condition_variable>
#include "IThread.h"

class ThreadPool : public IThread {
public:
    ThreadPool(std::function<void(int)> task);
    ~ThreadPool();

    void start(int clientSocket) override; // Accept client tasks
    void stop();                  // stop the pool

private:
    void worker(); // Worker thread function

    std::vector<std::thread> workers;
    std::queue<std::function<void()>> taskQueue;
    std::mutex queueMutex;
    std::condition_variable condition;
    bool stopFlag = false;
    std::function<void(int)> taskFunction; // Function to handle each client
};

#endif
