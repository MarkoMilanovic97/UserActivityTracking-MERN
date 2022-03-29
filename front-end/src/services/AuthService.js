import axios from 'axios';
import { NotificationManager } from 'react-notifications';

const API_URL = "http://localhost:8080/api/auth/";

class AuthService {

    login(data) {
        return axios.post(API_URL + "signin", data).then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }

            if (response.data.user_not_found) {
                return NotificationManager.error('Greska prilikom prijave!', 'Korisnik ne postoji.', 5000);
            } else if (response.data.invalid_password) {
                return NotificationManager.error('Greska prilikom prijave!', 'Podaci su netacni.', 5000);
            } else {
                return [NotificationManager.success('', 'Uspesna prijava!', 5000), setTimeout(function () { window.location.reload() }, 1500)];
            }
        });
    }

    logout() {
        localStorage.removeItem('user');
        sessionStorage.removeItem('cart');
        sessionStorage.removeItem('cartItems');
        window.location.reload();
    }

    register(data) {
        return axios.post(API_URL + "signup", data);
    }

    changePassword(data) {
        return axios.post(API_URL + "change-password", data);
    }

    resetPassword(data){
        return axios.post(API_URL + "reset-password", data);
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }
}

export default new AuthService();