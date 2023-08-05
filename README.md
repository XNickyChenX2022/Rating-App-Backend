# Rating-App-Backend
# I. Background
This is the backend repository for MyGamesCollection.   
To view the the frontend and the background regarding this project, please visit: https://github.com/XNickyChenX2022/MyGamesCollection  
For the website, use this link:https://xnickychenx2022.github.io/MyGamesCollection
# II. Backend
* implemented jwt for user authentication
* scraped the IGDB api for over 70,000 games to be stored in MongoDB
* implemented webhooks to continually update and add new games
* implemented redis for storing access tokens that are necessary for accessing the IGDB api
* set up webhooks to have the MongoDB database stay up to date with new available games/dlcs/etc...
* Used Mongoose(ODM) as implement a user, friend request, and game review schemas
* implements error handling for Express.js
* implements middleware to protect certain routes from unauthenticated users
* implemented an api with 3 main functions
  * users-related functionalities
    * generates jwt for user authentication and sends jwt to the client to be stored as a cookie
    * login, register, logout (removes jwt)
    * includes endpoints to update and retrieve one's profile
  * game-related functionalities
    *  query the MongoDB database for games by name
    *  add/remove games to one's game collection
    *  retrieve all games from one's collection
    *  rate a game (uses regex to insert valid numbers)
    *  inserts and updates the review on a game 
  * friend-related functionalities
    *  sending friend request
    *  accepting/rejecting friend requests
    *  retrieving friends list and friend's list of games 
