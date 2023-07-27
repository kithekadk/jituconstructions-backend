const mssql = require ('mssql');
const { sqlConfig } = require('../../Config/config');


const createProjectsTable = async(req, res)=>{
    try {
        const table = `
        BEGIN 
        TRY
            CREATE TABLE projectsTable(
                id VARCHAR(200) PRIMARY KEY,
                project_name VARCHAR(500) NOT NULL,
                description VARCHAR(1000) NOT NULL,
                project_location VARCHAR(200) NOT NULL,
                startdate DATE NOT NULL,
                enddate DATE NOT NULL
            )
        END TRY
    BEGIN   
        CATCH
            THROW 50001, 'Table already Exists!', 1;
        END CATCH`;

    const pool = await mssql.connect(sqlConfig)

    await pool.request().query(table, (err)=>{
        if(err instanceof mssql.RequestError){
            console.log({Error: err.message});
        }else{
            console.log('Table created Successfully');
        }
    })

    } catch (error) {
        return ({Error: error})
    }
}
const createEmployeesTable = async(req, res)=>{
    try {
        const table = `
        BEGIN 
            TRY
                CREATE TABLE employeesTable(
                    id VARCHAR(200) PRIMARY KEY,
                    e_name VARCHAR(200) NOT NULL,
                    email VARCHAR(200) UNIQUE NOT NULL,
                    password VARCHAR(500) NOT NULL,
                    profile VARCHAR(500),
                    role VARCHAR(50) DEFAULT 'user',
                    issent BIT DEFAULT 0
                )
            END TRY
        BEGIN CATCH
            THROW 50002, 'Table already exists', 1;
        END CATCH`;

    const pool = await mssql.connect(sqlConfig)

    await pool.request().query(table, (err)=>{
        if(err instanceof mssql.RequestError){
            console.log({Error: err.message});
        }else{
            console.log('Table created Successfully');
        }
    })

    } catch (error) {
        return ({Error: error})
    }
}

module.exports = {
    createProjectsTable,
    createEmployeesTable
}