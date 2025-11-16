import React, { Component } from 'react';
import { fetchHistoricalRates, formatDate, getCurrencyName } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';
import RatesTable from './RatesTable';

/**
 * Component displaying historical exchange rates for selected currency
 */
class HistoricalRates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            error: null,
            selectedCurrency: 'EUR',
            selectedDate: this.getTodayDate(),
            loadedCurrency: null // Currency currently displayed in table
        };
    }

    getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD format
    };

    getCurrencyCountryCode = (currency) => {
        const currencyCountries = {
            'EUR': 'EU',
            'USD': 'US',
            'CZK': 'CZ',
            'IDR': 'ID',
            'BRL': 'BR'
        };
        return currencyCountries[currency] || 'XX';
    };

    handleCurrencyChange = (event) => {
        this.setState({ selectedCurrency: event.target.value });
    };

    handleDateChange = (event) => {
        this.setState({ selectedDate: event.target.value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.loadHistoricalRates();
    };

    loadHistoricalRates = async () => {
        const { selectedCurrency, selectedDate } = this.state;
        this.setState({ loading: true, error: null });

        try {
            const data = await fetchHistoricalRates(selectedCurrency, selectedDate);
            this.setState({
                data: data,
                loading: false,
                loadedCurrency: selectedCurrency // Save the currency that was loaded
            });
        } catch (error) {
            this.setState({
                error: error.message,
                loading: false,
                data: []
            });
        }
    };

    render() {
        const { data, loading, error, selectedCurrency, selectedDate, loadedCurrency } = this.state;

        const currencies = [
            { code: 'EUR', name: 'Euro' },
            { code: 'USD', name: 'Dolar amerykański' },
            { code: 'CZK', name: 'Korona czeska' },
            { code: 'IDR', name: 'Rupia indonezyjska' },
            { code: 'BRL', name: 'Real brazylijski' }
        ];

        return (
            <div className="container mt-4">
                <div className="row">
                    <div className="col-12">
                        {/* Header */}
                        <div className="mb-4">
                            <h2 className="mb-0">
                                Historia kursów
                            </h2>
                        </div>

                        {/* Filter form - Bootstrap 5 classes */}
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body p-3">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-5">
                                            <label htmlFor="currency" className="form-label fw-bold">
                                                Wybierz walutę:
                                            </label>
                                            <select
                                                id="currency"
                                                className="form-select"
                                                value={selectedCurrency}
                                                onChange={this.handleCurrencyChange}
                                            >
                                                {currencies.map((curr) => (
                                                    <option key={curr.code} value={curr.code}>
                                                        {curr.code} - {curr.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label htmlFor="date" className="form-label fw-bold">
                                                Data końcowa:
                                            </label>
                                            <input
                                                type="date"
                                                id="date"
                                                className="form-control mb-1"
                                                value={selectedDate}
                                                onChange={this.handleDateChange}
                                                max={this.getTodayDate()}
                                            />
                                            <div className="form-text small" style={{ marginTop: '-0.25rem' }}>
                                                Wyświetli 14 dni wstecz
                                            </div>
                                        </div>

                                        <div className="col-md-3 d-flex align-items-start">
                                            <button type="submit" className="btn btn-dark w-100" style={{ marginTop: '2rem' }}>
                                                Pokaż historię
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {loading && <LoadingSpinner message="Pobieranie danych historycznych..." />}

                        {error && (
                            <ErrorAlert message={error} onRetry={this.loadHistoricalRates} />
                        )}

                        {!loading && !error && data.length > 0 && (
                            <div>
                                {/* Historical rates table using new component */}
                                <RatesTable rates={data} showDate={true} currencyCode={loadedCurrency} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default HistoricalRates;
