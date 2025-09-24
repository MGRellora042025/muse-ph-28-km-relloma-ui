import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function Dashboard() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredIds, setFilteredIds] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Government IDs data sorted by type/usage
    const governmentIds = useMemo(() => [
        // National Security & Criminal Background
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
            priority: 1
        },
        {
            id: 'police-clearance',
            name: 'Police Clearance',
            type: 'National Security & Criminal Background',
            description: 'Philippine National Police background check certificate',
            expirationPeriod: '6 months',
            requirements: ['Valid ID', 'Barangay clearance', 'Payment fee'],
            processingTime: '1-3 working days',
            fee: '₱100.00',
            renewalRequired: true,
            priority: 2
        },

        // Transportation & Vehicle
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
            priority: 1
        },
        {
            id: 'vehicle-registration',
            name: 'Vehicle Registration',
            type: 'Transportation & Vehicle',
            description: 'Certificate of Registration and Official Receipt',
            expirationPeriod: '1 year',
            requirements: ['Original OR/CR', 'Insurance certificate', 'Emission test', 'Payment fee'],
            processingTime: '1-2 working days',
            fee: 'Varies by vehicle type',
            renewalRequired: true,
            priority: 2
        },

        // Professional & Educational
        {
            id: 'teaching-license',
            name: 'Professional Teaching License',
            type: 'Professional & Educational',
            description: 'Professional Regulation Commission teaching license',
            expirationPeriod: '3 years',
            requirements: ['Education credentials', 'Board exam results', 'Professional ID photo', 'Payment fee'],
            processingTime: '10-15 working days',
            fee: '₱450.00',
            renewalRequired: true,
            priority: 1
        },
        {
            id: 'nursing-license',
            name: 'Nursing License',
            type: 'Professional & Educational',
            description: 'Professional Regulation Commission nursing license',
            expirationPeriod: '3 years',
            requirements: ['Nursing degree', 'Board exam certificate', 'Professional ID photo', 'Payment fee'],
            processingTime: '10-15 working days',
            fee: '₱450.00',
            renewalRequired: true,
            priority: 2
        },

        // Business & Commerce
        {
            id: 'business-permit',
            name: 'Business Permit',
            type: 'Business & Commerce',
            description: 'Mayor\'s permit to operate a business',
            expirationPeriod: '1 year',
            requirements: ['Business registration', 'Tax clearance', 'Sanitary permit', 'Payment fee'],
            processingTime: '5-10 working days',
            fee: 'Varies by business type',
            renewalRequired: true,
            priority: 1
        },
        {
            id: 'dti-registration',
            name: 'DTI Business Registration',
            type: 'Business & Commerce',
            description: 'Department of Trade and Industry business name registration',
            expirationPeriod: '5 years',
            requirements: ['Business name search', 'Application form', 'Payment fee'],
            processingTime: '1-2 working days',
            fee: '₱200.00',
            renewalRequired: true,
            priority: 2
        },

        // Health & Safety
        {
            id: 'health-certificate',
            name: 'Health Certificate',
            type: 'Health & Safety',
            description: 'Medical certificate for employment or travel',
            expirationPeriod: '1 year',
            requirements: ['Medical examination', 'Laboratory tests', 'Payment fee'],
            processingTime: '1-3 working days',
            fee: '₱200.00 - ₱500.00',
            renewalRequired: true,
            priority: 1
        }
    ], []);

    // Get unique categories
    const categories = ['all', ...new Set(governmentIds.map(id => id.type))];

    const filterIds = useCallback(() => {
        let filtered = governmentIds;

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(id => id.type === selectedCategory);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(id => 
                id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                id.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                id.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort by type, then by priority
        filtered.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type.localeCompare(b.type);
            }
            return a.priority - b.priority;
        });

        setFilteredIds(filtered);
    }, [searchTerm, selectedCategory, governmentIds]);

    useEffect(() => {
        filterIds();
    }, [filterIds]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setSelectedCategory('all');
    };

    const getExpirationColor = (period) => {
        if (period.includes('6 months') || period.includes('1 year')) {
            return 'urgent';
        } else if (period.includes('3 years')) {
            return 'moderate';
        }
        return 'normal';
    };

    return (
        <div className="dashboard-container">
            {/* Navigation Bar */}
            <nav className="nav-bar">
                <div className="nav-content">
                    <div className="nav-brand">
                        <span className="nav-logo">🏛️</span>
                        <span className="nav-title">Gov Portal</span>
                    </div>
                    <div className="nav-links">
                        <button 
                            className="nav-link active" 
                            onClick={() => navigate('/dashboard')}
                        >
                            Dashboard
                        </button>
                        {user?.role === 'admin' && (
                            <button 
                                className="nav-link admin-link" 
                                onClick={() => navigate('/admin')}
                            >
                                👑 Admin Panel
                            </button>
                        )}
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

            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Government ID Requirements Dashboard</h1>
                    <p>Search and view requirements for various government-issued documents and licenses</p>
                </div>
            </div>

            {/* Search Section */}
            <div className="search-section">
                <div className="search-container">
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for government IDs, licenses, or certificates..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <button className="search-button" type="button">
                            🔍
                        </button>
                        {searchTerm && (
                            <button className="clear-search-button" onClick={clearSearch}>
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="category-filter">
                <div className="filter-container">
                    <h3>Filter by Category:</h3>
                    <div className="category-buttons">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(category)}
                            >
                                {category === 'all' ? 'All Categories' : category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="results-section">
                <div className="results-header">
                    <h2>
                        {filteredIds.length > 0 
                            ? `Found ${filteredIds.length} result${filteredIds.length !== 1 ? 's' : ''}`
                            : 'No results found'
                        }
                    </h2>
                    {searchTerm && (
                        <p>Search results for: "<strong>{searchTerm}</strong>"</p>
                    )}
                </div>

                {/* ID Cards Grid */}
                <div className="id-cards-grid">
                    {filteredIds.map(idItem => (
                        <div key={idItem.id} className="id-card">
                            <div className="id-card-header">
                                <h3 className="id-name">{idItem.name}</h3>
                                <span className="id-category">{idItem.type}</span>
                            </div>
                            
                            <div className="id-card-body">
                                <p className="id-description">{idItem.description}</p>
                                
                                <div className="id-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Validity Period:</span>
                                        <span className={`detail-value expiration-${getExpirationColor(idItem.expirationPeriod)}`}>
                                            {idItem.expirationPeriod}
                                        </span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Processing Time:</span>
                                        <span className="detail-value">{idItem.processingTime}</span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Fee:</span>
                                        <span className="detail-value fee">{idItem.fee}</span>
                                    </div>
                                </div>
                                
                                <div className="requirements-section">
                                    <h4>Requirements:</h4>
                                    <ul className="requirements-list">
                                        {idItem.requirements.map((req, index) => (
                                            <li key={index}>{req}</li>
                                        ))}
                                    </ul>
                                </div>
                                
                                {idItem.renewalRequired && (
                                    <div className="renewal-notice">
                                        ⚠️ Renewal required before expiration
                                    </div>
                                )}
                            </div>
                            
                            <div className="id-card-footer">
                                <button className="action-button primary">
                                    View Full Requirements
                                </button>
                                <button className="action-button secondary">
                                    Find Office Location
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredIds.length === 0 && (
                    <div className="no-results">
                        <div className="no-results-icon">📋</div>
                        <h3>No government IDs found</h3>
                        <p>Try adjusting your search terms or category filter</p>
                        <button className="reset-button" onClick={clearSearch}>
                            Reset Search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;