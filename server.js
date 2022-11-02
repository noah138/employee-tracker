const inquirer = require("inquirer");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3000;
const app = require("express");

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employees_db'
    },
    console.log("Connected to the employee database")
);

start();

function start() {
    inquirer.prompt({
        type: 'list',
        name: 'task',
        message: 'What would you like to do?',
        choices: [
            'View All Employees',
            'Add Employee',
            'Update Employee Role',
            'Delete Employee',
            'View All Roles',
            'Add Role',
            'Delete Role',
            'View All Departments',
            'Add Department',
            'Delete Department',
            'Quit'
        ]
    }).then((answer) => {
        console.log(answer);
        switch (answer.task) {
            case 'View All Employees':
                return viewAllEmployees();
            case 'Add Employee':
                return addEmployee();
            case 'Update Employee Role':
                return updateEmployeeRole();
            case 'Delete Employee':
                return deleteEmployee();
            case 'View All Roles':
                return viewAllRoles();
            case 'Add Role':
                return addRole();
            case 'Delete Role':
                return deleteRole();
            case 'View All Departments':
                return viewAllDeparments();
            case 'Add Department':
                return addDepartment();
            case 'Delete Department':
                return deleteDepartment();
            case 'Quit':
                return quit();
        }
    })
}

//  I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewAllEmployees() {
    const sql = `SELECT
                    employees.id,
                    employees.first_name,
                    employees.last_name,
                    roles.title,
                    departments.name,
                    roles.salary
                    CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employees
                LEFT JOIN roles
                ON employees.role_id = roles.id
                LEFT JOIN departments
                ON roles.department_id = departments.id
                LEFT JOIN employee AS manager
                ON employees.manager_id = manager.id
    `;

    db.query(sql, function (err, data) {
        console.table(data);
        start();
    })
}

// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
function addEmployee() {
    db.query('SELECT * FROM roles', function (err, results) {
        const roleArr = results.map((role) => {
            return {
                name: role.title,
                value: role.id,
            }
        })

    db.query('SELECT * FROM employees', function (err, results) {
        const employeeArr = results.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            }
        })
        // Adds the option to select 'none'
        employeeArr.unshift(
            {
                value: null,
                name: 'None'
            }
        )

        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: `What is the employee's first name?`,
            },
            {
                type: 'input',
                name: 'lastName',
                message: `What is the employee's last name?`,
            },
            {
                type: 'list',
                name: 'newRole',
                message: `What is the employee's role?`,
                choices: roleArr,
            },
            {
                type: 'list',
                name: 'newManager',
                message: `Who is the employee's manager?`,
                choices: employeeArr,
            },
        ]).then((response) => {
            const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
            VALUES (?, ?, (SELECT id FROM roles WHERE title = ?), ?)`
            
            db.query(sql, [firstName, lastName, newRole, newManager],function (err, data) {
                if (err) throw err;
                console.log(`${firstName} ${lastName} has been added to the database!`);
                start();
            })
        })
    })

    })
    
}

// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
function updateEmployeeRole() {

}

// function deleteEmployee() {

// }

//  THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
function viewAllRoles() {
    sql = `SELECT
            roles.title,
            roles.id,
            departments.name,
            roles.salary
        FROM roles
        LEFT JOIN departments
        ON roles.department_id = departments.id`

    db.query(sql, function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    })
}

// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What role would you like to add?'
        }
    ]).then((answer) => {

    })
}

// function deleteRole() {

// }

// THEN I am presented with a formatted table showing department names and department ids
function viewAllDeparments() {
    const sql = `SELECT * FROM departments`

    db.query(sql, function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    })
}

// THEN I am prompted to enter the name of the department and that department is added to the database
function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the department name?'
        }
    ]).then((answer) => {
        db.query(`INSERT INTO departments`)
    })
}

// function deleteDepartment() {

// }

function quit() {

}