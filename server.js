const mysql = require('mysql2');
const inquirer = require('inquirer');

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
                viewDepartments();
                break;
            case 'View all roles':
                viewRoles()
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addADepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
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
    console.log(`Welcome to the Employee Manager!`)
); 

function viewDepartments() {

}

function viewRoles() {

}

function viewEmployees() {

}

function addADepartment() {

}

function addRole() {

}

function addEmployee() {

}

function updateEmployee() {

}

function updateEmployeeRole() {

}