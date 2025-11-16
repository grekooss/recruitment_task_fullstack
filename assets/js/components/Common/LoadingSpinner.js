import React from 'react';

/**
 * Loading spinner component using Bootstrap spinner
 */
const LoadingSpinner = ({ message = 'Ładowanie danych...' }) => {
    return (
        <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Ładowanie...</span>
            </div>
            <p className="mt-3 text-muted">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
