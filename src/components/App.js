import React, { Component } from 'react';//dlaczego to nie ustawiono podczas create-react-app?
import '../css/App.css';
import SignUp from './SignUp';

class App extends Component {

    constructor() {
        super();
    }

    render() {

        return (
            <div className="App">
                <header className="App-header">
                </header>
                <SignUp />
            </div>
        );
    }
}

export default App;
