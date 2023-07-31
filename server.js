const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// Uses inquirer to perform the initial prompt
function prompt() {
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
                    'Update an employee role',
                    'Exit'
                ]
            }
        ])
        .then((data) => {
            switch (data.option) {
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
                case 'Exit':
                    db.end();
                    break;
            }
        });
}

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'vegetable',
        database: 'company_db'
    }
);
prompt();

// querys database and shows data then prompts user
async function showData(sql) {
    try {
        const [results] = await db.promise().query(sql);
        console.table(results);
    } catch (err) {
        console.log(err);
    }
    prompt();
}


function viewDepartments() {
    console.log('\nDisplaying all departments: \n ');
    const sql = `SELECT *
                FROM departments;`
    showData(sql);
}

function viewRoles() {
    console.log('\nDisplaying all roles: \n ');
    const sql = `SELECT 
                        roles.id,
                        title, 
                        departments.name AS department, 
                        salary
                FROM roles 
                JOIN departments
                ON roles.department_id = departments.id`;
    showData(sql);
}

function viewEmployees() {
    console.log('\nDisplaying all employees: \n ');
    const sql = `SELECT 
                        employees.id,
                        employees.first_name,
                        employees.last_name,
                        roles.title,
                        departments.name AS department,
                        roles.salary,
                        CONCAT(manager.first_name, " ",manager.last_name) as manager
                FROM employees
                JOIN roles 
                ON employees.role_id = roles.id
                JOIN departments
                ON roles.department_id = departments.id
                LEFT JOIN employees manager
                ON employees.manager_id = manager.id`;
    showData(sql);
}

function addADepartment() {
    console.log('\nAdding department: \n ');
    inquirer.
        prompt([
            {
                type: "input",
                name: 'name',
                message: 'Please enter name of department: '
            }
        ])
        .then((data) => {
            const sql = `INSERT INTO departments (name)
                        VALUES ("${data.name}");`

            db.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log();
                console.log(`Added ${data.name} to the database`);
            });

            prompt();
        });

}

function addRole() {
    console.log('\nAdding role: \n ');
    inquirer.
        prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Please enter name of role: '
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Please enter salary: '
            },
            {
                type: 'input',
                name: 'department',
                message: 'Please enter department: '
            }
        ])
        .then((data) => {
            const sql1 = `SELECT id FROM departments
            WHERE  departments.name = ? ;`
            const args = [data.name, data.salary];
            db.promise().query(sql1, data.department)
                .then((data) => {
                    args.push(data[0][0].id);
                    
                    const sql2 = ` 
                        INSERT INTO roles (title,salary,department_id)
                        VALUES (?,?,?);`;

                    db.query(sql2, args,
                        (err, results) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            console.log();
                            console.log(`Added ${args[0]} to the database`);
                        });

                    prompt();
                });
        });
}

function addEmployee() {

}

function updateEmployee() {

}

function updateEmployeeRole() {

}