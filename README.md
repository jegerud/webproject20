# Prosjekt - PROG2053

## Installation notes: 
- Install nodeJs
- Run "npm i" in both the server and client folders of the project.    
- While in the root folder of the project: "docker-compose up -d" - this will take a long time the first time you do it.
- Are you getting an error after doing "docker-compose up -d", saying "[...] Filesharing has been cancelled"? 
-> Go to Docker for Windows app (or similar) -> Settings -> Resources -> File sharing -> Add all your drives (or play around with figuring out what exactly you need).
- Are you getting an error saying "npm ERR! ch() never called"? 
-> Delete "package-lock.json" from the client directory, then build the client again using "docker-compose build client"

Want to reset your containers and volumes fully? 
- "docker system prune -a --volumes"

Want to get in to a container for some reason? 
- "docker-compose exec <containername> bash" 

## Group members:     
Casper Gulbrandsen, Kristoffer Haugen, Kristian Jegerud and Mads Nekkøy.
   
## Setup: 
- docker-compose up -d   

The project runs on localhost:8080

## How to use the application:

- Registrer a new profile. This profile will automatically be a user.
- Write a new post, or read through the others and like/dislike them. You can also comment on the posts by clicking the title of a chosen post.
- Search through the posts by using the searchbar on the top. 
- Edit your posts, or profile. Change picture, password, username, email, or just get your info from the profileside.

- Change the profile to have a different usertype in the database.
SQL statement: UPDATE `users` SET `userType` = "admin/moderator" WHERE `uid` = 3

- The different usertypes have different rights as described in the given assignment. The different usertypes should do everything that is described in the assignment.


