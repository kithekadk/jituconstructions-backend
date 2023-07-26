CREATE OR ALTER PROCEDURE employeeLogin(@email VARCHAR(200))
AS
BEGIN
    SELECT * FROM employeesTable WHERE email = @email
END