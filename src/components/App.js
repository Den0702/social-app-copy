import React, { Component } from 'react';//dlaczego to nie ustawiono podczas create-react-app?
import { Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom"
import '../css/App.css';
import SignUp from './SignUp';
import Home from './Home';
import NonExisting from './NonExisting';

class App extends Component {

    constructor() {
        super();
    }

    render() {

        return (
            <div className="App">
                <header className="App-header">
                </header>
                <nav className="main-nav">
                    <ul>
                        <li>
                            <Link to="/">Strona Główna</Link>
                        </li>
                        <li>
                            <Link to="/signup">Rejestracja</Link>
                        </li>
                        <li>
                            <Link to="/login">Logowanie</Link>
                        </li>
                    </ul>
                </nav>    
                <Routes>
                    <Route index="/" element={<Home />} />
                    <Route path="signup" element={<SignUp />} />
                    <Route path="*" element={<NonExisting />} />          
                </Routes>

            </div>
        );
    }
}

export default App;
