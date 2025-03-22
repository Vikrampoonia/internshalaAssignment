# internshalaAssignment
deployment link: https://internshala-assignment-vikrams-projects-4bf2c346.vercel.app
Things required for setup in your local machine:
1)Must have nodeJs installed 
2) Clone this project 
3)use npm install command to install all dependencies
4) use your own database password then change password value into .env file
5) put your own database name 
6) use same name of database or want to use different then change to app.js
7) make schools table in database
8) variable use in schools table:
id (VARCHAR)(Primary Key)
name (VARCHAR)
address (VARCHAR)
latitude (FLOAT)
longitude (FLOAT)


There are two api:
1) '/addSchool' ,method="POST" data pass in this api are: name,address,latitude,longitude 
    in response it give you unique id of this new insert post
2) '/listSchools', method="GET" data pass in this api are: latitude and longitude
    it return all school data sort on the basis distance(using Haversine formula)



