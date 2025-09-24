import { useState, useEffect } from "react";
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import TableRow from "./TableRow";
import EmployeeDetails from "./EmployeeDetails";

const GET_EMPLOYEES = gql`
  query Employees($department: String) {
    employees(department: $department) {
        id
        name
    }
}`;

function EmployeeList() {
    const [selectedUserId, setSelectedUserId] = useState(0);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [employees, setEmployees] = useState([]);

    // const { data } = useQuery(GET_EMPLOYEES, { fetchPolicy: 'network-only' });

    const { data, refetch } = useQuery(GET_EMPLOYEES, {
        variables: { department: "" }, // initial value
        fetchPolicy: 'network-only',
        });

    useEffect(() => { 
        if (data?.employees) setEmployees(data.employees); 
    }, [data]);

    const handleSelectDepartmentEvent = (event) => {
        const department = event.target.value;
        console.log('department');
        console.log(department);
        refetch({ department });
    }

    return (
        <div className="employee-list-container">
            <h1>Employees</h1>
            
            <div className="table-section">
                <div className="filter-section">
                    <label htmlFor="departmentDropdown">Filter by Department:</label>
                    <select id="departmentDropdown" name="department" onChange={(event) => handleSelectDepartmentEvent(event)}>
                        <option value="">All Department</option>
                        <option value="IT">IT</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                    </select>
                </div>
                
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(employee => <TableRow id={employee.id} name={employee.name} onDelete={() => setSelectedUserId(employee.id)} /> )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="employee-details-section">
                <EmployeeDetails id={selectedUserId} />
            </div>
        </div>
    )
}

export default EmployeeList;