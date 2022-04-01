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
            cpasswd: '',
            cpasswdError: ''
        }
    }

    handleUserLogin = (e) => {
        this.setState(() => {
            return { login: e.target.value }
        })
    }

    handleUserEmail = (e) => {
        this.setState(() => {
            return { email: e.target.value }
        })
    }

    handleUserPasswd = (e) => {
        this.setState(() => {
            return { passwd: e.target.value }
        })
    }

    handleConfirmPasswd = (e) => {
        this.setState(() => {
            return { cpasswd: e.target.value }
        })
    }

    validateForm = (event) => {
        event.preventDefault();

        let errors = this._errorsList;

        this.setState((currentState) => {
            if (currentState.login !== ''
                && currentState.login.trim().length < 4) {
                    return { loginError: 'Za krótka nazwa użytkownika' }
            });
        }
        if (this.state.email !== ''
            && !this.state.email.trim().includes('@')) {
            this.setState(() => {
                return { loginError: 'Niepoprawny adres email' }
            });
        }

        if (this.state.passwd !== '') {
            const arrFromPasswd = Array.from(this.state.passwd);
            let passwdCorrect = false;

            if (this.state.passwd.length >= 6) {
                for (const char of arrFromPasswd) {
                    if (!(char === '!' || char === '#' || char === '@' || char === '$' || char === '%')) {
                        continue;
                    } else {
                        passwdCorrect = true;
                        break;
                    }
                }
            } 
            if (!passwdCorrect) {
                errors.innerHTML += `Niewystarczająco mocne hasło!<br/>`;
            }
        }

        if (errors.childElementCount === 0) {
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

        axios.post('https://akademia108.pl/api/social-app/user/signup',
            JSON.stringify(userData),
            axiosConfig)
            .then(res => console.log("RESPONSE RECEIVED", res)

            )
            .catch(err => console.log("AXIOS ERROR", err));
    }

    render() {
        console.log(this.state);

        return (
            <section className="sign-up">
                <form
                    className="signup-form"
                    ref={elem => this._formElem = elem}
                    action=""
                    onSubmit={this.validateForm}
                >
                    <label htmlFor="login" className={this.state.loginError !== '' ? 'error' : '' }>Nazwa użytkownika</label>
                    <input onChange={this.handleUserLogin} type="text" id="login" className="input-item" />

                    <label htmlFor="email">Adres email</label>
                    <input onChange={this.handleUserEmail} type="email" id="email" className="input-item" />

                    <label htmlFor="passwd">Hasło</label>
                    <input onChange={this.handleUserPasswd} type="password" id="passwd" className="input-item" />

                    <label htmlFor="confirm-passwd">Potwierdzenie hasła</label>
                    <input onChange={this.handleConfirmPasswd} type="password" id="confirm-passwd" className="input-item" />

                    <button type="submit" className="btn btn-submit">Zarejestruj się</button>

                    <div ref={elem => this._errorsList = elem} className="errors"></div>
                </form>
            </section>
        );
    }
}

export default SignUp;