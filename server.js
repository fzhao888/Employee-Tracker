const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Uses inquirer to perform the initial prompt
inquirer.
    prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Please choose an option: ',
            choices: [
                'View all department',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role'
            ]
        }
    ])
    .then((data) => {
        switch(data.option){
            case 'View all department':
                break;
            case 'View all roles':
                break;
            case 'View all employees':
                break;
            case 'Add a department':
                break;
            case 'Add an employee':
                break;
            case 'Update an employee role':
                break;
        }
    });

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