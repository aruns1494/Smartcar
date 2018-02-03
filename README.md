# Smartcar API

This is an application programming interface that provides users with insights into their vehicle's performance. It's one way of letting the users interact with their vehicle's data and make sense out of it. Overtime these API sources can be made available to other developers, so that they could build meaningful applications on top of the existing interface. These APIs are platform independent and the developers can gain access to data from multiple car companies.

# Feature List

 - Retrieve vehicle information such as color, type of car and engine information
 - Obtain the security status of the vehicle by checking whether all doors are locked or not
 - Allows the user to check the fuel tank level and battery level
 - Can start/stop engine from any location
 
# Dependencies
body-parser@^1.18.2
config@^1.29.2
dotenv@^4.0.0
express@^4.16.2
helmet@^3.10.0
moment@^2.20.1
node-fetch@^1.7.3
simple-node-logger@^0.93.33
swagger-ui-express@^2.0.15
throw.js@^3.0.1
uuid@^3.2.1

## Dev Dependencies
chai@^4.1.2
chai-http@^3.0.0
mocha@^5.0.0
nodemon@^1.14.11

## Steps To Install And Run

 1. Clone directory
 2. Install all dependencies by running npm install
 3. Start server by running npm start
 4. Run test scripts by running npm test

## Documentation

The entire documentation for the API was done using Swagger. Once you start the npm server on port 3000, go to the following link to access the API documentation. The npm servers can be customized to start on multiple ports, just by writing a configuration file. I have not committed that file( .env) to the git, but the test environment config and the development enivorment configuration has been pushed to repository.

Refer to the Swagger  documentation by accessing the following URL, http://localhost:3000/api-docs

## Environments

I have instantiated two environments for the current application, one being development environment and the other being test. Each has its own configuration, but these files can always be edited, so that you don't have to make any changes to code. For now, each environment has its own Database and port number, but since most of the data was available from third-party services, I didn't have to use the database at all. When running test scripts, the application automatically switches to the test environment.

## Logging

Enabled logging at two levels, and one is the information level and the other is error level. The logging takes  place in two separate files and for each day a new log file gets generated. Every log file has got a unique ID which would help developers/testers spot the errors better. Each environment has its own log file and that would in essence make sure that logs from the development environment don't overlap onto the ones from the test environment.

## Authentication Token

The module for checking the authentication token from the request header has been built, but is not in use because the third party APIs didn't require one.

## Docker

Created two docker images one for test and one for development environment. Will upload on an Amazon instance if needed.

## Test Scripts

Totally, sixteen different test cases have been written for this application using Chai framework. Followed a complete TDD/BDD process to develop these APIs. So, the test scripts were first coded, and then the development followed.


