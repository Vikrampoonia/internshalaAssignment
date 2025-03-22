import express, { json } from 'express'
import cors from 'cors'
import mysql from 'mysql2'
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

const app=express();

app.use(express.json())
app.use(cors())
const dbPassword = process.env.DB_PASSWORD;

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'internshala-internshala.f.aivencloud.com',
    user: 'avnadmin',
    password: dbPassword,
    database: 'school_management',
    port: 27102 
});

db.connect(err => {
    if (err) 
    {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

/*
CREATE TABLE schools (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    address VARCHAR(255),
    latitude FLOAT,
    longitude FLOAT
);
*/

/*
id (Primary Key)
name (VARCHAR)
address (VARCHAR)
latitude (FLOAT)
longitude (FLOAT)
*/


function validateSchoolData(name, address, latitude, longitude) 
{
    if (!name || typeof name !== 'string' || name.trim() === '') 
        return 'Invalid name: must be a non-empty string';
    if (!address || typeof address !== 'string' || address.trim() === '') 
        return 'Invalid address: must be a non-empty string';
    if (latitude === undefined || longitude === undefined) 
        return 'Latitude and longitude are required';
    if (isNaN(latitude) || latitude < -90 || latitude > 90) 
        return 'Invalid latitude: must be a number between -90 and 90';
    if (isNaN(longitude) || longitude < -180 || longitude > 180) 
        return 'Invalid longitude: must be a number between -180 and 180';

    return false;
}




//add new school
app.post("/addSchool",async(req,res)=>{
    
    const id = uuidv4();
    console.log(id);
    const {name, address, latitude, longitude}=req.body;

    const validatError=validateSchoolData(name, address, latitude, longitude);

    //validation
    if(validatError)
        return res.status(400).json({"message":validatError});


    const query = 'INSERT INTO schools (id, name, address, latitude, longitude) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [id, name, address, latitude, longitude], (err, result) => {
        if (err) 
            return res.status(500).json(
                                        { 
                                            message: 'Database error', 
                                            error: err 
                                        });
        res.status(201).json({ message: 'School added successfully', schoolId: id });
    });

})

function getDistance(lat1, lon1, lat2, lon2) {
    const toRadians = (degree) => (degree * Math.PI) / 180;

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
}



//schools list

app.get("/listSchools",async(req,res)=>{
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);

    console.log("latitude: "+latitude +"  longitude: "+longitude + "  "+typeof(latitude)+ "  "+typeof(longitude));

    if (isNaN(latitude) || isNaN(longitude))
        return res.status(400).json({ message: 'Latitude and longitude are required and must be valid numbers' });
    
    const query = 'SELECT * FROM schools';
    db.query(query, (err, results) => {
        if (err) 
            return res.status(500).json({ message: 'Database error', error: err });
        console.log("results: "+results);
        results.forEach(school => {
            school.distance = getDistance(parseFloat(latitude), parseFloat(longitude), school.latitude, school.longitude);
        });
        results.sort((a, b) => a.distance - b.distance);
        res.status(200).json(results);
    });



})


const PORT=4000;
app.listen(PORT,()=>{
    console.log(`http://192.168.29.97:${PORT}`);
})



