# Netflix Project

This project is a Netflix-inspired web and mobile application designed to simulate a streaming platform experience. It features a clean, responsive interface, dynamic content display, and smooth user interactions. Built as a learning project, it focuses on practicing modern development techniques and creating a consistent experience across web and mobile platforms.

![netflix web gif high](https://github.com/user-attachments/assets/7b59310e-2c82-4329-8a51-9e1852a7be2d)
![neflix app gif](https://github.com/user-attachments/assets/b4f893a0-f15a-47e1-8f6e-758cc3f3fd5c)

## Setup and Usage Instructions
### Prerequisites
Before you begin, make sure you have the following:

- A Windows operating system.
- Docker Desktop installed and running.
- The repository cloned to your computer.

---
  
## How to Use
1. Navigate to the Repository Folder:
Open Command Prompt (not PowerShell) and go to the folder where the netflix-project repository is located.

2. Start Docker:
Ensure Docker Desktop is running on your computer.

3. Set the ENV file and other Environment variables:
  - Step 1: 
   Make sure that the "webServer" folder in your repository folder contains a "config" folder, and in that folder, there is a file named .env.local with the following content:
      ```bash
      CONNECTION_STRING=mongodb://mongodb:27017/my_database
      ```
   Create config.js inside the config folder with the followin content:
   
      
        require("dotenv").config({ path: "./config/.env.local" });
        const config = {
            connectionString: process.env.CONNECTION_STRING || "mongodb://localhost:27017/default_db",
            secretKey: process.env.SECRET_KEY || "defaultSecretKey",
        };
        module.exports = config;
        
  - Step 2: Set the Ports for the web Server Connections:
      Set the port that you want the web server to listen to in the Environment Variable USER_TO_WEB_PORT:
     ```bash
     set USER_TO_WEB_PORT=<put the port here (e.g. 5000 (we recommended 5000))>
     ```
     Set the port between the recommendations server and the web server in the Environment Variable REC_TO_WEB_PORT:
     ```bash
     set REC_TO_WEB_PORT=<put the port here (e.g. 8080)>
     ```
     We give the flexibility to choose the port here, as it may sometimes be occupied or blocked, requiring you to run the program again with a different port.
4. Running the Program:
Execute the following commands in Command Prompt for running the web server:

  - Step 1: Build the web server:
     ```bash
     docker-compose build
     ```
  - Step 2: Run the web server:
     ```bash
     docker-compose up
     ```
  - Step 3: Connect the web server using React client:
     Go to the web_app folder:
     ```bash
     cd web_app
     ```
     Set the port that you used for the web server to listen to in the Environment Variable REACT_APP_USER_TO_WEB_PORT:
     ```bash
     set REACT_APP_USER_TO_WEB_PORT=<same as USER_TO_WEB_PORT>
     ```
     Install the dependencies:
     ```bash
     npm install
     ```
     Start the React client:
     ```bash
     npm start
     ```
  - Step 4: Connect the web server using React client:
     for this step you need to run the web server on port 5000 (USER_TO_WEB_PORT=5000).
     Open the android_app folder in Android Studio and run the app in the emullator.
   ### Note
  The admin permission provided to the user that his username is the one defined in the webServer/controllers/users.js file in line 30.
  
  - Step 5: Stoping the web server and removing the containers:
     ```bash
     docker-compose down
     ```
5. Running the tests for the recommendation server
To build and run the test container, use these commands:

  - Build the test Docker image:
    ```bash
    docker build -t test-runner -f recServer/tests/Dockerfile .
    ```
  - Run the tests:
    ```bash
    docker run --rm test-runner
    ```
