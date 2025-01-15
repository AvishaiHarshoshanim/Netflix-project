#ifndef REGULARTHREAD_H
#define REGULARTHREAD_H

#include <thread>
#include <functional>
#include "IThread.h"

class regularThread : public IThread {
private:
    // Task to handle
    std::function<void(int)> task;

public:
    // Constructor takes a task function and its argument
    explicit regularThread(std::function<void(int)> taskFunc);
    void start(int arg) override;
};

#endif // REGULARTHREAD_H
