CREATE OR ALTER PROCEDURE registerCaregiver(@id VARCHAR(200), @full_name VARCHAR(200),@phone_no VARCHAR(30), @email VARCHAR(200), @certification_no VARCHAR(200) , @certified_from VARCHAR(200),@profile VARCHAR(300), @password VARCHAR(200))
AS
BEGIN
    INSERT INTO caregiversTable(id, full_name, phone_no , email, certification_no, certified_from, profile, password) VALUES(@id, @full_name, @phone_no, @email, @certification_no,@certified_from, @profile, @password)
END