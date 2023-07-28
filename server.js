const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());




// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'vegetable',
        database: 'employee_db'
    },
    console.log(`Connected to the movies_db database.`)
);

// Default reponse for not found request
app.use((req, res) => {
    res.status(404).end();
});

// Binds and listen for port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});