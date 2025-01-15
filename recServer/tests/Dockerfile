FROM gcc:latest as build

RUN apt-get update && apt-get install -y cmake
    
WORKDIR /mytest

COPY recServer/src /mytest/src
COPY recServer/tests/test_set.cpp /mytest
COPY recServer/tests/CMakeLists.txt /mytest

RUN cmake -S . -B build && \
    cmake --build build

# Run tests
CMD ["ctest", "--output-on-failure", "-C", "Debug", "--test-dir", "/mytest/build"]