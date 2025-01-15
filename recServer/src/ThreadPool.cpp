#include "ThreadPool.h"
#include <iostream>

ThreadPool::ThreadPool(std::function<void(int)> task) : taskFunction(task), stopFlag(false) {
    // Start the worker threads
    for (int i = 0; i < 5; ++i) {
        workers.emplace_back([this] { this->worker(); });
    }
}

ThreadPool::~ThreadPool() {
    stop();
}

void ThreadPool::start(int clientSocket) {
    {
        std::lock_guard<std::mutex> lock(queueMutex);
        taskQueue.push([this, clientSocket] { taskFunction(clientSocket); });
    }
    // Notify one thread to start processing the task
    condition.notify_one();
}

void ThreadPool::stop() {
    {
        std::lock_guard<std::mutex> lock(queueMutex);
        stopFlag = true;
    }
    // Wake up all threads to stop processing
    condition.notify_all();
    for (std::thread& worker : workers) {
        if (worker.joinable()) {
            // Wait for each worker thread to finish
            worker.join();
        }
    }
}

void ThreadPool::worker() {
    while (true) {
        std::function<void()> task;

        {
            std::unique_lock<std::mutex> lock(queueMutex);
            condition.wait(lock, [this] { return stopFlag || !taskQueue.empty(); });

            // Exit the worker thread if stopping and no tasks left
            if (stopFlag && taskQueue.empty()) {
                return;
            }

            task = std::move(taskQueue.front());
            taskQueue.pop();
        }

        // Execute the task
        task(); 
    }
}
