# Rating-App-Backend
# I. Background
This is the backend repository for MyGamesCollection.   
To view the the frontend and the background regarding this project, please visit: https://github.com/XNickyChenX2022/MyGamesCollection  
For the website, use this link:https://xnickychenx2022.github.io/MyGamesCollection
# II. Backend
* Implemented JWT user authentication
* Scraped and stored 70,000+ games from IGDB API into MongoDB
* Utilized webhooks for continuous updates and new game additions
* Employed Redis for managing IGDB API access tokens
* Set up MongoDB to stay updated with new games, DLCs, etc.
* Used Mongoose (ODM) for user, friend request, and game review schemas
* Implemented Express.js error handling middleware
* Created middleware to protect routes from unauthenticated access including routes accessible by logged in users and friends.
* Designed API with 3 main functions:
  * Users:
    * Generate and send JWT for user authentication
    * Login, register, and logout with JWT management
    * Endpoints for profile update and retrieval
  * Games:
    * Query MongoDB for games by name
    * Add/remove games to user's collection
    * Retrieve all games from user's collection
    * Rate games with validation
    * Insert and update game reviews
  * Friends:
    * Send/receive/accept/reject friend requests
    * Retrieve user's friends list and their game collections
