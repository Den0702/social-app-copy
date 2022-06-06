import React, { Component } from 'react';//dlaczego to nie zostało ustawione podczas create-react-app?
import { Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom"
import '../css/App.css';
import axios from 'axios';
/* Routes */
import SignUp from './SignUp';
import Home from './Home';
import NonExisting from './NonExisting';
import LogIn from './LogIn';

class App extends Component {

    constructor() {
        super();
        /* Initial state jest ustawiany albo na zalogowanego uzytkownika albo na nic */
        this.state = {
            currentUser: localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null,
            isMessageVisible: true
        }
    }

    saveCurrentUserData = (user) => {
        //alert('Save Users data!');
        this.setState({
            currentUser: user
        })
    }

    componentDidMount() {
        //wyslac zapytanie do backendu, czy token jest wazny(zapytanie o profil uzytkownika), inaczej wyczyscic jego dane z localStorage
        this.isTokenValid();
    }

    isTokenValid = () => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + (this.state.currentUser ? this.state.currentUser.jwt_token : null)
            }
        }

        axios.post('https://akademia108.pl/api/social-app/user/profile',
            {},
            axiosConfig
        ).then(res => console.log(res)
        ).catch(() => {
            this.clearUser();
        })
    }

    clearUser = () => {
        localStorage.removeItem('currentUser')
        this.setState({ currentUser: null })
    }

    signUserOut = (e) => {
        //TO DO - powinien tutaj być preventDefault - bo inaczej wypali zdarzenie domyslne - przejscie do URL wskazanego przez linka
        e.preventDefault();
        //alert('Sign Out!');
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.state.currentUser.jwt_token
            }
        };

        axios.post(
            'https://akademia108.pl/api/social-app/user/logout',
            {},//poniewaz nie ma danych do wysłania, to wypełnia się to pustym obiektem
            axiosConfig
        )
            .then(res => {
                console.log(res.data);
                // jezeli dostamy pozytywna odpowiedz o wylogowaniu, to wtedy odswiezymy stan uzytkownika + wiadomosc o pozytywnym wylogowaniu
                this.setState(() => {
                    return {
                        logoutSuccessMessage: res.data.message,
                        currentUser: null
                    }
                })
                localStorage.removeItem('currentUser');
                //wyswietla komunikat serwera o wylogowaniu uzytkownika
                setTimeout(() => this.setState({ isMessageVisible: false }), 3000)
            },
                error => {
                    this.setState({ logoutErrorMessage: error.message })
                    localStorage.removeItem('currentUser');
                }
            )

    }

    render() {

        return (
            <div className="App">
                <header className="App-header">
                    <nav>
                        <ul>
                            <li> <Link to="/">Strona Główna</Link> </li>

                            {!this.state.currentUser && <li> <Link to="/signup">Rejestracja</Link> </li>}

                            {!this.state.currentUser && <li> <Link to="/login">Logowanie</Link> </li>}

                            {this.state.currentUser && <li> <Link to="#" onClick={(e) => this.signUserOut(e)}>Wyloguj </Link></li>}
                        </ul>
                        {this.state.isMessageVisible && this.state.logoutSuccessMessage && <p className="logout-success">{this.state.logoutSuccessMessage}</p>}
                        {this.state.isMessageVisible && this.state.logoutErrorMessage && <p className="logout-error">{this.state.logoutErrorMessage}</p>}
                    </nav>
                </header>
                <Routes>
                    <Route
                        index="/"
                        element={
                            <Home
                                currentUserProp={this.state.currentUser}
                                tokenCheckMethod={this.isTokenValid}
                                clearUserMethod={this.clearUser}/* bedzie przekazywany do komponentu potomnego wzgledem Home */
                            />
                        }
                    />
                    <Route path="signup" element={<SignUp />} />
                    <Route
                        path="login"
                        element={
                            <LogIn
                                /* logoutMethod={this.signUserOut} */
                                saveCurrentUserData={this.saveCurrentUserData}
                                currentUserProp={this.state.currentUser}
                            />
                        }
                    />
                    <Route path="*" element={<NonExisting />} />
                </Routes>
            </div>
        );
    }
}

export default App;
