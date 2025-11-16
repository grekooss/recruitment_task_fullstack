import React, { Component } from 'react';
import { fetchHistoricalRates, formatRate, formatDate, getCurrencyName } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';

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
            selectedDate: this.getTodayDate()
        };
    }

    getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD format
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
                loading: false
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
        const { data, loading, error, selectedCurrency, selectedDate } = this.state;

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
                    <div className="col-md-12">
                        <h2 className="mb-4">
                            <i className="fa fa-line-chart"></i> Historia kursów
                        </h2>

                        {/* Filter form */}
                        <div className="card mb-4">
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-5">
                                            <div className="form-group">
                                                <label htmlFor="currency">Wybierz walutę:</label>
                                                <select
                                                    id="currency"
                                                    className="form-control"
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
                                        </div>

                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="date">Data końcowa:</label>
                                                <input
                                                    type="date"
                                                    id="date"
                                                    className="form-control"
                                                    value={selectedDate}
                                                    onChange={this.handleDateChange}
                                                    max={this.getTodayDate()}
                                                />
                                                <small className="form-text text-muted">
                                                    Wyświetli 14 dni wstecz od wybranej daty
                                                </small>
                                            </div>
                                        </div>

                                        <div className="col-md-3">
                                            <label className="d-block">&nbsp;</label>
                                            <button type="submit" className="btn btn-primary btn-block">
                                                <i className="fa fa-search"></i> Pokaż historię
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
                                {/* Info header */}
                                <div className="alert alert-info mb-3">
                                    Wyświetlam kursy dla <strong>{getCurrencyName(selectedCurrency)} ({selectedCurrency})</strong> za 14 dni wstecz od <strong>{formatDate(selectedDate)}</strong>
                                </div>

                                {/* Historical rates table */}
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>Data</th>
                                                <th className="text-right">Kurs NBP</th>
                                                <th className="text-right">Kurs kupna</th>
                                                <th className="text-right">Kurs sprzedaży</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((rate, index) => (
                                                <tr key={`${rate.date}-${index}`}>
                                                    <td>
                                                        <strong>{formatDate(rate.date)}</strong>
                                                        <br />
                                                        <small className="text-muted">{rate.date}</small>
                                                    </td>
                                                    <td className="text-right">
                                                        {formatRate(rate.nbpAverageRate)} PLN
                                                    </td>
                                                    <td className="text-right">
                                                        {rate.buyRate !== null ? (
                                                            <span className="text-success">
                                                                <strong>{formatRate(rate.buyRate)} PLN</strong>
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted">-</span>
                                                        )}
                                                    </td>
                                                    <td className="text-right">
                                                        <span className="text-danger">
                                                            <strong>{formatRate(rate.sellRate)} PLN</strong>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {!loading && !error && data.length === 0 && (
                            <div className="alert alert-warning">
                                <i className="fa fa-info-circle"></i> Wybierz walutę i datę, a następnie kliknij "Pokaż historię", aby wyświetlić dane.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default HistoricalRates;
