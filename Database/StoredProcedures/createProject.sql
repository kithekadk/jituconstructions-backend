CREATE OR ALTER PROCEDURE createProjectPROC(@id VARCHAR(200), @project_name  VARCHAR(500), @description VARCHAR(1000), @project_location VARCHAR(200), @startdate DATE, @enddate DATE)
AS
BEGIN
    INSERT INTO projectsTable(id, project_name, description, project_location, startdate,enddate) VALUES (@id, @project_name, @description, @project_location, @startdate, @enddate)
END

SELECT * FROM projectsTable


