import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function AdminDashboard() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    
    const [showAddForm, setShowAddForm] = useState(false);
    const [existingIds, setExistingIds] = useState([]);
    const [newId, setNewId] = useState({
        id: '',
        name: '',
        type: '',
        description: '',
        expirationPeriod: '',
        requirements: [''],
        processingTime: '',
        fee: '',
        renewalRequired: true,
        priority: 1
    });

    // Default government ID categories
    const idCategories = [
        'National Security & Criminal Background',
        'Transportation & Vehicle',
        'Professional & Educational',
        'Business & Commerce',
        'Health & Safety',
        'Immigration & Travel',
        'Civil Registration',
        'Tax & Financial'
    ];

    // Mock existing government IDs (in a real app, this would come from an API)
    useEffect(() => {
        const mockIds = [
            {
                id: 'nbi-clearance',
                name: 'NBI Clearance',
                type: 'National Security & Criminal Background',
                description: 'National Bureau of Investigation background check certificate',
                expirationPeriod: '1 year',
                requirements: ['Valid ID', 'Accomplished application form', 'Payment fee'],
                processingTime: '3-5 working days',
                fee: '₱115.00',
                renewalRequired: true,
                priority: 1,
                createdBy: 'system',
                dateCreated: '2024-01-15'
            },
            {
                id: 'drivers-license',
                name: 'Driver\'s License',
                type: 'Transportation & Vehicle',
                description: 'Land Transportation Office driver\'s license',
                expirationPeriod: '5 years',
                requirements: ['Medical certificate', 'Drug test', 'Driving test', 'Payment fee'],
                processingTime: '15-30 working days',
                fee: '₱585.00',
                renewalRequired: true,
                priority: 1,
                createdBy: 'system',
                dateCreated: '2024-01-15'
            }
        ];
        setExistingIds(mockIds);
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewId(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleRequirementChange = (index, value) => {
        const updatedRequirements = [...newId.requirements];
        updatedRequirements[index] = value;
        setNewId(prev => ({
            ...prev,
            requirements: updatedRequirements
        }));
    };

    const addRequirement = () => {
        setNewId(prev => ({
            ...prev,
            requirements: [...prev.requirements, '']
        }));
    };

    const removeRequirement = (index) => {
        if (newId.requirements.length > 1) {
            const updatedRequirements = newId.requirements.filter((_, i) => i !== index);
            setNewId(prev => ({
                ...prev,
                requirements: updatedRequirements
            }));
        }
    };

    const generateId = (name) => {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Generate ID from name if not provided
        const idToUse = newId.id || generateId(newId.name);
        
        // Validate form
        if (!newId.name.trim() || !newId.type || !newId.description.trim()) {
            alert('Please fill in all required fields (Name, Type, Description)');
            return;
        }

        // Check for duplicate ID
        if (existingIds.find(existing => existing.id === idToUse)) {
            alert('An ID with this identifier already exists. Please choose a different name.');
            return;
        }

        const newIdEntry = {
            ...newId,
            id: idToUse,
            requirements: newId.requirements.filter(req => req.trim()),
            createdBy: user?.username || 'admin',
            dateCreated: new Date().toISOString().split('T')[0]
        };

        setExistingIds(prev => [...prev, newIdEntry]);
        setShowAddForm(false);
        setNewId({
            id: '',
            name: '',
            type: '',
            description: '',
            expirationPeriod: '',
            requirements: [''],
            processingTime: '',
            fee: '',
            renewalRequired: true,
            priority: 1
        });

        alert('New government ID type added successfully!');
    };

    const handleDelete = (idToDelete) => {
        if (window.confirm(`Are you sure you want to delete "${idToDelete.name}"? This action cannot be undone.`)) {
            setExistingIds(prev => prev.filter(id => id.id !== idToDelete.id));
            alert('ID type deleted successfully.');
        }
    };

    const getTypeColor = (type) => {
        const colors = {
            'National Security & Criminal Background': '#dc2626',
            'Transportation & Vehicle': '#2563eb',
            'Professional & Educational': '#059669',
            'Business & Commerce': '#7c3aed',
            'Health & Safety': '#ea580c',
            'Immigration & Travel': '#0891b2',
            'Civil Registration': '#be185d',
            'Tax & Financial': '#65a30d'
        };
        return colors[type] || '#6b7280';
    };

    return (
        <div className="admin-dashboard-container">
            {/* Navigation Bar */}
            <nav className="nav-bar">
                <div className="nav-content">
                    <div className="nav-brand">
                        <span className="nav-logo">👑</span>
                        <span className="nav-title">Admin Portal</span>
                    </div>
                    <div className="nav-links">
                        <button 
                            className="nav-link" 
                            onClick={() => navigate('/dashboard')}
                        >
                            Public Dashboard
                        </button>
                        <button 
                            className="nav-link active" 
                            onClick={() => navigate('/admin')}
                        >
                            Admin Panel
                        </button>
                        <span className="nav-user">Welcome, Admin</span>
                        <button 
                            className="nav-logout" 
                            onClick={() => {
                                logout();
                                navigate('/login');
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Admin Header */}
            <div className="admin-header">
                <div className="header-content">
                    <h1>Government ID Administration Panel</h1>
                    <p>Manage and configure government ID types, requirements, and processing details</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-content">
                {/* Statistics Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📋</div>
                        <div className="stat-info">
                            <h3>{existingIds.length}</h3>
                            <p>Total ID Types</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🏷️</div>
                        <div className="stat-info">
                            <h3>{new Set(existingIds.map(id => id.type)).size}</h3>
                            <p>Categories</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-info">
                            <h3>{existingIds.filter(id => id.renewalRequired).length}</h3>
                            <p>Renewable IDs</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✨</div>
                        <div className="stat-info">
                            <h3>{existingIds.filter(id => id.createdBy !== 'system').length}</h3>
                            <p>Custom Added</p>
                        </div>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="actions-section">
                    <h2>ID Management Actions</h2>
                    <div className="action-buttons">
                        <button 
                            className="add-button"
                            onClick={() => setShowAddForm(true)}
                        >
                            ➕ Add New ID Type
                        </button>
                        <button className="export-button">
                            📤 Export Configuration
                        </button>
                        <button className="import-button">
                            📥 Import Configuration
                        </button>
                    </div>
                </div>

                {/* Add Form Modal */}
                {showAddForm && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Add New Government ID Type</h3>
                                <button 
                                    className="close-button"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="add-id-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>ID Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={newId.name}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Passport"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select
                                            name="type"
                                            value={newId.type}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {idCategories.map(category => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Description *</label>
                                    <textarea
                                        name="description"
                                        value={newId.description}
                                        onChange={handleInputChange}
                                        placeholder="Detailed description of the ID and its purpose"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Validity Period</label>
                                        <input
                                            type="text"
                                            name="expirationPeriod"
                                            value={newId.expirationPeriod}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 5 years, 1 year, 6 months"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Processing Time</label>
                                        <input
                                            type="text"
                                            name="processingTime"
                                            value={newId.processingTime}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 3-5 working days"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Fee</label>
                                        <input
                                            type="text"
                                            name="fee"
                                            value={newId.fee}
                                            onChange={handleInputChange}
                                            placeholder="e.g., ₱500.00"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Priority</label>
                                        <input
                                            type="number"
                                            name="priority"
                                            value={newId.priority}
                                            onChange={handleInputChange}
                                            min="1"
                                            max="10"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Requirements</label>
                                    {newId.requirements.map((req, index) => (
                                        <div key={index} className="requirement-row">
                                            <input
                                                type="text"
                                                value={req}
                                                onChange={(e) => handleRequirementChange(index, e.target.value)}
                                                placeholder={`Requirement ${index + 1}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeRequirement(index)}
                                                className="remove-req-button"
                                                disabled={newId.requirements.length === 1}
                                            >
                                                ➖
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addRequirement}
                                        className="add-req-button"
                                    >
                                        ➕ Add Requirement
                                    </button>
                                </div>

                                <div className="form-group checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="renewalRequired"
                                            checked={newId.renewalRequired}
                                            onChange={handleInputChange}
                                        />
                                        Renewal Required
                                    </label>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="submit-button">
                                        Add ID Type
                                    </button>
                                    <button 
                                        type="button" 
                                        className="cancel-button"
                                        onClick={() => setShowAddForm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Existing IDs Table */}
                <div className="existing-ids-section">
                    <h2>Existing Government ID Types</h2>
                    <div className="table-container">
                        <table className="ids-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Validity</th>
                                    <th>Fee</th>
                                    <th>Created By</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {existingIds.map((idItem) => (
                                    <tr key={idItem.id}>
                                        <td>
                                            <div className="id-name-cell">
                                                <strong>{idItem.name}</strong>
                                                <br />
                                                <small>{idItem.description}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <span 
                                                className="category-badge"
                                                style={{ backgroundColor: getTypeColor(idItem.type) }}
                                            >
                                                {idItem.type}
                                            </span>
                                        </td>
                                        <td>{idItem.expirationPeriod || 'N/A'}</td>
                                        <td>{idItem.fee || 'N/A'}</td>
                                        <td>
                                            <span className={`created-by ${idItem.createdBy}`}>
                                                {idItem.createdBy}
                                            </span>
                                            <br />
                                            <small>{idItem.dateCreated}</small>
                                        </td>
                                        <td>
                                            <div className="action-buttons-cell">
                                                <button className="edit-button" title="Edit">
                                                    ✏️
                                                </button>
                                                {idItem.createdBy !== 'system' && (
                                                    <button 
                                                        className="delete-button" 
                                                        title="Delete"
                                                        onClick={() => handleDelete(idItem)}
                                                    >
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;