cmake_minimum_required(VERSION 3.14)
project(tests)

# Use C++17
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Fetch GoogleTest
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/heads/main.zip
)
# Prevent overriding the parent project's compiler/linker settings
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# Enable testing
enable_testing()

include_directories(src/)

# Add the executable for tests
add_executable(
  test_set
  test_set.cpp
  src/Update.cpp
  src/Get.cpp
  src/Patch.cpp
  src/Post.cpp
  src/Delete.cpp
  src/FileUtils.cpp
  src/Validator.cpp
  src/SocketReciver.cpp
  src/SocketTransmitter.cpp
  src/ServerSocket.cpp
  src/app.cpp
  src/Help.cpp
  src/regularThread.cpp
)

# Link GoogleTest libraries
target_link_libraries(
  test_set
  GTest::gtest_main
)

# Discover GoogleTest tests
include(GoogleTest)
gtest_discover_tests(test_set)