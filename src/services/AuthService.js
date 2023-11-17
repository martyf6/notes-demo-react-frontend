import axios from "axios";

const API_BASE = 'http://localhost:8080/auth';
const USER_KEY = "user";

class AuthService {
  login(username, password) {
    return axios
      .post(`${API_BASE}/login`, {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem(USER_KEY, JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    return axios
      .post(`${API_BASE}/logout`)
      .then(response => {
        console.log("User successfully logged out.");
        localStorage.removeItem(USER_KEY);
      });
  }

  register(username, email, password) {
    return axios.post(`${API_BASE}/register`, {
        username,
        email,
        password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }
}

export default new AuthService();

export function authHeader() {
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    if (user && user.accessToken) {
        return { Authorization: "Bearer " + user.accessToken };
    } else {
        return {};
    }
}