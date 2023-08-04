import React, { Component } from 'react';//dlaczego to nie zostało ustawione podczas create-react-app?
import { Routes, Route } from 'react-router-dom';
import { Link } from "react-router-dom"
import '../css/App.css';
import axios from 'axios';
/* Routes */
import SignUp from './views/SignUp';
import Home from './views/Home';
import LogIn from './views/LogIn';
import AllFollows from './views/AllFollows';
import NonExisting from './views/NonExisting';

class App extends Component {

    constructor() {
        super();
        /* Initial state jest ustawiany albo na zalogowanego uzytkownika albo na nic */
        this.state = {
            currentUser: localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null,
        }
    } 

    saveCurrentUserData = (user) => {
        //alert('Save Users data!');
        this.setState({
            currentUser: user
        })
    }
    
    clearUser = (logoutSuccess) => {
        //ten warunek sie przydaje gdy ta metoda jest wywolywana z poziomu innego komponentu
        if (this.state.currentUser) {
            localStorage.removeItem('currentUser');
            this.setState(() => { 
              return {
                currentUser: null,
                logoutSuccessMessage: logoutSuccess, 
              }
            });
        }
    }

    signUserOut = (e) => {
        //TO DO - powinien tutaj być preventDefault - bo inaczej wypali zdarzenie domyslne - przejscie do URL wskazanego przez linka
        e.preventDefault();
        //alert('Sign Out!');

        axios.post(
            'https://akademia108.pl/api/social-app/user/logout'
        )
            .then(res => {
                // jezeli dostamy pozytywna odpowiedz o wylogowaniu, to wtedy odswiezymy stan uzytkownika + wiadomosc o pozytywnym wylogowaniu
                this.clearUser(res.data.message);
                //wyswietla komunikat serwera o wylogowaniu uzytkownika
                setTimeout((prevState) => (
                  this.setState(
                    { ...prevState,
                      logoutSuccessMessage: ''
                    })
                ), 3000)
            },
                error => {
                    console.log(`App: signUserOut's query caused this error: ${error}`)
                    this.setState({logoutErrorMessage: error.message })
                    setTimeout(() => this.clearUser(), 3000);
                }
            )

    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + (this.state.currentUser ? this.state.currentUser.jwt_token : null);
        axios.defaults.headers.post['Content-Type'] = 'application/json';
    }

    componentDidUpdate() {
        //reinicjalizacja domyslnych naglowkow po aktualizacji komponentu App
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + (this.state.currentUser ? this.state.currentUser.jwt_token : null);
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        
        if (this.state.logoutErrorMessage && !this.state.currentUser) {
          this.setState(() => {
            return {
              logoutErrorMessage: '',
            }
        });
        }
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

                            {this.state.currentUser && <li> <Link to="/allfollows">Subskrypcje</Link></li>}
                            
                            {this.state.currentUser && <li> <Link to="#" onClick={(e) => this.signUserOut(e)}>Wyloguj </Link></li>}
                        </ul>
                        {this.state.logoutSuccessMessage && <p className="logout-success">{this.state.logoutSuccessMessage}</p>}
                        {this.state.currentUser && this.state.logoutErrorMessage && <p className="logout-error">{this.state.logoutErrorMessage}</p>}
                    </nav>
                </header>
                <Routes>
                    <Route
                        index="/"
                        element={
                            <Home
                                currentUserProp={this.state.currentUser}
                                clearUserMethod={this.clearUser}/* bedzie przekazywany do komponentu potomnego wzgledem Home */
                            />
                        }
                    />
                    <Route 
                        path="signup" 
                        element={<SignUp />} 
                    />
                    <Route
                        path="login"
                        element={
                            <LogIn
                                saveCurrentUserData={this.saveCurrentUserData}
                                currentUserProp={this.state.currentUser}
                            />
                        }
                    />
                    {this.state.currentUser && <Route 
                        path="allfollows" 
                        element={
                            <AllFollows 
                                clearUserMethod={this.clearUser}
                                currentUserProp={this.state.currentUser}
                            />
                        } 
                    />
                    }
                    <Route 
                        path="*" 
                        element={<NonExisting />} 
                    />
                </Routes>
            </div>
        );
    }
}

export default App;
