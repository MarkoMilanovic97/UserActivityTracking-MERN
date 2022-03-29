import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import AuthHeader from '../../services/AuthHeader';
import AuthService from '../../services/AuthService';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

function UserActivity() {

    let { id } = useParams();
    var [activity, setActivity] = useState([]);
    var [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8080/api/auth/admin", {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': AuthHeader()['x-access-token']
            }
        }).then((response) => {
            if (response.data.unauthorized) {
                AuthService.logout();
            }
        });

        axios.get(`http://127.0.0.1:8080/api/auth/get_activity/${id}`).then((response) => {
            setActivity(response.data);
            setLoading(false);
        });

    }, []);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div className="container">
                    <div className="py-4 text-center">
                        <h2>Aktivnost korisnika: </h2>
                    </div>
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="ss-tab" data-bs-toggle="tab" data-bs-target="#ss" type="button" role="tab" aria-controls="ss" aria-selected="true">Snimci ekrana</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="action-tab" data-bs-toggle="tab" data-bs-target="#action" type="button" role="tab" aria-controls="action" aria-selected="false">Akcije</button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="input-tab" data-bs-toggle="tab" data-bs-target="#input" type="button" role="tab" aria-controls="input" aria-selected="false">Unosi</button>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="ss" role="tabpanel" aria-labelledby="ss-tab">
                            <div className="row">
                                {activity.screenshot.screenshots.map((value, key) => {
                                    return (
                                        <div className="col-sm-6 p-4" key={key}>
                                            <div className="card" style={{ width: 30 + 'rem' }}>
                                                <Zoom>
                                                    <img src={value.image} className="card-img-top" />
                                                </Zoom>
                                                <div className="card-body">
                                                    <h5 className="card-title">Vreme snimka:</h5>
                                                    <p className="card-text">{value.time_entered}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="tab-pane fade" id="action" role="tabpanel" aria-labelledby="action-tab">
                            <table className="table text-center">
                                <thead>
                                    <tr>
                                        <th scope="col">Akcija</th>
                                        <th scope="col">Vreme akcije</th>
                                        <th scope="col">Koordinate</th>
                                        <th scope="col">Putanja</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activity.activity.events.map((value, key) => {
                                        return (
                                            <tr key={key}>
                                                <th scope="row">{value.action}</th>
                                                <td>{value.action_time}</td>
                                                <td>{value.coords}</td>
                                                <td>{value.path}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="tab-pane fade" id="input" role="tabpanel" aria-labelledby="input-tab">
                            {activity.input.search.map((value, key) => {
                                return (
                                    <span className="badge rounded-pill bg-primary" key={key}>{value}</span>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(UserActivity);