const {v4} = require('uuid')
const mssql = require ('mssql');
const { sqlConfig } = require('../Config/config');
const { createProjectsTable } = require('../Database/Tables/createTables');

const createProject = async(req, res)=>{
    try {
        // createProjectsTable()
        const id = v4()

        const {project_name, description, project_location, startdate, enddate} = req.body

        const pool = await mssql.connect(sqlConfig)

        if(pool.connected){

            console.log(req.body);

        const result = await pool.request()
        .input('id', mssql.VarChar, id)
        .input('project_name', mssql.VarChar, project_name)
        .input('description', mssql.VarChar, description)
        .input('project_location', mssql.VarChar, project_location)
        .input('startdate', mssql.Date, startdate)
        .input('enddate', mssql.Date, enddate)
        .execute('createProjectPROC')



        if(result.rowsAffected == 1){
        return res.json({
            message: "Project created Successfully",
        })  
        }else{
            return res.json({message: "Creation failed"})
        }   
    }
    } catch (error) {
        return res.json({error})
    }
}


const getProjects = async(req, res)=>{
    try {
        const pool = await (mssql.connect(sqlConfig))

        const allprojects = (await pool.request().execute('getAllProjects')).recordset

        // console.log(allprojects);

        return res.status(200).json({projects: allprojects})
    } catch (error) {
        return res.json({error: error})
    }
}

const getOneProject = async(req, res)=>{
    try {
        const {id} = req.params

        const pool = await mssql.connect(sqlConfig)

        const project = (await pool.request().input('id', id).execute('getOneProject')).recordset

        return res.status(200).json({
            project: project
        })
    } catch (error) {
        return res.json({error:error})
    }
}

const updateProject = async(req, res)=>{
    try {
        const {id} = req.params

        const {project_name, description, project_location, startdate, enddate} = req.body

        const pool = await mssql.connect(sqlConfig)

        const result = (await pool.request()
        .input('id', mssql.VarChar, id)
        .input('project_name', mssql.VarChar, project_name)
        .input('description', mssql.VarChar, description)
        .input('project_location', mssql.VarChar, project_location)
        .input('startdate', mssql.Date, startdate)
        .input('enddate', mssql.Date, enddate)

        .execute('updateProject'));

        // console.log(result);

        if(result.rowsAffected == 1){
            res.status(200).json({
                message: 'project updated successfully'
            })
        }else{
            res.status(400).json({
                message: 'project not found'
            })
        }
    } catch (error) {
        return res.json({Error: error})
    }
}

const deleteProject = async (req, res)=>{
    try {
       const id = req.params.id

        const pool = await mssql.connect(sqlConfig)

        const result = await pool.request()
        .input('id', id)
        .execute('deleteProject')
      
        if(result.rowsAffected == 1){
            res.json({
                    message: 'Project deleted successfully'
            })
        }else{
            res.json({
                message: 'Project not found'
        })
        }
    } catch (error) {
        return res.json({Error: error})
    }
}

module.exports ={
    createProject,
    getProjects,
    getOneProject,
    updateProject,
    deleteProject
}