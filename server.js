const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require('console.table');

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
            'View Department Budgets',
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
            case 'View Department Budgets':
                return viewBudget();
            case 'Quit':
                return quit();
        }
    })
}

//  I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewAllEmployees() {
    const sql = `SELECT
                    employees.id,
                    employees.first_name AS "first name",
                    employees.last_name AS "last name",
                    roles.title,
                    departments.name AS "department",
                    roles.salary,
                    CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employees
                LEFT JOIN roles
                ON employees.role_id = roles.id
                LEFT JOIN departments
                ON roles.department_id = departments.id
                LEFT JOIN employees AS manager
                ON employees.manager_id = manager.id`

    db.query(sql, function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    })
}

//  THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
function viewAllRoles() {
    const sql = `SELECT
            roles.title,
            roles.id,
            departments.name AS "department",
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

// THEN I am presented with a formatted table showing department names and department ids
function viewAllDeparments() {
    const sql = `SELECT * FROM departments`

    db.query(sql, function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    })
}

// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
function updateEmployeeRole() {
    db.query('SELECT * FROM employees', function (err, results) {
        const employeeArr = results.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            }
        })

        db.query('SELECT * FROM roles', function (err, results) {
            const roleArr = results.map((role) => {
                return {
                    name: role.title,
                    value: role.id,
                }
            })
        
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: `Which employee's role needs to be updated?`,
                    choices: employeeArr
                },
                {
                    type: 'list',
                    name: 'newRole',
                    message: `What is the employee's new role?`,
                    choices: roleArr
                },               
            ]).then((response) => {
                const sql = `UPDATE employees
                SET role_id = ?
                WHERE id = ?`;
                
                db.query(sql, [response.newRole, response.employee],function (err, data) {
                    console.log(`Role has been successfully updated!`);
                    start();
                })
            })
        })
    })
}

// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
function addEmployee() {
    db.query('SELECT * FROM roles', function (err, results) {
        if (err) throw err;
        const roleArr = results.map((role) => {
            return {
                name: role.title,
                value: role.id,
            }
        })

    db.query('SELECT * FROM employees', function (err, results) {
        if (err) throw err;
        const employeeArr = results.map(employee => {
            return {
                name: employee.first_name + ' ' + employee.last_name,
                value: employee.id,
            }
        })
        // Adds the option to select 'none' as manager
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
            VALUES (?, ?, ?, ?)`
            
            db.query(sql, [response.firstName, response.lastName, response.newRole, response.newManager], function (err, data) {
                if (err) throw err;
                console.log(`${response.firstName} ${response.lastName} has been added to the database!`);
                start();
            })
        })
    })

    })
    
}

// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
function addRole() {
    db.query('SELECT * FROM departments', function (err, results) {
        if (err) throw err;
        const departmentArr = results.map((department) => {
            return {
                name: department.name,
                value: department.id,
            }
        })
        inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is the name of the new role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the new role?'
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does the role belong to?',
                choices: departmentArr
            }
        ]).then((answer) => {
            const sql = `INSERT INTO roles
            (title, salary, department_id)
            VALUES (?, ?, ?)`;
            
            db.query(sql, [answer.name, answer.salary, answer.department], function (err, data) {
                if (err) throw err;
                console.log(`The role of ${answer.name} has been successfully added!`);
                start();
            })
        })
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
        sql = `INSERT INTO departments (name)
               VALUES (?)`;

        db.query(sql, answer.department, function(err, data) {
            if (err) throw err;
            console.log(`${answer.department} has been added to departments`);
            start();
        })
    })
}

function deleteEmployee() {
    db.query('SELECT * FROM employees', function (err, results) {
        const employeeArr = results.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            }
        })
    
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: `Which employee needs to be removed?`,
                choices: employeeArr
            }
        ]).then(response => {
            db.query(`DELETE FROM employees WHERE id = ?`, response.employee, function(err, data) {
                if (err) throw err;
                console.log("Employee has been successfully deleted");
                start();
            })
        })
    })
}

function deleteRole() {
    db.query('SELECT * FROM roles', function (err, results) {
        if (err) throw err;
        const roleArr = results.map((role) => {
            return {
                name: role.title,
                value: role.id,
            }
        })
    
        inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Which role needs to be removed?',
                choices: roleArr
            }
        ]).then(response => {
            db.query(`DELETE FROM roles WHERE id = ?`, response.role, function(err, data) {
                if (err) throw err;
                console.log("Role has been successfully deleted");
                start();
            })
        })
    })
}

function deleteDepartment() {
    db.query('SELECT * FROM departments', function (err, results) {
        if (err) throw err;
        const departmentArr = results.map((department) => {
            return {
                name: department.name,
                value: department.id,
            }
        })
    
        inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department needs to be removed?',
                choices: departmentArr
            }
        ]).then(response => {
            db.query(`DELETE FROM departments WHERE id = ?`, response.department, function(err, data) {
                if (err) throw err;
                console.log("Department has been successfully deleted");
                start();
            })
        })
    })
}

function viewBudget() {
    const sql = `SELECT
                    departments.name AS "department",
                    SUM(salary) AS "budget"
                FROM roles
                JOIN departments ON roles.department_id = departments.id
                GROUP BY department_id`
    
    db.query(sql, function(err, data) {
        if (err) throw err;
        console.table(data);
        start();
    })
}

function quit() {
    console.log("See you later!")
    db.end()
}