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

    signUserOut = (e) => {
        //TO DO - powinien tutaj być preventDefault - bo inaczej wypali zdarzenie domyslne - przejscie do URL wskazanego przez linka
        e.preventDefault();
        //alert('Sign Out!');
        let axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer' + this.state.currentUser.jwt_token
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
                        logoutMessage: res.data.message,
                        currentUser: null
                    }
                })
                localStorage.removeItem('currentUser');
                setTimeout(() => this.setState({isMessageVisible: false}), 3000)
            },
                error => {
                    this.setState({ logoutMessage: error.message })
                    localStorage.removeItem('currentUser');
                }
            )
            
        }

    render() {

        return (
            <div className="App">
                <header className="App-header">
                </header>
                <nav className="main-nav">
                    <ul>
                        <li> <Link to="/">Strona Główna</Link> </li> 

                        {!this.state.currentUser && <li> <Link to="/signup">Rejestracja</Link> </li>}
                        
                        {!this.state.currentUser && <li> <Link to="/login">Logowanie</Link> </li>}
                        
                        {this.state.currentUser && <li> <Link to="#" onClick={(e) => this.signUserOut(e)}>Wyloguj </Link></li>}
                    </ul>

                    {this.state.isMessageVisible && this.state.logoutMessage && <p className="logout-error">{this.state.logoutMessage}</p> }
                </nav>    
                <Routes>
                    <Route index="/" element={<Home currentUser={this.state.currentUser}/>} />
                    <Route path="signup" element={<SignUp />} />
                    <Route 
                        path="login" 
                        element={
                            <LogIn 
                                /* logoutMethod={this.signUserOut} */
                                saveCurrentUserData={this.saveCurrentUserData}
                                currentUser={this.state.currentUser}
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
