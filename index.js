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
  db.query(`SELECT * FROM role`, (err, results) => {
    err ? console.error(err) : console.table(results);
    init();
  })
};

const viewEmployees = () => {
  db.query(`SELECT * FROM employee`, (err, results) => {
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
      db.query(`INSERT INTO department(name)
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
  const deptChoices = () => db.promise().query(`SELECT * FROM department`)
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
      db.promise().query(`SELECT id FROM department WHERE name = ?`, ans.addDept)
        .then(answer => {
          let mappedId = answer[0].map(obj => obj.id);
          // console.log(mappedId[0])
          return mappedId[0]
        })
        .then((mappedId) => {
          db.promise().query(`INSERT INTO roles(title, salary, department_id)
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
      db.query("INSERT INTO employee SET ?",
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


const updateEmployee = () => {
  const employeeChoices = () =>
    db.promise()
      .query("SELECT * FROM employees")
      .then(([rows]) => rows.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id })));

  const roleChoices = () =>
    db.promise()
      .query("SELECT * FROM roles")
      .then(([rows]) => rows.map(role => ({ name: role.title, value: role.id })));

  inquirer
    .prompt([
      {
        type: "list",
        message: "Select the employee you want to update:",
        name: "employeeId",
        choices: employeeChoices
      },
      {
        type: "list",
        message: "Select the information you want to update:",
        name: "updateField",
        choices: ["First Name", "Last Name", "Role", "Manager"]
      },
      {
        type: "input",
        message: "Enter the new value:",
        name: "newValue",
        validate: input => (input ? true : "Please enter a value.")
      }
    ])
    .then(ans => {
      let columnName;
      let columnValue;

      switch (ans.updateField) {
        case "First Name":
          columnName = "first_name";
          columnValue = ans.newValue;
          break;
        case "Last Name":
          columnName = "last_name";
          columnValue = ans.newValue;
          break;
        case "Role":
          columnName = "role_id";
          columnValue = ans.newValue;
          break;
        case "Manager":
          columnName = "manager_id";
          columnValue = ans.newValue;
          break;
        default:
          columnName = "";
          columnValue = "";
      }

      if (columnName !== "") {
        db.promise()
          .query(`UPDATE employees SET ${columnName} = ? WHERE id = ?`, [columnValue, ans.employeeId])
          .then(() => {
            console.log("Employee information updated successfully!");
            init();
          })
          .catch(err => {
            console.log(err);
            init();
          });
      } else {
        console.log("Invalid update field!");
        init();
      }
    });
};
