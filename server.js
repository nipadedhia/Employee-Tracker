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
  employeePrompt();
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
        }).then(function(answer){
            console.log(answer.action);
            switch(answer.action){
                case "Add a department":
                    //call addDepartment function
                    addDepartment();
                    break;
                    //add a role function
                    case "Add a role":
                     // call addRole function  
                        addRole();

// add new department
function addDepartment(){
    inquirer.prompt({
        name: "newDepartment",
        type: "input",
        message: "Which department you would like to add?"
    }).then(function(answer){
        connection.query("INSERT INTO department (name) VALUES (?)", [answer.newDepartment], function(err){
            if(err) throw err;
            console.log(`New department - ${answer.newDepartment} created successfully!`);
            employeePrompt();
        })
    });
}

// add new role
function addRole(){
    inquirer.prompt([{
        name: "newRole",
        type: "input",
        message: "Name of the new role:"
    }, {
        name: "salary",
        type: "input", 
        message: "What is their salary?",
        validate: validateSalary
    }, {
        name: "departmentID",
        type: "input",
        message: "What is their department id?",
        validate: validateID
    }]).then(function(answer){
        connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [answer.newRole, answer.salary, answer.departmentID], function(err){
            if(err) throw err;
            console.log(`New role - ${answer.newRole} created successfully!`);
            employeePrompt();
        })
    });
}
