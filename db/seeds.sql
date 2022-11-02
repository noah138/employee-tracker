USE employees_db;

INSERT INTO departments (name)
VALUES
("Sales"),
("Engineering"),
("Finance"),
("Human Resources"),
("Management");

INSERT INTO roles (title, salary, department_id)
VALUES
("Sales Lead", 100000, 1),
("Salesperson", 50000, 1),
("Lead Engineer", 150000, 2),
("Accountant", 75000, 3),
("HR Rep", 65000, 4),
("Regional Manager", 120000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("John", "Doe", 1, NULL),
("Jim", "Brown", 2, NULL),
("Russell", "Wilson", 3, NULL),
("Geno", "Smith", 4, 1),
("Kenneth", "Walker", 5, 2),
("Drew", "Lock", 6, 1);