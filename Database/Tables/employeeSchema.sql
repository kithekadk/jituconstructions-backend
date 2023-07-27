BEGIN 
TRY
    CREATE TABLE employeesTable(
        id VARCHAR(200) PRIMARY KEY,
        e_name VARCHAR(200) NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL,
        password VARCHAR(500) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        issent BIT DEFAULT 0
    )
END TRY
BEGIN CATCH
    THROW 50002, 'Table already exists', 1;
END CATCH


SELECT * FROM employeesTable;

ALTER TABLE employeesTable ADD profile VARCHAR(500);