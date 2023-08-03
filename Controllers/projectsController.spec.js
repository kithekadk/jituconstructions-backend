import mssql from 'mssql'
import { deleteProject, getOneProject, getProjects, updateProject } from './projectsController'

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
}

describe("Projects Controller", ()=>{
    describe("Gets all Projects", ()=>{
        it("should return all projects" , async()=>{
            const mockProjects = [
                {
                  id: '1464dda6-5651-4d3c-8c1c-527d977e15d8',
                  project_name: 'Build A bridge',
                  description: 'Build the nithi bridge',
                  project_location: 'Tharaka Nithi',
                  startdate: '2023-07-24',
                  enddate: '2023-08-24'
                },
                {
                  id: '538cf84d-ab46-44e3-b470-596829723334',
                  project_name: 'Build Dam',
                  description: 'Build a Dam capable of holding 40000 litres',
                  project_location: 'Nyeri',
                  startdate: '2023-07-24',
                  enddate: '2023-07-24'
                }
            ]

            const req = {}

            jest.spyOn(mssql, "connect").mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: mockProjects
                })
            })

            await getProjects(req, res)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({projects: mockProjects})
        })
    })

    describe("Getting Project By ID", ()=>{
        it ("should return the specified project", async()=>{
            const projectID = 'sryiuaraw1234'
            const mockProject = {
                id: "1464dda6-5651-4d3c-8c1c-527d977e15d8",
                project_name: "Build A bridge",
                description: "Build the nithi bridge",
                project_location: "Tharaka Nithi",
                startdate: "2023-07-24",
                enddate: "2023-08-24"
              }

            const req = {
                params: {
                    id: projectID
                }
            }

            jest.spyOn(mssql, "connect").mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    recordset: [mockProject]
                })
            })

            await getOneProject(req, res)

            expect(res.json).toHaveBeenCalledWith({project: [mockProject]})
        })
    })

    describe("Updating a Project", ()=>{
        it("should update a project successfully", async()=>{
            const projectID = 'sryiuaraw1234'
            const updatedProject = {
                project_name: "Build A bridge",
                description:"Build the nithi bridge",
                project_location:"Tharaka Nithi",
                startdate:"2023-7-25",
                enddate:"2023-8-25"
            }
            const req = {
                params:{
                    id:projectID
                },
                body: updatedProject
            }
            
            jest.spyOn(mssql, "connect").mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: [1]
                })
            })

            await updateProject(req, res)

            expect(res.json).toHaveBeenCalledWith({
                message: "project updated successfully"
            })
        })

        it("should return error when project ID does not exist", async ()=>{
            const projectID = 'sryiuaraw1234'
            const updatedProject = {
                project_name: "Build A bridge",
                description:"Build the nithi bridge",
                project_location:"Tharaka Nithi",
                startdate:"2023-7-25",
                enddate:"2023-8-25"
            }
            const req = {
                params:{
                    id:projectID
                },
                body: updatedProject
            }
            
            jest.spyOn(mssql, "connect").mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: [0]
                })
            })

            await updateProject(req, res)

            expect(res.json).toHaveBeenCalledWith({
                message: 'project not found'
            })
        }) 
    })


    describe("Deleting a project", ()=>{
        it("should delete the project successfully", async()=>{
            const projectID = 'sryiuaraw1234'
            const req = {
                params:{
                    id: projectID
                }
            }

            jest.spyOn(mssql, "connect").mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: [1]
                })
            })

            await deleteProject(req, res)

            expect(res.json).toHaveBeenCalledWith({
                message: 'Project deleted successfully'
            })
        })

        it("should return an error 'project not found'", async()=>{
            const projectID = 'sryiuaraw1234'
            const req = {
                params:{
                    id: projectID
                }
            }

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }

            jest.spyOn(mssql, "connect").mockResolvedValueOnce({
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValueOnce({
                    rowsAffected: [0]
                })
            })

            await deleteProject(req, res)


            expect(res.json).toHaveBeenCalledWith({
                message: 'Project not found'
            })
        })
    })
})