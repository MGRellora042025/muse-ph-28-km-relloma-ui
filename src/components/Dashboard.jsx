import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function Dashboard() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredIds, setFilteredIds] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [activeTab, setActiveTab] = useState('my-ids'); // 'my-ids', 'all-ids'
    const [subscriptions, setSubscriptions] = useState({
        'nbi-clearance': true,
        'drivers-license': false,
        'passport': true,
        'sss-id': true
    });

    // User's personal IDs with expiration tracking
    const userIds = useMemo(() => [
        {
            id: 'nbi-clearance',
            name: 'NBI Clearance',
            type: 'National Security & Criminal Background',
            status: 'active',
            obtainedDate: '2024-08-15',
            expirationDate: '2025-02-15', // Expires in 1 month
            daysUntilExpiration: 30,
            needsRenewal: true,
            urgencyLevel: 'high', // high, medium, low
            certificateNumber: 'NBI-2024-001234'
        },
        {
            id: 'drivers-license',
            name: 'Driver\'s License',
            type: 'Transportation & Vehicle',
            status: 'active',
            obtainedDate: '2020-03-10',
            expirationDate: '2025-03-10',
            daysUntilExpiration: 167,
            needsRenewal: false,
            urgencyLevel: 'medium',
            licenseNumber: 'N01-20-001234'
        },
        {
            id: 'passport',
            name: 'Philippine Passport',
            type: 'Immigration & Travel',
            status: 'active',
            obtainedDate: '2019-07-20',
            expirationDate: '2029-07-20',
            daysUntilExpiration: 1400,
            needsRenewal: false,
            urgencyLevel: 'low',
            passportNumber: 'P1234567A'
        },
        {
            id: 'sss-id',
            name: 'SSS ID',
            type: 'Social Security',
            status: 'expired',
            obtainedDate: '2018-05-15',
            expirationDate: '2023-05-15',
            daysUntilExpiration: -300,
            needsRenewal: true,
            urgencyLevel: 'critical',
            sssNumber: '03-1234567-8'
        }
    ], []);

    // Calculate urgency based on days until expiration
    const calculateUrgency = (daysUntilExpiration) => {
        if (daysUntilExpiration < 0) return 'critical'; // Expired
        if (daysUntilExpiration <= 30) return 'high'; // Within 1 month
        if (daysUntilExpiration <= 90) return 'medium'; // Within 3 months
        return 'low'; // More than 3 months
    };

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

    // Sort user IDs by urgency and expiration
    const sortedUserIds = useMemo(() => {
        return [...userIds].sort((a, b) => {
            // First sort by urgency (critical > high > medium > low)
            const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            const urgencyDiff = urgencyOrder[b.urgencyLevel] - urgencyOrder[a.urgencyLevel];
            if (urgencyDiff !== 0) return urgencyDiff;
            
            // Then sort by days until expiration (sooner first)
            return a.daysUntilExpiration - b.daysUntilExpiration;
        });
    }, [userIds]);

    const filterIds = useCallback(() => {
        let filtered = governmentIds;
        
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(id => id.type === selectedCategory);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(id => 
                id.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                id.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                id.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setFilteredIds(filtered);
    }, [searchTerm, selectedCategory, governmentIds]);    useEffect(() => {
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

    const getUrgencyColor = (urgencyLevel) => {
        switch (urgencyLevel) {
            case 'critical': return '#dc3545';
            case 'high': return '#fd7e14';
            case 'medium': return '#ffc107';
            case 'low': return '#28a745';
            default: return '#6c757d';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleSubscriptionToggle = (idKey) => {
        setSubscriptions(prev => ({
            ...prev,
            [idKey]: !prev[idKey]
        }));
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
                    <h1>Government ID Management Dashboard</h1>
                    <p>Manage your existing IDs and explore available government services</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button 
                    className={`tab-button ${activeTab === 'my-ids' ? 'active' : ''}`}
                    onClick={() => setActiveTab('my-ids')}
                >
                    My IDs ({userIds.length})
                </button>
                <button 
                    className={`tab-button ${activeTab === 'all-ids' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all-ids')}
                >
                    All Available IDs
                </button>
            </div>

            {/* My IDs Tab */}
            {activeTab === 'my-ids' && (
                <div className="my-ids-section">
                    <div className="security-warning">
                        <h3>🔒 Security Alert</h3>
                        <p><strong>Important:</strong> The Philippine Government Portal will NEVER send links via SMS or email. Be vigilant about suspicious messages with URLs asking for personal information or directing you to fake websites. Always verify communications through official government channels.</p>
                    </div>

                    <div className="priority-notice">
                        <h3>🚨 IDs Requiring Immediate Action</h3>
                        <p>These documents need your attention soon or have already expired</p>
                    </div>

                    <div className="user-ids-grid">
                        {sortedUserIds.map(userID => (
                            <div key={userID.id} className={`user-id-card ${userID.urgencyLevel}`}>
                                <div className="user-id-header">
                                    <h3>{userID.name}</h3>
                                    <div className="urgency-badge" style={{ backgroundColor: getUrgencyColor(userID.urgencyLevel) }}>
                                        {userID.urgencyLevel.toUpperCase()}
                                    </div>
                                </div>
                                
                                <div className="user-id-content">
                                    <div className="id-status">
                                        <span className={`status-badge ${userID.status}`}>
                                            {userID.status.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <div className="id-dates">
                                        <div className="date-item">
                                            <strong>Obtained:</strong> {formatDate(userID.obtainedDate)}
                                        </div>
                                        <div className="date-item">
                                            <strong>Expires:</strong> {formatDate(userID.expirationDate)}
                                        </div>
                                        <div className={`expiration-warning ${userID.urgencyLevel}`}>
                                            {userID.daysUntilExpiration < 0 
                                                ? `Expired ${Math.abs(userID.daysUntilExpiration)} days ago` 
                                                : userID.daysUntilExpiration === 0
                                                ? 'Expires today!'
                                                : `Expires in ${userID.daysUntilExpiration} days`
                                            }
                                        </div>
                                    </div>

                                    <div className="id-number">
                                        <strong>ID Number:</strong> {userID.certificateNumber || userID.licenseNumber || userID.passportNumber || userID.sssNumber}
                                    </div>

                                    <div className="notification-subscription">
                                        <label className="subscription-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={subscriptions[userID.id]}
                                                onChange={() => handleSubscriptionToggle(userID.id)}
                                            />
                                            <span className="checkmark"></span>
                                            <span className="subscription-text">
                                                📱 Subscribe to SMS & Email notifications for expiration reminders
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="user-id-actions">
                                    {userID.needsRenewal && (
                                        <button className="renew-button priority">
                                            Renew Now
                                        </button>
                                    )}
                                    <button className="view-button">View Details</button>
                                    <button className="download-button">Download Copy</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All IDs Tab */}
            {activeTab === 'all-ids' && (
                <div className="all-ids-section">
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
            )}
        </div>
    );
}

export default Dashboard;