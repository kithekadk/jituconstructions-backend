const {v4} = require('uuid')

const projects = [];

class Project{
    constructor(id, project_name, project_location, description, startdate, enddate){
        this.id = id,
        this.project_name = project_name,
        this.project_location = project_location,
        this.description = description,
        this.startdate = startdate,
        this.enddate = enddate
    }
}

const createProject = async(req, res)=>{
    try {
        const id = v4()

        const {project_name, description, project_location, startdate, enddate} = req.body

        const newProject = {id, project_name, description, project_location, startdate, enddate}

        projects.push(newProject)

        // console.log(projects)
        res.json({
            message: "Project created Successfully",
            project: newProject
        })
    } catch (error) {
        return res.json({error})
    }
}

const getProjects = async(req, res)=>{
    try {
        res.json({projects: projects})
    } catch (error) {
        return res.json({error})
    }
}

const getOneProject = async(req, res)=>{
    try {
        const id = req.params.id

        console.log(id);

        const project = projects.filter(el =>el.id == id)

        res.json({
            project
        })
    } catch (error) {
        return res.json({error})
    }
}

const updateProject = async(req, res)=>{
    try {
        const id = req.params.id

        const {project_name, description, project_location, startdate, enddate} = req.body

        const project_index = projects.findIndex(project => project.id == id)

        if(project_index < 0){
            res.json('Project not found')
        }else{
            projects[project_index] = new Project(id,project_name, description, project_location, startdate, enddate)
        }

        res.json({
            message: 'project updated successfully',
            project: projects[project_index]
        })
    } catch (error) {
        return res.json({Error: error})
    }
}

const deleteProject = async (req, res)=>{
    try {
       const id = req.params.id

       let project_index =  projects.findIndex(project => project.id == id);

       console.log(project_index);

       if(project_index < 0){
            res.json({message: 'project not found'})
       }else{
            projects.splice(project_index, 1)
       }

       res.json({
            message: 'project deleted successfully'
       })
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