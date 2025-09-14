# Real-Time Polling Application API

This project implements a real-time polling application backend using Node.js, Express, PostgreSQL, Prisma, WebSockets, and JWT for authentication.

## Technologies Used

- **Backend Framework**: Node.js with Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time Communication**: Socket.io (WebSockets)
- **Authentication**: JSON Web Tokens (JWT)

## Core Features

- **RESTful API**: CRUD operations for Users, Polls, and Votes, with protected routes.
- **Authentication**: Secure user registration and login using JWT.
- **Database Schema**: Designed with Prisma, including one-to-many and many-to-many relationships.
- **Real-time Updates**: Live poll results broadcasted via WebSockets when a vote is cast.

## Setup and Installation

Follow these steps to get the project up and running:

1.  **Clone the repository** (if applicable):

    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install Dependencies**:

    ```bash
    npm install
    ```

3.  **Database Setup**:

    a.  **Install PostgreSQL**: Ensure you have PostgreSQL installed and running on your system. You can download it from [PostgreSQL official website](https://www.postgresql.org/download/).

    b.  **Create a Database**: Create a new PostgreSQL database for this project. For example, `polling_app_db`.

    c.  **Configure Environment Variables**: Create a `.env` file in the root directory of the project and add your database connection string and JWT secret:

        ```
        DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
        JWT_SECRET="your_super_secret_jwt_key"
        ```
        Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your PostgreSQL credentials and database name. Replace `your_super_secret_jwt_key` with a strong, unique secret for JWT.

    d.  **Run Prisma Migrations**: Apply the Prisma schema to your database:

        ```bash
        npx prisma migrate dev --name init
        ```
        This command will create the necessary tables in your PostgreSQL database.

4.  **Start the Server**:

    ```bash
    npm start
    ```

    The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## Authentication

This API uses JSON Web Tokens (JWT) for authentication. To access protected routes, you must first log in to obtain a JWT token.

### Obtaining a JWT Token

1.  **Register a User** (if you haven't already):
    *   **Method:** `POST`
    *   **URL:** `http://localhost:3000/users/register`
    *   **Body (raw, JSON):**
        ```json
        {
            "name": "Test User",
            "email": "test@example.com",
            "password": "password123"
        }
        ```

2.  **Login User**:
    *   **Method:** `POST`
    *   **URL:** `http://localhost:3000/users/login`
    *   **Body (raw, JSON):**
        ```json
        {
            "email": "test@example.com",
            "password": "password123"
        }
        ```
    *   The response will include a `token`. Copy this token.

### Using the JWT Token

Include the obtained JWT token in the `Authorization` header of your requests to protected routes:

`Authorization: Bearer YOUR_JWT_TOKEN`

## API Endpoints

### Users

-   `POST /users/register`: Register a new user.
    -   Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
-   `POST /users/login`: Login an existing user and receive a JWT token.
    -   Body: `{ "email": "john@example.com", "password": "password123" }`
-   `GET /users` (Protected): Get all users.
-   `GET /users/:id` (Protected): Get a single user by ID.

### Polls

-   `POST /polls` (Protected): Create a new poll.
    -   Body: `{ "question": "What is your favorite color?", "options": ["Red", "Blue", "Green"], "creatorId": "<userId_from_jwt>" }`
-   `GET /polls` (Protected): Get all polls.
-   `GET /polls/:id` (Protected): Get a single poll by ID.

### Votes

-   `POST /votes`: Submit a vote for a poll option.
    -   Body: `{ "userId": "<userId>", "pollOptionId": "<pollOptionId>" }`

## WebSocket Events

-   **`joinPoll`**: Clients can join a specific poll room to receive updates.
    -   Emit: `socket.emit('joinPoll', 'pollId')`
-   **`leavePoll`**: Clients can leave a specific poll room.
    -   Emit: `socket.emit('leavePoll', 'pollId')`
-   **`pollUpdate`**: Server broadcasts updated poll results to clients in a poll room.
    -   Receive: `socket.on('pollUpdate', (updatedPollData) => { ... })`