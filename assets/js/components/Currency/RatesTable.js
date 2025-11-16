import React from 'react';
import { formatRate, getCurrencyName } from '../../services/api';

/**
 * Currency to country code mapping for flag display
 */
const currencyCountries = {
    'EUR': 'EU',
    'USD': 'US',
    'GBP': 'GB',
    'CHF': 'CH',
    'NOK': 'NO',
    'SEK': 'SE',
    'DKK': 'DK',
    'CAD': 'CA',
    'JPY': 'JP',
    'CZK': 'CZ',
    'IDR': 'ID',
    'BRL': 'BR'
};

/**
 * Responsive table component for displaying currency exchange rates
 * Following Bootstrap 5 style guide patterns with flags and card-like styling
 */
const RatesTable = ({ rates, showDate = false, currencyCode = null }) => {
    return (
        <div className="row g-4">
            {rates.map((rate, index) => {
                // Use currencyCode prop for historical rates, or rate.code for current rates
                const code = currencyCode || rate.code;
                const countryCode = currencyCountries[code] || 'XX';
                return (
                    <div key={rate.code || `rate-${index}`} className="col-12 mb-2">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-2">
                                <div className="row align-items-center g-0 mx-0">
                                    {/* Currency info with flag - ALWAYS show */}
                                    <div className={`col-12 ${showDate ? 'col-md-3' : 'col-md-4'} mb-3 mb-md-0 px-0`}>
                                        <div className="d-flex align-items-center gap-2">
                                            <img
                                                src={`https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`}
                                                alt={`${countryCode} flag`}
                                                style={{ width: '48px', height: '36px', objectFit: 'cover', marginRight: '1rem' }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                            <div>
                                                <h6 className="mb-0 fw-bold">{code}</h6>
                                                <small className="text-muted">{getCurrencyName(code)}</small>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date (if shown) */}
                                    {showDate && (
                                        <div className="col-6 col-md-2 mb-2 mb-md-0 px-0">
                                            <div className="text-muted small mb-1">Data</div>
                                            <div className="fw-bold">{rate.date}</div>
                                        </div>
                                    )}

                                    {/* NBP Rate */}
                                    <div className={`col-6 ${showDate ? 'col-md-2' : 'col-md-3'} mb-2 mb-md-0 px-0`}>
                                        <div className="text-muted small mb-1">Kurs NBP</div>
                                        <div className="fw-bold fs-5">{formatRate(rate.nbpAverageRate)} PLN</div>
                                    </div>

                                    {/* Buy Rate */}
                                    <div className={`col-6 ${showDate ? 'col-md-2' : 'col-md-3'} mb-2 mb-md-0 px-0`}>
                                        <div className="text-muted small mb-1">Kupno</div>
                                        {rate.buyRate !== null ? (
                                            <div className="text-success fw-bold fs-5">
                                                {formatRate(rate.buyRate)} PLN
                                            </div>
                                        ) : (
                                            <div className="text-muted">-</div>
                                        )}
                                    </div>

                                    {/* Sell Rate */}
                                    <div className={`col-6 ${showDate ? 'col-md-2' : 'col-md-2'} mb-2 mb-md-0 px-0`}>
                                        <div className="text-muted small mb-1">Sprzedaż</div>
                                        <div className="text-danger fw-bold fs-5">
                                            {formatRate(rate.sellRate)} PLN
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RatesTable;
