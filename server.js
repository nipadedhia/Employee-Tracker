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
function askQuestions() {
  inquirer
    .prompt({
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
        "Exit",
      ],
    })
    .then(function (answer) {
      console.log(answer.action);
      switch (answer.action) {
        case "Add department":
          addDepartment();
          break;
        case "Add role":
          addRole();
          break;
        case "add employee":
          addEmployee();
          break;
        case "View departments":
          viewDepartments();
          break;
        case "View roles":
          viewRoles();
          break;
        case "View employees":
          viewEmployees();
          break;
        case "Update employee role":
          updateEmployeeRole();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
}

// add new department
function addDepartment() {
  inquirer
    .prompt({
      name: "newDepartment",
      type: "input",
      message: "Which department you would like to add?",
    })
    .then(function (answer) {
      connection.query(
        "INSERT INTO department (name) VALUES (?)",
        [answer.newDepartment],
        function (err) {
          if (err) throw err;
          console.log(
            `New department - ${answer.newDepartment} created successfully!`,
          );
          askQuestions();
        },
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        message: "enter title:",
        type: "input",
        name: "title",
      },
      {
        message: "enter salary:",
        type: "number",
        name: "salary",
      },
      {
        message: "enter department ID:",
        type: "number",
        name: "department_id",
      },
    ])
    .then(function (response) {
      connection.query(
        "INSERT INTO roles (title, salary, department_id) values (?, ?, ?)",
        [response.title, response.salary, response.department_id],
        function (err, data) {
          console.table(data);
        },
      );
      askQuestions();
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employees first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employees last name?",
      },
      {
        type: "number",
        name: "roleId",
        message: "What is the employees role ID",
      },
      {
        type: "number",
        name: "managerId",
        message: "What is the employees manager's ID?",
      },
    ])
    .then(function (res) {
      connection.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [res.firstName, res.lastName, res.roleId, res.managerId],
        function (err, data) {
          if (err) throw err;
          console.table("Successfully Inserted");
          askQuestions();
        },
      );
    });
}

// view all departments
function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, data) {
    console.table(data);
    askQuestions();
  });
}

// view all roles
function viewRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    startEmployeePrompt();
  });
}

// view all employees
function viewEmployees() {
  connection.query("SELECT * FROM employee", function (err, data) {
    console.table(data);
    askQuestions();
  });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        message: "which employee would you like to update?",
        type: "input",
        name: "name",
      },
      {
        message: "enter the new role ID:",
        type: "number",
        name: "role_id",
      },
    ])
    .then(function (response) {
      connection.query(
        "UPDATE employee SET role_id = ? WHERE first_name = ?",
        [response.role_id, response.name],
        function (err, data) {
          console.table(data);
        },
      );
      askQuestions();
    });
}
