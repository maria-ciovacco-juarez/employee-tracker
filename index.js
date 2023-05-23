const cTable = require('console.table');
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Connect to database
const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'fargo3579@',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

const readline = require('readline');
// ...

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Increase the limit of listeners for the ReadStream object
rl.input.setMaxListeners(20); // Set the number according to your needs

// Rest of your code using `inquirer` prompts

// ...



const init = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please select from the following options:",
        name: "initialize",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "I'm finished"
        ]
      }
    ]).then(ans => {
      // console.log(ans.initialize);
      switch (ans.initialize) {
        case "View all departments": viewDept();
          break;
        case "View all roles": viewRoles();
          break;
        case "View all employees": viewEmployees();
          break;
        case "Add a department": addDept();
          break;
        case "Add a role": addRole();
          break;
        case "Add an employee": addEmployee();
          break;
        case "Update an employee role": updateEmployee();
          break;
        case "I'm finished":
          console.log("Thank you very much!");
          process.exit();
      }
    }).catch(err => console.error(err));
}

init();

const viewDept = () => {
  // console.log("Working")
  db.query(`SELECT * FROM department`, (err, results) => {
    err ? console.error(err) : console.table(results);
    init();
  })
};

const viewRoles = () => {
  db.query(`SELECT * FROM roles`, (err, results) => {
    err ? console.error(err) : console.table(results);
    init();
  })
};

const viewEmployees = () => {
  db.query(`SELECT * FROM employees`, (err, results) => {
    err ? console.error(err) : console.table(results);
    init();
  })
}

const addDept = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department you'd like to add?",
        name: "addDept"
      }
    ]).then(ans => {
      db.query
      (`INSERT INTO department(name)
                   VALUES(?)`, ans.addDept, (err, results) => {
        if (err) {
          console.log(err)
        } else {
          db.query(`SELECT * FROM department`, (err, results) => {
            err ? console.error(err) : console.table(results);
            init();
          })
        }
      }
      )
    })
};

const addRole = () => {
  const deptChoices = () =>
    db.promise().query
      (`SELECT * FROM department`)
      .then((rows) => {
        let arrNames = rows[0].map(obj => obj.name);
        return arrNames
      })
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the title of the role you'd like to add?",
        name: "roleTitle"
      },
      {
        type: "input",
        message: "What is the salary for this role?",
        name: "roleSalary"
      },
      {
        type: "list",
        message: "Which department is this role in?",
        name: "addDept",
        choices: deptChoices
      }
    ]).then(ans => {
      db.promise().query
        (`SELECT id FROM department WHERE name = ?`, ans.addDept)
        .then(answer => {
          let mappedId = answer[0].map(obj => obj.id);
          // console.log(mappedId[0])
          return mappedId[0]
        })
        .then((mappedId) => {
          db.promise().query
            (`INSERT INTO roles(title, salary, department_id)
                VALUES(?, ?, ?)`, [ans.roleTitle, ans.roleSalary, mappedId]);
          init()
        })
    })
};

function addEmployee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        message: "Enter employee first name:",
        type: "input"
      },
      {
        name: "last_name",
        message: "Enter employee last name:",
        type: "input"
      },
      {
        name: "role_id",
        message: "Enter role ID:",
        type: "input",
      },
      {
        name: "manager_id",
        message: "Enter manager ID:",
        type: "input",
      }
    ])
    .then(function ({ first_name, last_name, role_id, manager_id }) {
      db.query
        ("INSERT INTO employees SET ?",
          {
            first_name: first_name,
            last_name: last_name,
            role_id: role_id,
            manager_id: manager_id
          },
          function (err, res) {
            if (err) throw err;
            console.log(`Successfully added ${first_name} ${last_name} into employee table!`)
            viewEmployees();
            init();
          })
    })
}


function updateEmployee() {
  const roles = [
    { id: 1, title: "Senior Engineer" },
    { id: 2, title: "Junior Engineer" },
    { id: 3, title: "Tech Recruiter" },
    { id: 4, title: "Data Analyst" },
    { id: 5, title: "Executive Team Lead" },
    { id: 6, title: "Engineer Manager" },
  ]
  db.query(
    "SELECT * FROM employees",
    function (err, res) {
      if (err) throw err;
      const roles = res;
      console.table(roles);
      inquirer
        .prompt([
          {
            type: "input",
            message: "Enter employee's ID:",
            name: "employee_id"
          },
          {
            type: "list",
            message: "Choose new employee role:",
            choices: roles.map((role) => `${role.id} ${role.title}`),
            name: "chosenRole",
          }
        ])
        .then(function ({ employee_id, chosenRole }) {
          console.log("Updating employee role...\n");
          db.query
            (
              "UPDATE employee SET ? WHERE ?",
              [
                {
                  role_id: chosenRole.split(" ")[0]
                },
                {
                  id: employee_id
                }
              ],
              function (err, res) {
                if (err) throw err;
                console.log(`Employee ${employee_id}'s role has been updated to ${chosenRole}\n`);
                viewEmployees();
                init();
              }
            );
        });
    });
}



