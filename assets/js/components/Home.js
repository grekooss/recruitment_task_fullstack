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
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className={"navbar-brand"} to={"/"}>
                        <i className="fa fa-money"></i> Kantor - Kursy Walut
                    </Link>
                    <div id="navbarText">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <Link className={"nav-link"} to={"/"}>
                                    <i className="fa fa-home"></i> Bieżące kursy
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={"nav-link"} to={"/history"}>
                                    <i className="fa fa-line-chart"></i> Historia kursów
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={"nav-link"} to={"/setup-check"}>
                                    <i className="fa fa-cog"></i> Setup Check
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
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
