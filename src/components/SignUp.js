import React, { Component } from "react";
import '../css/SignUp.css';
import axios from 'axios';

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
            confirmPasswdError: ''
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

        let dataReadyToBeSent = true;//jezeli beda bledy to ustawie to na false
        let inputs = [];
        let nonEmptyInputsCount = 0;
        let errors = [];
        
        /***************ustawienie stanów po zdarzeniu submit***************/
        if (!this.state.login) {
            this.setState(() => {
                return { loginError: 'Podaj nazwę użytkownika' };
            })

        } else if (this.state.login.trim().length < 4) {
            this.setState(() => {
                return { loginError: 'Nazwa użytkownika powinna się składać z minimum 4 symboli' };
            })
        } else if (this.state.loginError) {
            this.setState(() => {
                return { loginError: '' }; //czyscimy error po przeładowaniu
            })
        }

        if (!this.state.email) {
            this.setState(() => {
                return { emailError: 'Podaj adres email' };
            })

        } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(this.state.email.trim())) {
            this.setState(() => {
                return { emailError: 'Niepoprawny adres email' };
            })
        } else if (this.state.emailError) {
            this.setState(() => {
                return { emailError: '' };
            })
        }

        //dorobić w sprawdzeniu hasła, czy składa się ono z co najmniej 1 cyfry
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
                    this.setState(() => {
                        return { passwdError: 'Niewystarczająco mocne hasło! (musi zawierać !, #, @, $ lub %)' }
                    });
                }
            } else {
                this.setState(() => {
                    return { passwdError: 'Hasło jest za krótkie! (min 6 znaków)' }
                });
            }

        } else {
            this.setState(() => {
                return { passwdError: 'Podaj hasło!' }
            });
        }

        if (!this.state.confirmPasswd && !this.state.passwdError) {
            this.setState(() => {
                return { confirmPasswdError: 'Potwierdź hasło!' }
            });
        } else if (this.state.passwd !== this.state.confirmPasswd
            && !this.state.passwdError) {
            this.setState(() => {
                return { confirmPasswdError: 'Podane hasła się nie zgadzają!' }
            });
        } else if (this.state.confirmPasswdError) {
            this.setState(() => {
                return { confirmPasswdError: '' }
            });
        }

        /********** Sprawdzenie czy dane sa gotowe do wysłania**********/
        for (const [key, value] of Object.entries(this.state)) {
            if (key.includes('Error')) {
                errors.push(value);
            } else {
                inputs.push(value);
            }
        }

    /*     inputs.forEach(input => {
            //jezeli input nie jest pusty
            if (input) {
                nonEmptyInputsCount++;
            }
        });

        if (nonEmptyInputsCount === inputs.length) {
            dataReadyToBeSent = true;
        } */

        for (const error of errors) {
            //jezeli error nie jest pusty (zawiera komunikat błędu)
            if (error) {
                dataReadyToBeSent = false;
                break;
            }
        }
        if (dataReadyToBeSent) {
            this.signUserUp();
        }
    }

    /*    componentDidUpdate() {
           if (this.state.login &&
               this.state.email &&
               this.state.passwd &&
               this.state.confirmPasswd &&
               !this.state.loginError &&
               !this.state.emailError &&
               !this.state.passwdError &&
               !this.state.confirmPasswdError
           ) {
               this.signUserUp();
           }
       } */

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
            axiosConfig)
            .then(res => {
                
            })
            .catch(err => console.log("AXIOS ERROR", err))
    }

    render() {
        return (
            <section className="sign-up">
                <form
                    className="signup-form"
                    ref={elem => this._formElem = elem}
                    action=""
                    onSubmit={this.validateForm}
                >
                    <label htmlFor="login" className={this.state.loginError ? 'error' : ''}>Nazwa użytkownika</label>
                    <input
                        onChange={this.handleUserLogin}
                        type="text" id="login"
                        className={`input-item ${this.state.loginError ? 'error' : ''}`}
                    />

                    <label htmlFor="email" className={this.state.emailError ? 'error' : ''}>Adres email</label>
                    <input
                        onChange={this.handleUserEmail}
                        type="email"
                        id="email"
                        className={`input-item ${this.state.emailError ? 'error' : ''}`}
                    />

                    <label htmlFor="passwd" className={this.state.passwdError ? 'error' : ''}>Hasło</label>
                    <input
                        onChange={this.handleUserPasswd}
                        type="text" id="passwd"
                        className={`input-item ${this.state.passwdError ? 'error' : ''}`}
                    />

                    <label htmlFor="confirm-passwd" className={this.state.confirmPasswdError ? 'error' : ''}>Potwierdzenie hasła</label>
                    <input
                        onChange={this.handleConfirmPasswd}
                        type="text" id="confirm-passwd"
                        className={`input-item ${this.state.confirmPasswdError ? 'error' : ''}`}
                    />

                    {!(this.state.loginError === '') && <p>{this.state.loginError}</p>}
                    {!(this.state.emailError === '') && <p>{this.state.emailError}</p>}
                    {!(this.state.passwdError === '') && <p>{this.state.passwdError}</p>}
                    {!(this.state.confirmPasswdError === '') && <p>{this.state.confirmPasswdError}</p>}

                    <button type="submit" className="btn btn-submit">Zarejestruj się</button>
                </form>
            </section>
        );
    }
}

export default SignUp;