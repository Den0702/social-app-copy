/* eslint-disable default-case */
import axios from "axios";
import React, { Component } from "react";

import '../../css/Home.css';
import Post from '../Post';
import PostAdd from '../PostAdd';
import FollowRecommendations from '../FollowRecommendations';

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
                'Authorization': 'Bearer ' + (this.props.currentUserProp ? this.props.currentUserProp.jwt_token : null)
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
            .catch(err => console.log(`Home: The getPostsLatest query caused this error: ${err}`));
    }

    getPostsOlderThen = () => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + (this.props.currentUserProp ? this.props.currentUserProp.jwt_token : null)
            }
        }
        const sentData = {
            date: this.state.postsList[this.state.postsList.length - 1].created_at
        }

        axios.post(
            'https://akademia108.pl/api/social-app/post/older-then',
            JSON.stringify(sentData),
            axiosConfig
        )
            .then(res => {
                this.setState({
                    postsList: this.state.postsList.concat(res.data)
                })
            })
            .catch(err => console.log(`Home: The getPostsOlderThen's query caused this error: ${err}`))
    }

    getPostsNewerThen = () => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + (this.props.currentUserProp ? this.props.currentUserProp.jwt_token : null)
            }
        }
        const sentData = {
            date: this.state.postsList[0].created_at // pobiera posty, które są utworzone później niż pierwszy z już załadowanych.
        }

        axios.post('https://akademia108.pl/api/social-app/post/newer-then',
            sentData,
            axiosConfig
        )
            .then(res =>
                this.setState({
                    postsList: res.data.concat(this.state.postsList)
                })
            )
            .catch(err => console.log(`Home: The getPostsNewerThen's query caused this error: ${err}`))
    }

    setPosts = (posts) => {
        this.setState({ postsList: posts})
    }

    //ta metoda uruchamia sie przy pierwszym zaladowaniu komponentu
    componentDidMount() {
        console.log('Home mounted')
        /* if (this.props.currentUserProp) {
            this.props.tokenCheckMethod();
        } */
        //zapytanie w getPostsLatest uruchomiloby sie rownolegle w stosunku do zapytania idacego z poziomu tockenCheckMethod
        //bo to sa oba zapytania asynchroniczne. Wiec powyzszy if nie jest tu pomocny, poniewaz zapytanie z getPostLatest pojdzie w kazdym wypadku.
        //Pasuje wiec tylko zostawic sprawdzenie tokena z poziomu App
        this.getPostsLatest();
    }

    render() {

        let postsList = this.state.postsList.map(userPost => {
            /* Przy pobieraniu kolejnych porcji danych, renderowanie nie startuje od zera, tylko zaczynając od aktualnie pobranej porcji. 
            Poprzednie są już zachowane. To zapewnia Virtual DOM */
            return (
                <Post
                    userPost={userPost}
                    key={userPost.id}
                    currentUserProp={this.props.currentUserProp}
                    clearUserMethod={this.props.clearUserMethod}
                    postsList={this.state.postsList}
                    getPostsLatest={this.getPostsLatest}
                    setPosts={this.setPosts}
                />
            )
        });

        return (
            <section className="home">
                <div className="container">
                    <aside className="sm">
                        {
                            this.props.currentUserProp &&
                            <FollowRecommendations
                                clearUserMethod={this.props.clearUserMethod}
                                currentUserProp={this.props.currentUserProp}
                                getPostsLatest={this.getPostsLatest}
                            />
                        }
                    </aside>
                    <PostAdd
                        currentUserProp={this.props.currentUserProp}
                        getNewerPosts={this.getPostsNewerThen}
                        clearUserMethod={this.props.clearUserMethod}
                    />

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