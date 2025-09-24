import { useState } from "react";
import TableRow from "./TableRow";
import EmployeeDetails from "./EmployeeDetails";

function EmployeeList() {
    const [selectedUserId, setSelectedUserId] = useState(0);

    return <>
        <h1>Employees</h1>
        <div>
            <label for="departmentDropdown">Filter by Department:</label>
            <select id="departmentDropdown" name="department">
            <option value="It">It</option>
            <option value="Finance">Finance</option>
            </select>
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                <TableRow id={1} 
                    name='test'
                    onDelete={() => setSelectedUserId(1)}
                    />
            </tbody>
        </table>

        selectedUserId && <EmployeeDetails id={selectedUserId} />
    </>
}

export default EmployeeList;