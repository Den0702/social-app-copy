import React, { Component } from "react";
import { transformDate } from '../helpers/transformDate';

import axios from 'axios';

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
            headers : {
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

                this.setState( (currentState) => {
                        if(!this.state.liked) {
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
                {message: error.response.data.message } 
            )
        )
    }

    render() {
        return (
            <div className="user-post-holder" key={this.props.userPost.id}>
                <div className="post-header">
                    <div className="avatar-holder">
                        <img src={this.props.userPost.user.avatar_url} alt="userPhoto" />
                    </div>
                    <div className="user-name">
                        {this.props.userPost.user.username}
                    </div>
                    {/* To nie miejsce na ten przycisk */}
                    <button className="btn follow-btn">
                        Follow
                    </button>
                </div>
                <div className="post-content-holder">
                    <div className="post-content">
                        {this.props.userPost.content}
                    </div>
                    <div className="post-date">
                        {transformDate(this.props.userPost.created_at)}
                    </div>
                    <div className="post-like">
                        <button onClick={this.postLike}>Like </button>
                        <span>{this.state.likesNum}</span>
                    </div>
                </div>
            </div>
        )
    }

}
export default Post;
