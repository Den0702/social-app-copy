import React, { Component } from "react";
import axios from 'axios';

import { transformDate } from '../helpers/transformDate';
import '../css/Post.css';//nie piszemy 'from' przy importowaniu css'a, bo to jest składnia Webpack'a

import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            liked: false,
            message: '',
            likesNum: props.userPost.likes.length
        }
    }

    componentDidMount() {
        let usersLikesArr = this.props.userPost.likes;

        if (this.props.currentUserProp) {
            let currentUserLeftLike = usersLikesArr.find(user => {
                //jezeli imie tego, kto znajduje sie w tablicy lajkow jest tozsame 
                //z imieniem aktualnie zalogowanego uzytkownika, to zwroc tego uzytkownika
                return user.username === this.props.currentUserProp.username
            })

            if (currentUserLeftLike) {
                this.setState({ liked: true });
            }
        }
    }

    postAddLike = () => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + (this.props.currentUserProp ? this.props.currentUserProp.jwt_token : null)
            }
        }
        const requestData = {
            post_id: this.props.userPost.id
        }

        axios.post(
            'https://akademia108.pl/api/social-app/post/like',
            requestData,
            axiosConfig
        ).then(res => {
            console.log(res);
            /* ja tak rozumiem dajemy tutaj funkcje do setState, bo opieramy sie w warunku o poprzedni stan wartosci likesNum*/
            this.setState((currentState) => {
                return {
                    liked: res.data.liked,
                    message: res.data.message,
                    likesNum: currentState.likesNum + 1
                }
            })
        }).catch(error => {
            this.props.clearUserMethod();
            this.setState({ message: error.response.data.message })
        })
    }

    postRemoveLike = () => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + (this.props.currentUserProp ? this.props.currentUserProp.jwt_token : null)
            }
        }

        const sendData = {
            "post_id": this.props.userPost.id
        }

        axios.post('https://akademia108.pl/api/social-app/post/dislike', sendData, axiosConfig)
            .then(res => {
                this.setState((currentState) => {
                    return {
                        liked: res.data.liked,
                        message: res.data.message,
                        likesNum: currentState.likesNum - 1
                    }
                })
            },
                error => {
                    this.props.clearUserMethod();
                    this.setState({ message: error.response.data.message })
                }
            )
    }

    render() {
        return (
            <div className="user-post-holder" key={this.props.userPost.id}>
                <div className="post-header">
                    <div className="avatar-holder">
                        <img src={this.props.userPost.user.avatar_url} alt="userPhoto" />
                    </div>
                    <div className="user-info">
                        <p className="user-name">
                            {this.props.userPost.user.username}
                        </p>
                        <button className="btn unfollow-btn">
                            Unfollow
                        </button>
                    </div>
                </div>

                <button className="hide-post">
                    <FontAwesomeIcon icon="fa-solid fa-xmark" />
                </button>

                <div className="post-content-holder">
                    <p className="post-content">
                        {this.props.userPost.content}
                    </p>
                    <hr />
                    <div className="post-date">
                        {transformDate(this.props.userPost.created_at)}
                    </div>
                    <div className="post-like">
                        <button
                            onClick={!this.state.liked ? this.postAddLike : this.postRemoveLike}
                            className="btn like-btn"
                        >
                            {/* {
                                this.state.liked ?
                                    <FontAwesomeIcon icon="fa-solid fa-heart" />
                                    :
                                    <FontAwesomeIcon icon="fa-regular fa-heart" />
                            } */}
                            {/* <FontAwesomeIcon icon="fa-solid fa-heart" /> - nie dziala*/}
                            <FontAwesomeIcon icon={faHeart} />
                        </button>
                        <span>{this.state.likesNum}</span>
                    </div>
                </div>
            </div>

        )
    }
}
export default Post;
