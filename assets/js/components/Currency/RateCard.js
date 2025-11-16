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
 * Calculate percentage change (mock - in real app would come from API)
 */
const calculateChange = (buyRate, sellRate) => {
    // Mock calculation - you can replace with actual historical data comparison
    const mockChange = (Math.random() - 0.5) * 0.02; // -1% to +1%
    return mockChange;
};

/**
 * Card component for displaying individual currency rate
 * Design with flag, currency code, name, and rates
 */
const RateCard = ({ currency, buyRate, sellRate, nbpRate }) => {
    const countryCode = currencyCountries[currency] || 'XX';
    const change = calculateChange(buyRate, sellRate);
    const changePercent = (change * 100).toFixed(2);
    const changeColor = change >= 0 ? 'text-success' : 'text-danger';
    const changeSign = change >= 0 ? '+' : '';
    const currencyName = getCurrencyName(currency);

    return (
        <div className="col-12 col-sm-6 col-lg-4 mb-3">
            <div className="card shadow-sm border-0 h-100">
                <div className="card-body p-3">
                    {/* Header with flag and currency */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                            {/* Flag using flagcdn.com API */}
                            <img
                                src={`https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`}
                                alt={`${countryCode} flag`}
                                className="me-3"
                                style={{ width: '48px', height: '36px', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <div>
                                <h6 className="mb-0 fw-bold">{currency}</h6>
                                <small className="text-muted">{currencyName}</small>
                            </div>
                        </div>
                        <div className={`${changeColor} fw-bold small`}>
                            {changeSign}{changePercent}%
                        </div>
                    </div>

                    {/* Rates display */}
                    <div className="row g-2">
                        {buyRate !== null && (
                            <div className="col-6">
                                <div className="text-muted small mb-1">kupno</div>
                                <div className="fw-bold">{formatRate(buyRate)}</div>
                            </div>
                        )}
                        <div className={buyRate !== null ? 'col-6' : 'col-12'}>
                            <div className="text-muted small mb-1">sprzedaż</div>
                            <div className="fw-bold">{formatRate(sellRate)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RateCard;
