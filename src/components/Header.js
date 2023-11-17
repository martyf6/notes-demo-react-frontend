import React, { Component } from "react";
import { Link } from 'react-router-dom'

import AuthService from "../services/AuthService";

class HeaderComponent extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);

        this.state = {
            currentUser: undefined,
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();
        if (user) {
          this.setState({
            currentUser: user
          });
        }
    }

    logout() {
        AuthService.logout();
        this.setState({
            currentUser: undefined,
        });
    }

    render() {
        const { currentUser } = this.state;

        return (
            <div>
                <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                    <div className="container-md">
                        <Link to={"/notes"} className="navbar-brand">
                        NotesDemo
                        </Link>
                        <button 
                            className="navbar-toggler" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#navbarItems" 
                            aria-controls="navbarItems" 
                            aria-expanded="false" 
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarItems">
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item">
                                    <Link to={"/notes"} className="nav-link">
                                    Browse
                                    </Link>
                                </li>
                                {currentUser && (
                                    <li className="nav-item">
                                        <Link to={"/add"} className="nav-link">
                                        Create
                                        </Link>
                                    </li>
                                )}
                            </ul>
                            {currentUser ? (
                                <ul className="navbar-nav">
                                    <li className="navbar-text text-white mx-1">
                                    Welcome, {currentUser.username}!
                                    </li>
                                    <li className="nav-item mx-1">
                                        <a href="/login" className="nav-link" onClick={this.logout}>
                                        Logout
                                        </a>
                                    </li>
                                </ul>
                            ) : (
                                <ul className="navbar-nav">
                                    <li className="nav-item mx-1">
                                        <Link to={"/login"} className="nav-link">
                                        Login
                                        </Link>
                                    </li>

                                    <li className="nav-item mx-1">
                                        <Link to={"/register"} className="nav-link">
                                        Sign Up
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}

export default HeaderComponent;