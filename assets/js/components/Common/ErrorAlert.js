import React from 'react';

/**
 * Error alert component using Bootstrap 5 alert
 * Following Bootstrap 5 style guide patterns with dismissible option
 */
const ErrorAlert = ({ message, onRetry = null }) => {
    return (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <h5 className="alert-heading">
                <i className="fa fa-exclamation-triangle"></i> Błąd
            </h5>
            <p className="mb-0">{message}</p>
            {onRetry && (
                <>
                    <hr />
                    <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
                        <i className="fa fa-refresh"></i> Spróbuj ponownie
                    </button>
                </>
            )}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    );
};

export default ErrorAlert;
