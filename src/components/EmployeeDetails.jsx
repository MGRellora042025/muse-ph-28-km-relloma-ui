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

    return <>
        <h1>Employee ID: {employee.id}</h1>
        <h1>Name: {employee.name}</h1>
        <h1>Department: {employee.department}</h1>
        <h1>Title: {employee.title}</h1>
        <h1>Date of Birth: {employee.dateOfBirth}</h1>
        <h1>Start Date: {employee.startDate}</h1>
        <img src={employee.imgUrl} />
    </>
}

export default EmployeeDetails;