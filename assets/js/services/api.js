/**
 * API Service for Currency Exchange Rate endpoints
 * Uses axios for HTTP requests
 */
import axios from 'axios';

// Base URL configuration - adjust if needed for different environments
const getBaseUrl = () => {
    // For Docker/localhost setup
    if (window.location.hostname === 'telemedi-zadanie.localhost') {
        return 'http://telemedi-zadanie.localhost';
    }
    // Fallback to current origin
    return window.location.origin;
};

const BASE_URL = getBaseUrl();

/**
 * Fetch current exchange rates for all supported currencies
 *
 * @returns {Promise<Object>} Response with meta and data
 * @example
 * {
 *   meta: { publicationDate: "2024-11-13", isStale: false, lastSuccessfulUpdate: "..." },
 *   data: [{ code: "EUR", nbpAverageRate: 4.32, buyRate: 4.17, sellRate: 4.43 }, ...]
 * }
 */
export const fetchCurrentRates = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/api/rates/current`);
        return response.data;
    } catch (error) {
        console.error('Error fetching current rates:', error);
        throw new Error(
            error.response?.data?.message ||
            'Failed to fetch current exchange rates'
        );
    }
};

/**
 * Fetch historical exchange rates for specific currency (14 days)
 *
 * @param {string} currencyCode - Currency code (EUR, USD, CZK, IDR, BRL)
 * @param {string|null} date - End date in YYYY-MM-DD format (default: today)
 * @returns {Promise<Array>} Array of historical rates
 * @example
 * [
 *   { date: "2024-11-13", nbpAverageRate: 4.32, buyRate: 4.17, sellRate: 4.43 },
 *   { date: "2024-11-12", nbpAverageRate: 4.30, buyRate: 4.15, sellRate: 4.41 },
 *   ...
 * ]
 */
export const fetchHistoricalRates = async (currencyCode, date = null) => {
    try {
        const params = date ? { date } : {};
        const response = await axios.get(
            `${BASE_URL}/api/rates/historical/${currencyCode}`,
            { params }
        );
        return response.data.data; // Extract data array from response
    } catch (error) {
        console.error(`Error fetching historical rates for ${currencyCode}:`, error);

        // Handle specific error cases
        if (error.response?.status === 400) {
            throw new Error('Invalid currency code or date format');
        }
        if (error.response?.status === 404) {
            throw new Error('No data available for the selected date');
        }

        throw new Error(
            error.response?.data?.message ||
            'Failed to fetch historical exchange rates'
        );
    }
};

/**
 * Format number to Polish currency format (4 decimal places)
 *
 * @param {number|null} value - Value to format
 * @returns {string} Formatted value or "-"
 */
export const formatRate = (value) => {
    if (value === null || value === undefined) {
        return '-';
    }
    return value.toFixed(4);
};

/**
 * Format date to Polish locale
 *
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date (DD.MM.YYYY)
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
};

/**
 * Get currency full name
 *
 * @param {string} code - Currency code
 * @returns {string} Full currency name
 */
export const getCurrencyName = (code) => {
    const names = {
        'EUR': 'Euro',
        'USD': 'Dolar amerykański',
        'CZK': 'Korona czeska',
        'IDR': 'Rupia indonezyjska',
        'BRL': 'Real brazylijski'
    };
    return names[code] || code;
};

export default {
    fetchCurrentRates,
    fetchHistoricalRates,
    formatRate,
    formatDate,
    getCurrencyName
};
