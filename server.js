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

//querys and displays everything in departments
function viewDepartments() {
    console.log('\nDisplaying all departments: \n ');
    const sql = `SELECT *
                FROM departments
                ORDER BY name ASC;`
    showData(sql);
}

//querys and displays roles
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
                        CONCAT(managers.first_name, " ",managers.last_name) as manager
                FROM employees
                JOIN roles 
                ON employees.role_id = roles.id
                JOIN departments
                ON roles.department_id = departments.id
                LEFT JOIN employees managers
                ON employees.manager_id = managers.id`;
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
    // prompts user for role name, salary, and department name
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
            //gets department id from department name prompt
            const sql1 = `SELECT id FROM departments
            WHERE  departments.name = ? ;`
            // stores the args used for the final prepared statement
            const args = [data.name, data.salary];

            db.promise().query(sql1, data.department)
                .then((data) => {
                    args.push(data[0][0].id);
                    // inserts role
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
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Please enter first name: '
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Please enter last name: '
            }
        ])
        .then((data) => {
            // stores args for final prepared statement
            const args = [data.first_name, data.last_name];

            const sql1 = `SELECT title 
                          FROM roles`;

            db.promise().query(sql1)
                .then((data) => {
                    // prompt for role
                    let rolesArr = [];
                    for (let i = 0; i < data[0].length; i++) {
                        rolesArr.push(data[0][i].title);
                    }

                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'title',
                                message: `Which is the employee's role? `,
                                choices: rolesArr
                            }
                        ])
                        .then((data) => {
                            // gets role id using prompted role name
                            const sql2 = `SELECT id
                                          FROM roles
                                          WHERE roles.title = "${data.title}";`
                            db.query(sql2, (err, results) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                // adds role id to args array
                                args.push(results[0].id);
                            });

                            // gets list of managers' full name
                            const sql3 = `SELECT CONCAT(first_name, " " , last_name) AS manager
                                          FROM employees ;`;
                            db.query(sql3, (err, results) => {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                // stores an array of manager full names
                                const managerArr = ['None'];

                                for (let i = 0; i < results.length; i++) {
                                    managerArr.push(results[i].manager);
                                }

                                inquirer
                                    .prompt([
                                        {
                                            type: 'list',
                                            name: 'manager',
                                            message: "Who is the employee's manager? ",
                                            choices: managerArr
                                        }

                                    ])
                                    .then((data) => {
                                        // query for manager id 
                                        const sql4 = `SELECT employees.id
                                                  FROM employees
                                                  WHERE CONCAT(employees.first_name," ",employees.last_name) = "${data.manager}"`;

                                        db.query(sql4, (err, results) => {
                                            if (err) {
                                                console.log(err);
                                                return;
                                            }

                                            if (results.length === 0) {
                                                args.push(null);
                                            } else {
                                                args.push(results[0].id);
                                            }

                                            // adds new employee
                                            const sql5 = `INSERT INTO employees(first_name, last_name, role_id, manager_id)
                                        VALUES (?,?,?,?);`

                                            db.query(sql5, args,
                                                (err, results) => {
                                                    if (err) {
                                                        console.log(err);
                                                        return;
                                                    }
                                                    const name = args[0] + " " + args[1];
                                                    console.log(`Successfully added ${name} to the database.`);
                                                    console.log();
                                                    prompt();
                                                });
                                        });
                                    })
                            });

                        })
                });

        })

}

function updateEmployeeRole() {

    //query for list of all employees
    const employeeArr = [];
    const sql1 = `SELECT CONCAT (first_name," ",last_name) AS name
                  FROM employees;`

    db.promise().query(sql1)
        .then((data) => {
            for (let i = 0; i < data[0].length; i++) {
                employeeArr.push(data[0][i].name);
            }

            // prompts for employee
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: "Which employee's role do you want to update?",
                        choices: employeeArr
                    },

                ])
                .then((data) => {
                    // get role id 
                    const roleArr = [];
                    const sql2 = `SELECT title 
                                  FROM roles;`;
                    db.promise().query(sql2)
                        .then((results) => {
                            for (let i = 0; i < results[0].length; i++) {
                                roleArr.push(results[0][i].title);
                            }

                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        message: 'Which role do you want to assign to the selected employee? ',
                                        name: 'role',
                                        choices: roleArr
                                    }
                                ])
                                .then((data) => {
                                    const sql3 = `SELECT id
                                                  FROM roles
                                                  WHERE roles.title = "${data.role}"`;

                                    db.promise().query(sql3)
                                    .then((results) => {
                                        const sql4 = `UPDATE employees
                                                      SET role_id = ${results[0][0].id}`;
                                    });
                                });

                        });



                });



        });
}