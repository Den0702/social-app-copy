/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";

import '../css/FollowRecommendations.css';

export default function FollowRecommendations(props) {

    let [recommendations, setNewRecommendations] = useState([]);

    useEffect(() => {
        getRecommendations();

        let refreshId = setInterval(() => {
            getRecommendations();
        }, 10000);

        return () => {
            clearInterval(refreshId);
        }
    }, []);

    function getRecommendations() {
        if (props.currentUserProp) {
            axios.post('https://akademia108.pl/api/social-app/follows/recommendations')
                .then(res => {
                    setNewRecommendations(res.data);
                    return true;
                })
                .catch(err => {
                        console.log(`FollowRecommendations' query caused this error: ${err} `);
                        props.clearUserMethod();
                    }
                );
        }
    }

    function follow(id) {
        axios.post(
            "https://akademia108.pl/api/social-app/follows/follow",
            { leader_id: id }
        )
        .then(() => {
            props.getPostsLatest();
        })
        .catch((error) => {
            console.error(error);
            props.clearUserMethod();
        });
    }

    let recommendationsList = recommendations.map(recommendation => {
        return (
            <div className="recommendation" key={recommendation.id}>
                <div className="avatar-holder">
                    <img src={recommendation.avatar_url} alt="userPhoto" />
                </div>
                <p className="user-name">
                    {recommendation.username}
                </p>
                <button className="btn follow-btn" onClick={() => follow(recommendation.id)}>
                    Follow
                </button>
            </div>
        )

    })

    return (
        recommendationsList.length !== 0 ? 
            <div className="recommendations">
                <h3>Osoby, które możesz znać</h3>
                {recommendationsList}
            </div>
        : <h3>Obecnie subskrybujesz wszystkich</h3>
    )
}

