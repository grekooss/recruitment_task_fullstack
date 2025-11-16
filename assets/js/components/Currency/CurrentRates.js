import React, { Component } from 'react';
import { fetchCurrentRates, formatRate, getCurrencyName } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';

/**
 * Component displaying current exchange rates for all supported currencies
 */
class CurrentRates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            meta: null,
            loading: true,
            error: null
        };
    }

    componentDidMount() {
        this.loadCurrentRates();
    }

    loadCurrentRates = async () => {
        this.setState({ loading: true, error: null });

        try {
            const response = await fetchCurrentRates();
            this.setState({
                data: response.data,
                meta: response.meta,
                loading: false
            });
        } catch (error) {
            this.setState({
                error: error.message,
                loading: false
            });
        }
    };

    render() {
        const { data, meta, loading, error } = this.state;

        return (
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="mb-4">
                            <i className="fa fa-money"></i> Bieżące kursy walut
                        </h2>

                        {loading && <LoadingSpinner message="Pobieranie aktualnych kursów..." />}

                        {error && (
                            <ErrorAlert message={error} onRetry={this.loadCurrentRates} />
                        )}

                        {!loading && !error && meta && (
                            <div>
                                {/* Meta information */}
                                <div className="alert alert-info mb-4">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <strong>Data publikacji NBP:</strong> {meta.publicationDate}
                                        </div>
                                        <div className="col-md-6 text-right">
                                            {meta.isStale ? (
                                                <span className="badge badge-warning">
                                                    <i className="fa fa-exclamation-triangle"></i> Dane z cache
                                                </span>
                                            ) : (
                                                <span className="badge badge-success">
                                                    <i className="fa fa-check"></i> Dane aktualne
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <small className="text-muted d-block mt-2">
                                        Ostatnia aktualizacja: {new Date(meta.lastSuccessfulUpdate).toLocaleString('pl-PL')}
                                    </small>
                                </div>

                                {/* Rates table */}
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>Waluta</th>
                                                <th className="text-right">Kurs NBP</th>
                                                <th className="text-right">Kurs kupna</th>
                                                <th className="text-right">Kurs sprzedaży</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((rate) => (
                                                <tr key={rate.code}>
                                                    <td>
                                                        <strong>{rate.code}</strong>
                                                        <br />
                                                        <small className="text-muted">
                                                            {getCurrencyName(rate.code)}
                                                        </small>
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

                                {/* Info note */}
                                <div className="alert alert-light mt-3">
                                    <small>
                                        <strong>Legenda:</strong>
                                        <ul className="mb-0 mt-2">
                                            <li><span className="text-success">Kurs kupna</span> - cena po której kantor skupuje walutę od klienta</li>
                                            <li><span className="text-danger">Kurs sprzedaży</span> - cena po której kantor sprzedaje walutę klientowi</li>
                                            <li>"-" oznacza, że kantor nie skupuje danej waluty</li>
                                        </ul>
                                    </small>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default CurrentRates;
