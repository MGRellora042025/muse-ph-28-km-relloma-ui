import { useState, useEffect } from "react";
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_PROJECTS = gql`
    query Employees($projectName: String) {
        projects(projectName: $projectName) {
            projectName
            description
            startDate
            members
        }
}`;

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    const { data, refetch } = useQuery(GET_PROJECTS, {
        variables: { projectName: "" }, // initial value
        fetchPolicy: 'network-only',
        });

    useEffect(() => { 
        if (data?.projects) setProjects(data.projects); 
    }, [data]);

    const handleSelectProjectNameEvent = (event) => {
        const projectName = event.target.value;
        console.log('projectName:', projectName);
        refetch({ projectName });
    }

    const handleProjectClick = (project) => {
        setSelectedProject(project);
    }

    return (
        <div className="project-list-container">
            <h1>Projects</h1>
            
            <div className="table-section">
                <div className="filter-section">
                    <label htmlFor="projectDropdown">Filter by Project Name:</label>
                    <input type="text" id="projectDropdown" name="projectName" onChange={(event) => handleSelectProjectNameEvent(event)} />
                </div>
                
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Description</th>
                                <th>Start Date</th>
                                <th>Members</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project, index) => {
                                return (
                                    <tr 
                                        key={index}
                                        className="clickable-row"
                                    >
                                        <td>{project.projectName}</td>
                                        <td>{project.description}</td>
                                        <td>{project.startDate}</td>
                                        <td>{project.members.join(", ")}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ProjectList;