BEGIN 
TRY
    CREATE TABLE caregiversTable(
        id VARCHAR(200) PRIMARY KEY,
        full_name VARCHAR(200) NOT NULL,
        phone_no VARCHAR(200) UNIQUE NOT NULL,
        email VARCHAR(500) UNIQUE NOT NULL,
        certification_no VARCHAR(50) NOT NULL,
        certified_from VARCHAR(200) NOT NULL,
        password VARCHAR(200) NOT NULL,
        profile VARCHAR(300),
        verified VARCHAR(100) DEFAULT 'no'
    )
END TRY
BEGIN CATCH
    THROW 50002, 'Table already exists', 1;
END CATCH