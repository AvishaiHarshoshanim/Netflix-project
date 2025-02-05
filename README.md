# Netflix Project - Setup and Usage Instructions
## Prerequisites
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
   ### important
   This server setup contains a setup to a default DB of the project that we made so you dont need to create the DB from scratch. the DB contains 9 movies and two signed up users: 1. username: 'admin' password Aa123456 2. username: 'user1' password: Aa123456. the admin have admin permissions, the admin permission provided to the user that his username is the one defined in the webServer/controllers/users.js file in line 30.
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
## Basic Explanations About Our Code
In our program, to make a POST request for a movie, all fields must be provided, as shown in the example execution. For the categories field, an array of the desired category names should be provided. However, when the movie is saved in the database, an array of category objects will be stored.

Additionally, it is not possible to create two movies with the same name. Similarly, to create a new user, a unique email and unique username must be provided; otherwise, an error will be displayed.

To create a new category, only its name needs to be provided. If the promoted field is not included, it will default to false.

## Screenshots
### UML Diagram:
![WhatsApp Image 2024-12-18 at 17 35 17](https://github.com/user-attachments/assets/2b2df4f2-3f28-4e4d-8d93-eba199fbd098)

### Running the Program:
![RunExample4](https://github.com/user-attachments/assets/7318b8a7-ad57-481f-aa61-05462a4454c9)
![RunExample6](https://github.com/user-attachments/assets/9e46ae77-91da-4033-8375-bf69f2b92509)
![RunExampl10](https://github.com/user-attachments/assets/4efa11cb-6a81-4aae-b8f3-5833e34b0dad)
![RunExample11](https://github.com/user-attachments/assets/e46b9dfe-653e-46d4-92a2-b11d21fc48cd)
![RunExample12](https://github.com/user-attachments/assets/fa91be91-fbb0-4741-813e-ba8feca1426d)
![RunExample13](https://github.com/user-attachments/assets/ce9a3e73-ceed-45fc-a688-573dc56146ff)
![RunExample14](https://github.com/user-attachments/assets/de43f9fe-4904-466e-a633-cd8cedaeefa5)
![RunExample15](https://github.com/user-attachments/assets/458c28c6-10ed-484a-8886-614f240e84d3)
![RunExample16](https://github.com/user-attachments/assets/fe858f1a-8bef-48dd-ab9f-414771bf782e)
![RunExample7](https://github.com/user-attachments/assets/3056a127-5e05-420b-bf56-a4f8ea726cd4)
![RunExample8](https://github.com/user-attachments/assets/81375efe-a070-45bf-ad25-727219613413)
![RunExample9](https://github.com/user-attachments/assets/e2486b5d-b91a-4fa7-8dab-2568c996ffcb)
![RunExample17](https://github.com/user-attachments/assets/34c09929-1c39-4291-84d2-8e8243af2352)
![RunExample18](https://github.com/user-attachments/assets/2f517219-7eb0-453e-99f9-463878cb248b)
![RunExample19](https://github.com/user-attachments/assets/0dbf345c-fadb-4e2d-b4a7-4ee9a1a61ab3)
![RunExample20](https://github.com/user-attachments/assets/9016a26c-33e3-4ca2-8d5b-e310be52b780)
![RunExample21](https://github.com/user-attachments/assets/c8ba8aa9-2a67-4bdf-9304-dcebaa6b9c45)
![RunExample22](https://github.com/user-attachments/assets/9bc6c0cc-97d5-4a23-905a-132e59bee921)
![RunExample23](https://github.com/user-attachments/assets/64f40842-4b0a-4d65-b090-fc0d383479cd)
![RunExample24](https://github.com/user-attachments/assets/269633fa-a4c6-4c76-bf54-87313c58c330)
![RunExample25](https://github.com/user-attachments/assets/61e3a516-0ec3-4350-a8aa-b49cb695914a)

### Running the Test:
<img width="587" alt="image" src="https://github.com/user-attachments/assets/d23b6f93-3d42-4a35-a78a-ad6313d900d7" />

![TestExample2](https://github.com/user-attachments/assets/d5e98856-b57c-4252-bce2-533879e64904)
