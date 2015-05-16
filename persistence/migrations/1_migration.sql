CREATE TABLE Clients (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) NOT NULL,
	address varchar(255) NOT NULL
);

CREATE TABLE Projects (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar(255) NOT NULL,
	hourlyRate DECIMAL(5,2),
	clientId INT
);
ALTER TABLE Projects ADD CONSTRAINT ProjectWorkedOnForClient
FOREIGN KEY (clientId) REFERENCES Clients (id);

CREATE TABLE Hours (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	end date,
	amount DECIMAL(5,2),
	projectId INT
);
ALTER TABLE Hours ADD CONSTRAINT HoursWorkedOnProject
FOREIGN KEY (projectId) REFERENCES Projects (id);

CREATE TABLE Invoices (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	start date,
	end date,
	clientId INT
);
ALTER TABLE Invoices ADD CONSTRAINT InvoicesSentToClient
FOREIGN KEY (clientId) REFERENCES Clients (id);
