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
  askQuestions();
});

// prompt user for the action
function askQuestions(){
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
            askQuestions();
        })
    });
}

function addRole() {
    inquirer.prompt([
        {
            message: "enter title:",
            type: "input",
            name: "title"
        }, {
            message: "enter salary:",
            type: "number",
            name: "salary"
        }, {
            message: "enter department ID:",
            type: "number",
            name: "department_id"
        }
    ]).then(function (response) {
        connection.query("INSERT INTO roles (title, salary, department_id) values (?, ?, ?)", [response.title, response.salary, response.department_id], function (err, data) {
            console.table(data);
        })
        askQuestions();
    });
}
