import axios from 'axios';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import AuthHeader from '../../services/AuthHeader';
import AuthService from '../../services/AuthService';

function Panel() {

    useEffect(() => {
        axios.get("http://localhost:8080/api/auth/admin", {headers: {
            'Content-Type': 'application/json',
            'x-access-token': AuthHeader()['x-access-token']
        }}).then((response) => {
            if(response.data.unauthorized){
                AuthService.logout();
            }
        });
    }, []);


    return (
        <div>
            Users
        </div>
    )
}

export default withRouter(Panel);
