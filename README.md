# C6

This is where the C6 Collective app lives.

## Setup
1. Clone this repo with:
    ```bash
    git clone https://github.com/jkprow/c6
    ```

2. Install Docker and Docker compose by following [these instructions](https://docs.docker.com/v17.12/install/).
We use Docker to manage infrastructure (both the database and server run in isolated containers).

3. Create a .env file in the root of the project with the following contents:
    ```sh
    S3_ACCESS_KEY=XXX
    S3_ACCESS_SECRET=XXX
    S3_BUCKET=XXX
    S3_PUBLIC_FOLDER=XXX
    
    NODE_ENV=development
    NODE_PORT=3000
    
    POSTGRES_PORT=5432
    POSTGRES_HOST=postgres
    POSTGRES_DB=c6
    POSTGRES_USER=XXX
    POSTGRES_PASSWORD=XXX
    ```
    Note that all variables with the value "XXX" must be configured for each environment.

4. Start the system with:
    ```
    docker-compose up
    ```

This will install the project's dependencies, build the database, and start the server on page 3000.

At this point, you should be able to navigate to http://localhost:3000/provider to interact with the provider portal.