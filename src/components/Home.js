/* eslint-disable default-case */
import React, { Component } from "react";

import axios from "axios";
import '../css/Home.css';//nie piszemy 'from' przy importowaniu css'a, bo to jest składnia Webpack'a

import {transformDate} from '../helpers/transformDate';

class Home extends Component {
    constructor() {
        super();

        this.state = {
            postsList: []
        }
    }

    getPostsLatest = () => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        axios.post('https://akademia108.pl/api/social-app/post/latest', axiosConfig)
            .then(res => {
                /* przekazuje do setState tylko obiekt(nie funkcje), poniewaz ustawiam stan tylko raz */
                this.setState({
                    postsList: res.data
                });
            })
            .catch(error => console.log(error));
    }

    getPostsOlderThen = () => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        const requestData = { date: this.state.postsList[this.state.postsList.length - 1].created_at }
        axios.post(
            'https://akademia108.pl/api/social-app/post/older-then',
            JSON.stringify(requestData),
            JSON.stringify(axiosConfig)
        )
        .then(res => {
            this.setState({ postsList: this.state.postsList.concat(res.data) })
        })
        .catch(err => console.log(err))
    }

    componentDidMount() {
        this.getPostsLatest();
    }

    render() {
        let updatedPostsList = this.state.postsList.map(userPost => {
            /* Przy pobieraniu kolejnych porcji danych, renderowanie nie startuje od zera, tylko zaczynając od aktualnie pobranej porcji. 
            Poprzednie są już zachowane. To zapewnia Virtual DOM */
            return (
                <div className="user-post-holder" key={userPost.id}>
                    <div className="post-header">
                        <div className="avatar-holder">
                            <img src={userPost.user.avatar_url} alt="userPhoto" />
                        </div>
                        <div className="user-name">
                            {userPost.user.username}
                        </div>
                        <button className="btn follow-btn">
                            Follow
                        </button>
                    </div>
                    <div className="post-content-holder">
                        <p className="post-content">
                            {userPost.content}
                        </p>
                        <p className="post-date">
                            {transformDate(userPost.created_at)}
                        </p>
                    </div>
                </div>
            )
        });

        return (
            <div>
                <h2>Home</h2>
                {updatedPostsList}
                <button onClick={this.getPostsOlderThen}>showOlder</button>
            </div>
        )
    }

}

export default Home;