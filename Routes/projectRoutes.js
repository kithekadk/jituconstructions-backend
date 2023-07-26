const {Router} = require('express');
const { createProject, getProjects, getOneProject, updateProject, deleteProject } = require('../Controllers/ProjectsController');
const { verifyToken } = require('../Middleware/verifyToken');

const projectrouter = Router();

projectrouter.post('/',verifyToken, createProject);
projectrouter.get('/', getProjects);
projectrouter.get('/:id', getOneProject);
projectrouter.put('/:id',verifyToken, updateProject);
projectrouter.delete('/:id',verifyToken, deleteProject);

module.exports = {
    projectrouter
}