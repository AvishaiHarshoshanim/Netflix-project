#include "regularThread.h"

// initializes the task and its argument
regularThread::regularThread(std::function<void(int)> taskFunc) : task(std::move(taskFunc)) {}

// Start the thread with a stored task and an argument
void regularThread::start(int arg) {
    // Create the thread
    std::thread clientThread(task, arg);
    // Start te client and kill the thread when it done
    clientThread.detach();
}
