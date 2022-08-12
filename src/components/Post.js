import React, { Component } from "react";
import axios from 'axios';

import { transformDate } from '../helpers/transformDate';
import '../css/Post.css';//nie piszemy 'from' przy importowaniu css'a, bo to jest składnia Webpack'a

//import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            liked: false,
            message: '',
            likesNum: props.userPost.likes.length,
            deleteModalDisplay: false
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
        const sentData = {
            post_id: this.props.userPost.id
        }

        axios.post(
            'https://akademia108.pl/api/social-app/post/like',
            sentData,
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

        const sentData = {
            "post_id": this.props.userPost.id
        }

        axios.post(
            'https://akademia108.pl/api/social-app/post/dislike',
            sentData,
            axiosConfig
        ).then(res => {
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

    postDelete = () => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + (this.props.currentUserProp ? this.props.currentUserProp.jwt_token : null)
            }
        }

        const sentData = {
            post_id: this.props.userPost.id
        }

        axios.post(
            'https://akademia108.pl/api/social-app/post/delete',
            sentData,
            axiosConfig
        )
        .then(res => {
            //console.log(`What is going with postList? ` + this.props.postList);

            return this.props.setPosts(
                this.props.postsList.filter((post) => {
                    return post.id !== res.data.post_id
                })
            )
        })
        .catch(error => {
            console.log(error)
            this.props.clearUserMethod();
        })

    }

    unfollow = (userId) => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.props.currentUserProp.jwt_token
            }
        }

        const sentData = {
            leader_id: userId
        }

        axios.post('https://akademia108.pl/api/social-app/follows/disfollow',
            sentData,
            axiosConfig
        ).then((res) => {
            this.props.getPostsLatest();
            /* console.log(res.data) */
        }).catch(error => {
            console.log(error);
            this.props.clearUserMethod()//to robie kazdorazowo na przypadek wygasniecia ttl'a 
        })
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
                    { this.props.currentUserProp && this.props.userPost.user.username !== this.props.currentUserProp.username && (
                        <button className="btn unfollow-btn" onClick={() => this.unfollow(this.props.userPost.user.id)}>
                            Unfollow
                        </button>
                    )}
                    </div>
                </div>

                {this.props.userPost.user.username === this.props.currentUserProp?.username && (
                    <button
                        className="delete-post"
                        onClick={() => this.setState({ deleteModalDisplay: true })}
                    >
                        <FontAwesomeIcon icon="fa-solid fa-xmark" />{" "}
                        Delete your post
                    </button>
                )}

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
                            {
                                this.state.liked ?
                                    <FontAwesomeIcon icon="fa-solid fa-heart" />
                                    :
                                    <FontAwesomeIcon icon="fa-regular fa-heart" />
                            }

                        </button>
                        <span>{this.state.likesNum}</span>
                    </div>
                </div>

                {this.state.deleteModalDisplay && (
                    <div className="deleteConfirmation">
                        <h3>Are you sure you want to delete post?</h3>
                        <button className="btn yes" onClick={() => this.postDelete()}>Yes</button>{" "}
                        <button className="btn no" onClick={() => this.setState({ deleteModalDisplay: false })}>No</button>
                    </div>
                )}
            </div>

        )
    }
}
export default Post;
