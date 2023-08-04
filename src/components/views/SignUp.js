import React, { Component } from "react";
import '../../css/SignUp.css';
import axios from 'axios';
import { Link } from "react-router-dom";

class SignUp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            login: '',
            loginError: '',
            email: '',
            emailError: '',
            passwd: '',
            passwdError: '',
            confirmPasswd: '',
            confirmPasswdError: '',

            response: '',
            signUpDone: false
        }
    }

    /**********ustawienie stanów po wypełnieniu każdego z pól formularza**********/
    handleUserLogin = (e) => {
        this.setState(() => {
            return { login: e.target.value };
        })
    }

    handleUserEmail = (e) => {
        this.setState(() => {
            return { email: e.target.value };
        })
    }

    handleUserPasswd = (e) => {
        this.setState(() => {
            return { passwd: e.target.value };
        })
    }

    handleConfirmPasswd = (e) => {
        this.setState(() => {
            return { confirmPasswd: e.target.value };
        })
    }

    validateForm = (event) => {
        event.preventDefault();

        let dataReadyToBeSent = true;

        /***************ustawienie stanów po zdarzeniu submit***************/
        //------walidacja nazwy użytkownika---------
        if (!this.state.login) {
            dataReadyToBeSent = false;
            this.setState(() => {
                return { loginError: 'Podaj nazwę użytkownika' };
            })
        } else if (this.state.login.trim().length < 4) {
            dataReadyToBeSent = false;
            this.setState(() => {
                return { loginError: 'Nazwa użytkownika powinna się składać z minimum 4 symboli' };
            })
        } else if (this.state.loginError) {
            this.setState(() => {
                return { loginError: '' }; 
            })
        }
        //----walidacja adresu poczty---
        if (!this.state.email) {
            dataReadyToBeSent = false;
            this.setState(() => {
                return { emailError: 'Podaj adres email' };
            })
        } else if (this.state.emailError) {
            this.setState(() => {
                return { emailError: '' };
            })
        }
        //----walidacja hasła-----
        if (this.state['passwd'] !== '') {
            const arrFromPasswd = Array.from(this.state['passwd']);
            let passwdCorrect = false;

            if (arrFromPasswd.length >= 6) {
                for (const char of arrFromPasswd) {
                    if (!(char === '!' || char === '#' || char === '@' || char === '$' || char === '%')) {
                        continue;
                    } else {
                        passwdCorrect = true;
                        if (this.state.passwdError) {
                            this.setState(() => {
                                return { passwdError: '' };
                            });
                        }
                        break;
                    }
                }
                if (!passwdCorrect) {
                    dataReadyToBeSent = false;
                    this.setState(() => {
                        return { passwdError: 'Niewystarczająco mocne hasło! (musi zawierać !, #, @, $ lub %)' }
                    });
                }
            } else {
                dataReadyToBeSent = false;
                this.setState(() => {
                    return { passwdError: 'Hasło jest za krótkie! (min 6 znaków)' }
                });
            }

        } else {
            dataReadyToBeSent = false;
            this.setState(() => {
                return { passwdError: 'Podaj hasło!' }
            });
        }

        //------sprawdzenie wzajemnej korelacji pomiedzy polem hasło a polem potwierdź hasło-----
        if (this.state.passwd) {

            if (!this.state.confirmPasswd) {
                dataReadyToBeSent = false;
                this.setState(() => {
                    return { confirmPasswdError: 'Potwierdź hasło!' }
                });
            } else if (this.state.passwd !== this.state.confirmPasswd) {
                dataReadyToBeSent = false;
                this.setState(() => {
                    return { confirmPasswdError: 'Podane hasła się nie zgadzają!' }
                });
            } else {
                this.setState(() => {
                    return { confirmPasswdError: '' }
                });
            }
        }
        if (dataReadyToBeSent) {
            this.signUserUp();
        }
    }

    signUserUp = () => {
        console.log('signUserUp()');

        const userData = {
            username: this.state.login,
            password: this.state.passwd,
            email: this.state.email
        }

        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        axios.post(
            'https://akademia108.pl/api/social-app/user/signup',
            JSON.stringify(userData),
            axiosConfig
        ).then(res => {
            if (res.data.signedup) {
                this.setState({
                    response: `Dziękujemy, ${res.data.user.username}, jesteś zarejestrowany`,
                    signUpDone: true
                })
            } else if (res.data.message.username) {
                this.setState({ response: `Błąd: ${res.data.message.username[0]}` })
            } else if (res.data.message.email) {
                this.setState({ response: `Błąd: ${res.data.message.email[0]}` })
            }
        }).catch(err => console.log("Błąd: ", err));
    }

    render() {
        return (
            <section className="sign-up">
                <form
                    className="form signup-form"
                    action=""
                    onSubmit={this.validateForm}
                >
                    <label htmlFor="login" className={this.state.loginError ? 'error' : ''}>Nazwa użytkownika</label>
                    <input
                        onChange={this.handleUserLogin}
                        type="text" id="login"
                        className={`input-item ${this.state.loginError ? 'error-underline' : ''}`}
                    />

                    <label htmlFor="email" className={this.state.emailError ? 'error' : ''}>Adres email</label>
                    <input
                        onChange={this.handleUserEmail}
                        type="email"
                        id="email"
                        className={`input-item ${this.state.emailError ? 'error-underline' : ''}`}
                    />

                    <label htmlFor="passwd" className={this.state.passwdError ? 'error' : ''}>Hasło</label>
                    <input
                        onChange={this.handleUserPasswd}
                        type="password" id="passwd"
                        className={`input-item ${this.state.passwdError ? 'error-underline' : ''}`}
                    />

                    <label htmlFor="confirm-passwd" className={this.state.confirmPasswdError ? 'error' : ''}>Potwierdzenie hasła</label>
                    <input
                        onChange={this.handleConfirmPasswd}
                        type="password" id="confirm-passwd"
                        className={`input-item ${this.state.confirmPasswdError ? 'error-underline' : ''}`}
                    />

                    {!(this.state.loginError === '') && <p className='clientErrorMessage message'>{this.state.loginError}</p>}
                    {!(this.state.emailError === '') && <p className='clientErrorMessage message'>{this.state.emailError}</p>}
                    {!(this.state.passwdError === '') && <p className='clientErrorMessage message'>{this.state.passwdError}</p>}
                    {!(this.state.confirmPasswdError === '') && <p className='clientErrorMessage message'>{this.state.confirmPasswdError}</p>}
                    {this.state.response !== '' && <p className="serverResponse message">{this.state.response}</p>}

                    {this.state.signUpDone ?
                        <Link to="/login" className="btn login-redirect">Przejdź do logowania</Link>
                            :
                        <button type="submit" className="btn btn-submit">Zarejestruj się</button>
                    }
                </form>
            </section>
        );
    }

}

export default SignUp;