import React from 'react';

/**
 * Loading spinner component using Bootstrap 5 spinner
 * Following Bootstrap 5 style guide patterns
 */
const LoadingSpinner = ({ message = 'Ładowanie danych...' }) => {
    return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Ładowanie...</span>
            </div>
            <p className="mt-3 text-muted fw-normal">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
