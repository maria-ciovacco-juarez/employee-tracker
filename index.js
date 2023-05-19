//requiring mysql
const mysql = require('mysql2');
const inquirer = require('inquirer');

//connect to database
const db = mysql.createConnection(
  {
    host: '127.0.0.1',
    user: 'root',
    password: 'fargo3579@',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

db.connect(function (err) {
    if (err) throw err;
    promptMenu();
});

function promptMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'employeeManager',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Complete'] 
        }])
        .then(res => {
            switch (res.employeeManager) {
                case "View all departments":
                    viewDepartments();
                    break;
                case "View all roles":
                    viewRoles();
                    break;
                case "View all employees":
                    viewEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee role":
                    updateRole();
                    break;
                    default:
                    complete();
            }
        });
};
const viewDepartments = () => {
    let query =
    `SELECT
        department.id,
        department.name AS department
    FROM department`

    db.query(query, (err, res)=>{
        if (err) throw err;
        console.table(res);
        promptMenu();
      });
  }

  const viewRoles = () => {
    let query =
    `SELECT
        role.id,
        role.title,
        role.salary,
        department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id`

    db.query(query, (err, res)=>{
        if (err) throw err;
        console.table(res);
        promptMenu();
      });
  }

  const viewEmployees = () => {
    let query =
    `SELECT
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        role.salary,
        department.name AS department,
        manager_id
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id`

    db.query(query, (err, res)=>{
        if (err) throw err;
        console.table(res);
        promptMenu();
      });
  }


  function addDepartment() {
    inquirer.prompt([
        {
            type: 'text',
            name: 'updateDepartment',
            message: 'What department do you want to add?'
        }])
        .then(res => {
            promptMenu();
     
  });
}

  
  function addRole() {
    inquirer.prompt([
        {
            type: 'text',
            name: 'updateRole',
            message: 'What role do you want to add?'
        },
        {
            type: 'text',
            name: 'updateSalary',
            message: 'What is the salary?'
        },
        {
            type: 'text',
            name: 'addRoleDepartment',
            message: 'What department does this role go to?'
        }])
        .then(res => {
            promptMenu();
  })
}

  function addEmployee() {
    inquirer.prompt([
        {
            type: 'text',
            name: 'employeeFirst',
            message: 'Please enter the employees first name'
        },
        {
            type: 'text',
            name: 'employeeLast',
            message: 'Please enter the employees last name'
        },
        {
            type: 'text',
            name: 'employeeRole',
            message: 'Please enter the employees role'
        },
        {
            type: 'text',
            name: 'employeeManager',
            message: 'Please enter the employees manager'
        }])
        .then(res => {
            promptMenu();
  })
  }

  function updateRole() {
    inquirer.prompt([
      {
        type: 'text',
        name: 'employeeId',
        message: 'Enter the ID of the employee you want to update:',
      },
      {
        type: 'text',
        name: 'newRoleId',
        message: 'Enter the ID of the new role:',
      },
    ]).then(({ employeeId, newRoleId }) => {
      // Update the employee role in the database using the provided IDs
      let query = `UPDATE employee SET role_id = ? WHERE id = ?`;
  
      db.query(query, [newRoleId, employeeId], (err, res) => {
        if (err) throw err;
  
        console.log(`Successfully updated employee role with ID ${employeeId}`);
        promptMenu();
      });
    });
  }
  
  
const complete = () => {
    console.log('Finished');
    process.exit();
}
