/* eslint-disable default-case */
import React, { Component } from "react";
import axios from "axios";

import PostAdd from './PostAdd';
import Post from './Post';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            postsList: [],
        }
    }

    getPostsLatest = () => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                //przy zalogowaniu dostaje sie tylko posty ktore sie subskrybuje
                'Authorization': 'Bearer' + (this.props.currentUser ? this.props.currentUser.jwt_token : null)
            }
        }
        axios.post('https://akademia108.pl/api/social-app/post/latest', {}, axiosConfig)
            .then(res => {
                /* przekazujemy do setState tylko obiekt(nie funkcje), poniewaz nie polegamy na poprzednim stanie */
                this.setState({
                    //TO DO - po dodaniu postu pobieraj z post/newer-then posty nowesze niż ostatni pobrany do tej pory i dodawaj je do listy - zrób do tego osobną metodę
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
        console.log(this.props.currentUser);
        let postsList = this.state.postsList.map(userPost => {
            /* Przy pobieraniu kolejnych porcji danych, renderowanie nie startuje od zera, tylko zaczynając od aktualnie pobranej porcji. 
            Poprzednie są już zachowane. To zapewnia Virtual DOM */
            return (
                <Post
                    userPost={userPost}
                    key={userPost.id}
                    currentUser={this.props.currentUser}
                />
            )
        });

        return (
            <section className="home">
                <PostAdd currentUser={this.props.currentUser} />
                <h2>Home</h2>
                <div className="container" >
                    {postsList}
                </div>
                <button
                    className="btn"
                    onClick={this.getPostsOlderThen}>
                    showOlder
                </button>
            </section>
        )
    }

}

export default Home;