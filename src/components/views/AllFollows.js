import React, { useState, useEffect } from "react";
import axios from "axios";

import '../../css/AllFollows.css';

export default function AllFollows(props) {
    const [follows, setFollows] = useState([]);

    useEffect(() => {
            axios.post('https://akademia108.pl/api/social-app/follows/allfollows'       
        )
            .then(res => {
                setFollows(res.data);
            })
            .catch(error => {
                console.log(error);
                props.clearUserMethod();
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const unfollow = (userId) => {
        const sentData = {
            leader_id: userId
        }

        axios.post('https://akademia108.pl/api/social-app/follows/disfollow',
            sentData
        ).then(res => {
            setFollows( follows.filter(follow => follow.id !== res.data.leader_id) );

        }).catch(error => {
            console.log(error);
            props.clearUserMethod();
        })
    }

    const followsList = follows.map(follow => {
        return (
            <div className="follow" key={follow.id}>
                <div className="avatar-holder">
                    <img src={follow.avatar_url} alt="userPhoto" />
                    <span className="user-name">
                        {follow.username}
                    </span>
                </div>
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