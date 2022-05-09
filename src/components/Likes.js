import React, {Component} from "react";

import axios from "axios";
import '../css/Home.css';

class Like extends Component {
    constructor(props) {
        super(props);

        this.state = {
            likesNum: 0
        }
    }

    postLike = () => {
        const axiosConfig = {
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
        const requestData = {
            post_id: this.props.id
        }

        axios.post(
            'https://akademia108.pl/api/social-app/post/like',
            requestData,
            axiosConfig
        ).then(res => {
            
        })
    }

    render() {
        return (
            <div className="post-like">
                <button onClick={this.postLike}>Like </button>
                <span>{this.state.likesNum}</span>
            </div>
        )
    }
}

export default Like;