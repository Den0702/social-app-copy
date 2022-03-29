import React, { Component } from "react";
import '../css/SignUp.css';

class SignUp extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            login: '',
            email: '',
            passwd: '',
            cpasswd: '', 
        }
    }

    saveUserLogin = (e) => {
        this.setState({
            login: e.target.value
        })
    }
    
    saveUserMail = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    saveUserPasswd = (e) => {
        this.setState({
            passwd: e.target.value
        })
    }

    saveCPasswd = (e) => {
        this.setState({
            cpasswd: e.target.value
        })
    }

    validateForm = (event) => {
        event.preventDefault();

        const formFields = this._formElem.getElementsByTagName('input');
        const allFilled = true;

        let errors = this._errorsList;
        errors.innerHTML = '';//czyscimy ekran od wczesniej wypisanych bledow

        for (const field of formFields) {
            if (field.value.trim() === '') {
                errors.innerHTML += `Pole nie może być puste<br/>`;
                field.classList.add('error');
            } else if (field.classList.contains('error')) {
                field.classList.remove('error');
            }
        }

        const arrFromPasswd = Array.from(this.state.passwd);
        let passwdCorrect = false;

        if ( this.state.login !== ''
            && this.state.login.trim().length < 4 ) {
            errors.innerHTML += `Za krótka nazwa użytkownika<br/>`;

        }
        if ( this.state.email !== ''
            && !this.state.email.trim().includes('@') ) {
            errors.innerHTML += `Niepoprawny adres email<br/>`;
        }

        if (this.state.passwd !== '') {
            if (this.state.passwd.length < 6) {
                for (const char of arrFromPasswd) {
                    if (!(char === '!' || char === '#' || char === '@' || char === '$' || char === '%')) {
                        continue;
                    } else {
                        passwdCorrect = true;
                        return;
                    }
                }
                if (!passwdCorrect) {
                    errors.innerHTML += `Niewystarczająco mocne hasło!<br/>`;
                }
            }
        }

    }


    render() {
        console.log(this.state);

        return (
            <section >
                <form 
                    className="signup-form"
                    ref={elem => this._formElem = elem} 
                    action="" 
                    onSubmit={this.validateForm}
                >
                        <label htmlFor="login">Nazwa użytkownika</label>
                        <input onChange={this.saveUserLogin} type="text" id="login" className="input-item" />

                        <label htmlFor="email">Adres email</label>
                        <input onChange = {this.saveUserMail} type="text" id="email" className="input-item"/>

                        <label htmlFor="passwd">Hasło</label>
                        <input onChange = {this.saveUserPasswd} type="text" id="passwd" className="input-item"/>

                        <label htmlFor="confirm-passwd">Potwierdzenie hasła</label>
                        <input onChange = {this.saveCPasswd} type="text" id="confirm-passwd" className="input-item"/>

                        <button type="submit">Zarejestruj się</button>
                
                        <div ref={elem => this._errorsList = elem} className="errors"></div>
                </form>
            </section>
        );
    }
}

export default SignUp;