USE employees_db;

INSERT INTO deparment(name)
VALUES
("Marketing"),
("Finance"),
("Human Resources"),
("IT")

INSERT INTO role(title, salary, department_id)
VALUES
("Sales Lead", 100000, 1)
("Salesperson", 50000, 2)
("Lead Engineer", 120000, 3)
("Accountant", 75000, 4)


-- id firstname lastname roleid managerid
INSERT INTO employee(first_name, last_name, role_id, manager_id)
("John", "Doe", 1, NULL)
("Jim", "Brown", 2, NULL)
("Russell", "Wilson", 3, NULL)
("Geno", "Smith", 4, 1)
("Kenneth", "Walker", 5, 2)
("Drew", "Lock", 6, 3)