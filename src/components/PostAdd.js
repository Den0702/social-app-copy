import React, { Component } from "react";
import '../css/PostAdd.css';
import axios from "axios";

class PostAdd extends Component {
    constructor(props) {
        super(props);
    }

    addPost = (event) => {
        //alert('addPost')
        event.preventDefault();

        const postContent = {
            content: this._userPostTextField.value
        }

        //jezeli post nie jest pusty
        if (postContent.content) {
            axios.post(
                'https://akademia108.pl/api/social-app/post/add',
                postContent
            ).then(res => {
                    this.setState({ message: res.data.message })
                    this.props.getNewerPosts();
                    this._userPostTextField.value = '';
                }
            ).catch(error => {
                this._userPostTextField.value = '';
                this.props.clearUserMethod();

            })
        }

    }

    render() {
        return (
            <div className="add-post">
                {
                    this.props.currentUserProp
                    &&
                    <form
                        className="form user-post-message"
                        onSubmit={e => this.addPost(e)}>
                        <textarea
                            ref={textField => this._userPostTextField = textField}
                            placeholder="Treść twojej wiadomosci..."
                        >
                        </textarea>
                        <button type="submit" className="btn btn-submit">Nowy post</button>
                    </form>
                }
            </div>
        )
    }
}

export default PostAdd;