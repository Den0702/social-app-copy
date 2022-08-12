import React, { useState, useEffect } from "react";
import axios from "axios";

import '../../css/AllFollows.css';

export default function AllFollows(props) {
    const [follows, setFollows] = useState([]);

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + props.currentUserProp.jwt_token
        }
    }

    useEffect(() => {
        axios.post('https://akademia108.pl/api/social-app/follows/allfollows',
            {},
            axiosConfig
        )
            .then(res => {
                setFollows(res.data);
            })
            .catch(error => {
                console.log(error)
            });
    }, [])

    const unfollow = (userId) => {
        const sentData = {
            leader_id: userId
        }

        axios.post('https://akademia108.pl/api/social-app/follows/disfollow',
            sentData,
            axiosConfig
        ).then(res => {
            setFollows( follows.filter(follow => follow.leader_id !== res.data.leader_id) );

        }).catch(error => {
            console.log(error);
            this.props.clearUserMethod();
        })
    }

    const followsList = follows.map(follow => {
        return (
            <div className="follow" key={follow.id}>
                <div className="avatar-holder">
                    <img src={follow.avatar_url} alt="userPhoto" />
                </div>
                <span className="user-name">
                    {follow.username}
                </span>
                <button className="btn unfollow-btn" onClick={() => unfollow(follow.id)}>
                    Unfollow
                </button>
            </div>
        )
    })

    return (
        <div className="container">
            <div className="follows">
                {followsList}
            </div>
        </div>
    )

}