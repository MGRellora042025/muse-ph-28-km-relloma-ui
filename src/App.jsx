import { useState } from 'react'
import './App.css'
import EmployeeList from './components/EmployeeList'
import ProjectList from './components/ProjectList'

function App() {
  const [currentPage, setCurrentPage] = useState('Projects');

  const renderPage = () => {
    switch (currentPage) {
      case 'projects':
        return <ProjectList />;
      case 'employees':
        return <EmployeeList />;
      default:
        return <ProjectList />;
    }
  };

  return (
    <>
      {/* Navigation Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        justifyContent: 'center', 
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #ddd'
      }}>
        <button 
          onClick={() => setCurrentPage('projects')}
          style={{
            padding: '10px 20px',
            backgroundColor: currentPage === 'doctor' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Projects
        </button>
        <button 
          onClick={() => setCurrentPage('employees')}
          style={{
            padding: '10px 20px',
            backgroundColor: currentPage === 'patient' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Employees
        </button>
      </div>

      {/* Page Content */}
      <div style={{ padding: '20px' }}>
        {renderPage()}
      </div>
    </>
  )
}

export default App
