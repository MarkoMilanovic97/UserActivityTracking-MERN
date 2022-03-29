import React, { useEffect, useState } from 'react';
import { withRouter, Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import AuthHeader from '../../services/AuthHeader';
import AuthService from '../../services/AuthService';

function Users() {

    let history = useHistory();

    var [users, setUsers] = useState([]);
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

        axios.get("http://localhost:8080/api/auth/get_users").then((response) => {
            setUsers(response.data);
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
                        <h2>Korisnici</h2>
                    </div>
                    <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                        {users.map((value, key) => {
                            return (
                                <div className="col m-auto mt-5" key={value._id}>
                                    <div className="card mb-4 rounded-3 shadow-sm">
                                        <div className="card-header py-3">
                                            <h4 className="my-0 fw-normal">ID korisnika: <b>{value._id}</b></h4>
                                        </div>
                                        <div className="card-body">
                                            <p className="lead">Ime i prezime:</p>
                                            <h3 className="card-title pricing-card-title">{value.first_name} {value.last_name}</h3>
                                            <ul className="list-unstyled mt-3 mb-4">
                                                <li><h4 className="text-success">Ostali podaci: </h4></li>
                                                <li>Broj telefona: <b>{value.phone_number}</b></li>
                                                <li>E-mail: <b>{value.email}</b></li>
                                                <li>Grad: <b>{value.city}</b></li>
                                                <li>Adresa: <b>{value.address}</b></li>
                                                <li><b><Link to="#" onClick={() => { history.push(`/user-activity/${value._id}`) }}>Pogledaj aktivnost</Link></b></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Users);