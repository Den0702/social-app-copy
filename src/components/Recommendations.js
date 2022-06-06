import React, { useState, useEffect } from "react";
import axios from "axios";

import '../css/Recommendations.css';


export default function Recommendations(props) {

    let [recommendations, setNewRecommendations] = useState([]);

    const axiosConfig = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + (props.currentUserProp ? props.currentUserProp.jwt_token : null)
        }
    }

    axios.post('https://akademia108.pl/api/social-app/follows/recommendations', {}, axiosConfig)
        .then(res => setNewRecommendations(res.data))

    let recommendationsList = recommendations.map(recommendation => {

        <div className="recommendation">
            
        </div>

    })

    return (
        {recommendationsList}
    )
}

