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

function viewAllEmployees() {
    db.query('SELECT * FROM employees', function (err, data) {
        console.table(data);
        start();
    })
}

function addEmployee() {

}

function updateEmployeeRole() {

}

function deleteEmployee() {

}

function viewAllRoles() {
    db.query('SELECT * FROM roles', function (err, data) {
        console.table(data);
        start();
    })
}

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

function deleteRole() {

}

function viewAllDeparments() {
    db.query('SELECT * FROM departments', function (err, data) {
        console.table(data);
        start();
    })
}

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

function deleteDepartment() {

}

function quit() {

}