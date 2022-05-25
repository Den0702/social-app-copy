import React, { Component } from "react";
import axios from 'axios';

import { transformDate } from '../helpers/transformDate';
import '../css/Post.css';

class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            liked: false,
            message: '',
            likesNum: props.userPost.likes.length
        }
    }

    postLike = () => {
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer' + (this.props.currentUser ? this.props.currentUser.jwt_token : null)
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

            this.setState((currentState) => {
                if (!this.state.liked) {
                    return {
                        liked: res.data.liked,
                        message: res.data.message,
                        likesNum: currentState.likesNum + 1
                    }
                }
            }
            )
        },
            error => this.setState(
                { message: error.response.data.message }
            )
        )
    }

    render() {
        return (
            <div className="container" key={this.props.userPost.id}>
                <div className="avatar-holder">
                    <img src={this.props.userPost.user.avatar_url} alt="userPhoto" />
                </div>
                <div className="user-post-holder">
                    <div className="post-header">
                        <div className="user-name">
                            {this.props.userPost.user.username}
                            <button className="hide-post">X</button>
                        </div>
                        <button className="btn unfollow-btn">
                            Unfollow
                        </button>
                    </div>
                    
                    <div className="post-content-holder">
                        <div className="post-content">
                            {this.props.userPost.content}
                        </div>
                        <hr />
                        <div className="post-date">
                            {transformDate(this.props.userPost.created_at)}
                        </div>
                        <div className="post-like">
                            <button onClick={this.postLike} className="btn">Like </button>
                            <span>{this.state.likesNum}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Post;
