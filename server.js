// Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

//// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeesDB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  startEmployeePrompt();
});

// prompt user for the action
function employeePrompt(){
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Which action would you like to take?",
        choices: [
            "Add a department",
            "Add a role",
            "Add an employee",
            "View departments",
            "View roles",
            "View employees",
            "Update employee role",
            "Exit"]
