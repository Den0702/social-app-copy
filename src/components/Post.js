import React, { Component } from "react";
import axios from 'axios';

import '../css/Post.css';//nie piszemy 'from' przy importowaniu css'a, bo to jest składnia Webpack'a

//import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from 'dayjs';
import 'dayjs/locale/pl';

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
                return user.username === this.props.currentUserProp.username
            })

            if (currentUserLeftLike) {
                this.setState({ liked: true });
            }
        }
    }

    postAddLike = () => {
        const sentData = {
            post_id: this.props.userPost.id
        }

        axios.post(
            'https://akademia108.pl/api/social-app/post/like',
            sentData
        ).then(res => {
            console.log(res);
            /* ja tak rozumiem, że trzeba dać tutaj funkcje do setState, bo opieramy sie w warunku o poprzedni stan wartosci likesNum*/
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
        const sentData = {
            "post_id": this.props.userPost.id
        }

        axios.post(
            'https://akademia108.pl/api/social-app/post/dislike',
            sentData
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
        const sentData = {
            post_id: this.props.userPost.id
        }

        axios.post(
            'https://akademia108.pl/api/social-app/post/delete',
            sentData
        )
        .then(res => {
            this.props.setPostsAfterDelete (
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
        const sentData = {
            leader_id: userId
        }

        axios.post('https://akademia108.pl/api/social-app/follows/disfollow',
            sentData
        ).then((res) => {
            this.props.getPostsLatest();
        }).catch(error => {
            console.log(error);
            this.props.clearUserMethod() 
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
                        Usuń post
                    </button>
                )}

                <div className="post-content-holder">
                    <p className="post-content">
                        {this.props.userPost.content}
                    </p>
                    <hr />
                    <div className="post-date">
                        {dayjs(this.props.userPost.created_at).locale('pl').format('DD MMM YYYY HH:MM')}
                    </div>
                    <div className="post-like">
                        <button
                            onClick={this.props.currentUserProp && (!this.state.liked ? this.postAddLike : this.postRemoveLike)}
                            className={`btn like-btn ${!this.props.currentUserProp && 'unactive'}`}
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
                        <h3>Czy na pewno usunąć tego posta?</h3>
                        <button className="btn yes" onClick={() => this.postDelete()}>Tak</button>{" "}
                        <button className="btn no" onClick={() => this.setState({ deleteModalDisplay: false })}>Nie</button>
                    </div>
                )}
            </div>

        )
    }
}
export default Post;
