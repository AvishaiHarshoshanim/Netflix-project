import socket
import sys
import re

def main():

    if len(sys.argv) != 3:
        print("Usage: python3 client.py <server_ip> <server_port>")
        sys.exit(1)  # Exit with an error if there are not enough arguments

    # Reading the arguments from main
    SERVER_IP = sys.argv[1]
    SERVER_PORT = int(sys.argv[2])  # Conversion from string to int for the port

    # Creating a socket
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Connecting to the server
    client_socket.connect((SERVER_IP, SERVER_PORT))

    # Initial message from the user
    # What the user types will be saved in the 'message' variable
    message = input()

    # The loop continues until the 'quit' input is received
    while not message == 'quit':
        client_socket.send((message + "\n").encode())
        # Receive a response from the server
        response = client_socket.recv(4096).decode()
        print(response, end="")
        # New message from the user
        message = input()

    # Send "quit" to the server
    client_socket.send(message.encode())

    # Closing the socket
    client_socket.close()

if __name__ == "__main__":
    main()