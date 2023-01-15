# restaurantApp

An backend app for user registration, login, logout, and for getting the restaurants near a location (city or coordinates).

# Technologies used

- JavaScript
- Node.js
- Postgresql
- Express

# Run project

## Requirements

- [**Node JS**](https://nodejs.org/es/download/)
- [**Postgresql**](https://www.postgresql.org/download/) or [**RDS**](https://aws.amazon.com/es/rds/postgresql/)
- [**Google Cloud Api Key**](https://developers.google.com/maps/documentation/places/web-service/cloud-setup)

## Steps

1. Clone the repository
2. Start running your database locally or in cloud service as RDS
3. Execute the ./sql.dump file to create the SQL schema
4. Create a .env file inside the backend directory, with the following variables:
   - DB_USER : The database user of step 2.
   - DB_HOST : The database host of step 2.
   - DB_DATABASE : The name of the database of step 2.
   - DB_PASSWORD : The database password of step 2.
   - DB_PORT : The port where database of step 2 is running.
   - JWT_ACCESS_SECRET : A secure string to generate the access JWT.
   - JWT_REFRESH_SECRET : A secure string to generate the refresh JWT.
   - GOOGLE_API_KEY : Your google cloud API key, enabled for [**places**](https://developers.google.com/maps/documentation/places/web-service/search-nearby#maps_http_places_nearbysearch-postman) and [**geocoding**](https://developers.google.com/maps/documentation/geocoding/start) queries.
5. Install backend dependencies and start running the backend project:

```
npm install
npm start
```

6. You could test the queries using [**postman**](https://www.postman.com/downloads/) importing the ./restaurantApp.postman_collection.json, this collection have all the REST queries of this project. Remember replacing the access or refresh token on the authorization tab. (Only when it's necessary)

# Run tests

## Requirements

- [**Node JS**](https://nodejs.org/es/download/)
- [**Postgresql**](https://www.postgresql.org/download/) or [**RDS**](https://aws.amazon.com/es/rds/postgresql/)
- [**Google Cloud Api Key**](https://developers.google.com/maps/documentation/places/web-service/cloud-setup)

## Steps

1. Clone the repository
2. Start running your test database locally or in cloud service as RDS
3. Execute the ./sql.dump file to create the SQL schema
4. Create a .env.test file inside the backend directory, with the following variables:
   - DB_USER : The database user of step 2.
   - DB_HOST : The database host of step 2.
   - DB_DATABASE : The name of the database of step 2.
   - DB_PASSWORD : The database password of step 2.
   - DB_PORT : The port where database of step 2 is running.
   - JWT_ACCESS_SECRET : A secure string to generate the access JWT.
   - JWT_REFRESH_SECRET : A secure string to generate the refresh JWT.
   - GOOGLE_API_KEY : Your google cloud API key, enabled for [**places**](https://developers.google.com/maps/documentation/places/web-service/search-nearby) and [**geocoding**](https://developers.google.com/maps/documentation/geocoding/start) queries.
   - TEST="True"
5. Install backend dependencies and start executing the test:

```
npm install
npm run test
```
