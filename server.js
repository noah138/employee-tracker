const inquirer = require("inquirer");

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
    }),then((answer) => {
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

async function viewAllEmployees() {

}
async function addEmployee() {

}
async function updateEmployeeRole() {

}
async function deleteEmployee() {

}
async function viewAllRoles() {

}
async function addRole() {

}
async function deleteRole() {

}
async function viewAllDeparments() {

}
async function addDepartment() {

}
async function deleteDepartment() {

}
async function quit() {

}