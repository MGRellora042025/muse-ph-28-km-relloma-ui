import { useState, useEffect } from "react";
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import TableRow from "./TableRow";

const GET_EMPLOYEE = gql`
  query Employee($employeeId: ID!) { 
    employee(id: $employeeId) {
        id
        name
        department
        title
        dateOfBirth
        startDate
        imgUrl
    } 
  }`;

function EmployeeDetails({ id }) {
    const [employee, setEmployee] = useState({});
    const { data } = useQuery(GET_EMPLOYEE, { 
        variables: { employeeId: id },
        fetchPolicy: 'network-only' });

    useEffect(() => { 
        if (data?.employee) setEmployee(data.employee); 
    }, [data]);

    if (!employee.id) {
        return (
            <div className="employee-details">
                <h3>Employee Details</h3>
                <p className="no-selection">Select an employee to view details</p>
            </div>
        );
    }

    return (
        <div className="employee-details">
            <h3>Employee Details</h3>
            
            {employee.imgUrl && (
                <div className="employee-image-container">
                    <img src={employee.imgUrl} alt={`${employee.name} profile`} className="employee-image" />
                </div>
            )}
            
            <div className="employee-info">
                <div className="info-item">
                    <span className="label">ID:</span>
                    <span className="value">{employee.id}</span>
                </div>
                
                <div className="info-item">
                    <span className="label">Name:</span>
                    <span className="value">{employee.name}</span>
                </div>
                
                <div className="info-item">
                    <span className="label">Department:</span>
                    <span className="value">{employee.department}</span>
                </div>
                
                <div className="info-item">
                    <span className="label">Title:</span>
                    <span className="value">{employee.title}</span>
                </div>
                
                <div className="info-item">
                    <span className="label">Date of Birth:</span>
                    <span className="value">{employee.dateOfBirth}</span>
                </div>
                
                <div className="info-item">
                    <span className="label">Start Date:</span>
                    <span className="value">{employee.startDate}</span>
                </div>
            </div>
        </div>
    )
}

export default EmployeeDetails;