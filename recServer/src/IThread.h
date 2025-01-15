#ifndef ITHREAD_H
#define ITHREAD_H

class IThread {
public:
    virtual ~IThread() = default;

    // Starts a thread and executes the task
    virtual void start(int arg) = 0;

};

#endif // ITHREAD_H
