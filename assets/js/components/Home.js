// ./assets/js/components/Home.js

import React, {Component} from 'react';
import {Route, Redirect, Switch, Link} from 'react-router-dom';
import SetupCheck from "./SetupCheck";
import CurrentRates from "./Currency/CurrentRates";
import HistoricalRates from "./Currency/HistoricalRates";

class Home extends Component {

    render() {
        return (
            <div>
                {/* Navigation - Bootstrap 5 classes */}
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
                    <div className="container">
                        <div className="w-100">
                            {/* Brand - centered at top */}
                            <div className="text-center py-2">
                                <h3 className="navbar-brand fw-bold mb-0 d-inline-block">
                                    <i className="fa fa-money"></i> Kantor - Kursy Walut
                                </h3>
                            </div>

                            {/* Navigation links - centered below brand */}
                            <div className="d-flex justify-content-center">
                                <ul className="navbar-nav flex-row gap-4">
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/">
                                            Bieżące kursy
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/history">
                                            <i className="fa fa-line-chart"></i> Historia kursów
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/setup-check">
                                            <i className="fa fa-cog"></i> Setup Check
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main content routing */}
                <Switch>
                    <Route exact path="/" component={CurrentRates} />
                    <Route path="/history" component={HistoricalRates} />
                    <Route path="/setup-check" component={SetupCheck} />
                    <Redirect to="/" />
                </Switch>
            </div>
        )
    }
}

export default Home;
