import React, { Component } from 'react';
import { fetchCurrentRates } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorAlert from '../Common/ErrorAlert';
import RatesTable from './RatesTable';

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
                    <div className="col-12">
                        {/* Header */}
                        <div className="mb-4">
                            <h2 className="mb-0">
                                Bieżące kursy walut
                            </h2>
                        </div>

                        {loading && <LoadingSpinner message="Pobieranie aktualnych kursów..." />}

                        {error && (
                            <ErrorAlert message={error} onRetry={this.loadCurrentRates} />
                        )}

                        {!loading && !error && meta && (
                            <div>
                                {/* Meta information - Bootstrap 5 classes */}
                                <div className="card shadow-sm border-0 mb-4">
                                    <div className="card-body p-3">
                                        Data publikacji NBP: <strong>{meta.publicationDate}, {new Date(meta.publicationDate).toLocaleDateString('pl-PL', { weekday: 'long' })}</strong>
                                    </div>
                                </div>

                                {/* Rates display - Table view */}
                                <RatesTable rates={data} />

                                {/* Info note - Bootstrap 5 classes */}
                                <div className="alert alert-light border mt-4">
                                    <h6 className="alert-heading">
                                        <i className="fa fa-info-circle"></i> Legenda
                                    </h6>
                                    <ul className="mb-0 small">
                                        <li><span className="text-success fw-bold">Kurs kupna</span> - cena po której kantor skupuje walutę od klienta</li>
                                        <li><span className="text-danger fw-bold">Kurs sprzedaży</span> - cena po której kantor sprzedaje walutę klientowi</li>
                                        <li>"-" oznacza, że kantor nie skupuje danej waluty</li>
                                    </ul>
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
