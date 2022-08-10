import React, { Component } from "react";
import '../css/PostAdd.css';
import axios from "axios";

class PostAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
        }
    }

    addPost = (event) => {
        //alert('addPost')
        event.preventDefault();

        const data = {
            content: this._userPostTextField.value
        }

        //jezeli post nie jest pusty
        if (data.content) {
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + this.props.currentUserProp.jwt_token
                }
            };

            axios.post(
                'https://akademia108.pl/api/social-app/post/add',
                data,
                axiosConfig
            ).then(res => {
                    console.log(res);
                    this.setState({ message: res.data.message })
                    this.props.getNewerPosts();//zeby strona sie odswiezyla i ten nowoutworzony post sie pojawil
                    this._userPostTextField.value = '';
                }
            ).catch(error => {
                console.log(`addPost's query caused this error: ${error.data.message}`);

                this.props.clearUserMethod();

                this.setState({ message: error.data.message})
                this._userPostTextField.value = '';
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