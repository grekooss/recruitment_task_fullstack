import React from 'react';

/**
 * Error alert component using Bootstrap alert
 */
const ErrorAlert = ({ message, onRetry = null }) => {
    return (
        <div className="alert alert-danger" role="alert">
            <h5 className="alert-heading">
                <i className="fa fa-exclamation-triangle"></i> Błąd
            </h5>
            <p className="mb-0">{message}</p>
            {onRetry && (
                <div className="mt-3">
                    <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
                        <i className="fa fa-refresh"></i> Spróbuj ponownie
                    </button>
                </div>
            )}
        </div>
    );
};

export default ErrorAlert;
