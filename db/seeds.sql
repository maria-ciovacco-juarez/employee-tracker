use employees_db;

INSERT INTO department(name)
VALUES ("Human Resources"),
       ("Computer Science"),
       ("Technology"),
       ("Marketing"),
       ("Merchandising");
       

INSERT INTO roles(title, salary, department_id)
VALUES ("Senior Engineer", 140000, 3),
       ("Junior Engineer", 100000, 5),
       ("Tech Recruiter", 85000, 1),
       ("Data Analyst", 90000, 2),
       ("Executive Team Lead", 80000, 4),
       ("Engineer Manager", 300000 , 3);
       

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES ("Inez", "Rumors", 1, 1),
       ("James", "Taylor", 2, 1),
       ("Betty", "Cardigan", 3, 2),
       ("Dorothea", "Gomez", 4, 1),
       ("Este", "Haim", 5, 2),
       ("Alison", "Taylor", 6, 1),
       ("Benjamin", "Button", 7, 2);