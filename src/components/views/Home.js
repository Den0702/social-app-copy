/* eslint-disable default-case */
import React, { Component } from "react";
import axios from "axios";

import '../../css/Home.css';
import PostAdd from '../PostAdd';
import Post from '../Post';
import FollowRecommendations from '../FollowRecommendations';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            postsList: [],
        }
    }

    getPostsLatest = () => {
        axios.post('https://akademia108.pl/api/social-app/post/latest')
            .then(res => {
                this.setState({
                    //TO DO - po dodaniu postu pobieraj z post/newer-then posty nowesze niż ostatni pobrany do tej pory i dodawaj je do listy - zrób do tego osobną metodę
                    postsList: res.data
                });
            })
            .catch(err => console.log(`Home: The getPostsLatest query caused this error: ${err}`));
    }

    getPostsOlderThen = () => {
        const requestData = {
            date: this.state.postsList[this.state.postsList.length - 1].created_at
        }

        axios.post(
            'https://akademia108.pl/api/social-app/post/older-then',
            JSON.stringify(requestData)
        )
            .then(res => {
                this.setState({
                    postsList: this.state.postsList.concat(res.data)
                })
            })
            .catch(err => console.log(`Home: The getPostsOlderThen's query caused this error: ${err}`))
    }

    getPostsNewerThen = () => {
        const requestData = {
            date: this.state.postsList[0].created_at
        }

        axios.post('https://akademia108.pl/api/social-app/post/newer-then',
            requestData
        )
            .then(res =>
                this.setState({
                    postsList: res.data.concat(this.state.postsList)
                })
            )
            .catch(err => console.log(`Home: The getPostsNewerThen's query caused this error: ${err}`))
    }

    setPostsAfterDelete = (posts) => {
        this.setState({ postsList: posts})
    }

    componentDidMount() {
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
                getPostsLatest={this.getPostsLatest}
                setPostsAfterDelete={this.setPostsAfterDelete}
                postsList={this.state.postsList}
                />
                )
            });
            
        return (
            <section className="home">
                {
                    this.props.currentUserProp &&
                    <FollowRecommendations
                        clearUserMethod={this.props.clearUserMethod}
                        currentUserProp={this.props.currentUserProp}
                        getPostsLatest={this.getPostsLatest}
                    />
                }
                <div className="container">
                    <PostAdd
                        currentUserProp={this.props.currentUserProp}
                        getNewerPosts={this.getPostsNewerThen}
                        clearUserMethod={this.props.clearUserMethod}
                    />

                    {postsList}
                </div>

                <button
                    className="btn older"
                    onClick={this.getPostsOlderThen}>
                    showOlder
                </button>
            </section>
        )
    }

}

export default Home;