import React, { Component } from "react";

import axios from "axios";

class Post extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            likesNum: 0
        }
    }

    addPost = (event) => {
        //alert('addPost')
        event.preventDefault();

        const data = {
            content: this._userPostTextField.value
        }

        if (data.content) {
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + this.props.currentUser.jwt_token
                }
            };

            axios.post(
                'https://akademia108.pl/api/social-app/post/add',
                data,
                axiosConfig
            ).then(res => {
                    console.log(res);
                    this.setState({ message: res.data.message })
                    this._userPostTextField.value = '';
                }
            ).catch(error => {
                console.log(error.data.message)
                this._userPostTextField.value = '';
            })
        }

    }

    render() {
        return (
            <div>
                {
                    this.props.currentUser
                    &&
                    <form
                        className="form user-post-message"
                        onSubmit={e => this.addPost(e)}>
                        <textarea
                            ref={textField => this._userPostTextField = textField}
                        >
                        </textarea>
                        <button type="submit" className="btn btn-submit">Nowy post</button>
                    </form>
                }
            </div>
        )
    }
}

export default Post;