import React, { Component } from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import AuthService from "../services/AuthService";
import { withNav } from '../common/withRouter';

class Login extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validationSchema() {
        return Yup.object().shape({
            /*
            // If using an email for login:
            email: Yup.string()
                .email("Please enter a valid email address.")
                .required("Email address is required."),
            */
            username: Yup.string()
                .required("Username is required."),
            password: Yup.string()
                .required("Password is required.")
                .min(6, "Password must be at least 6 characters.")
        });
    }

    handleSubmit({username, password}, {setFieldError}) {
        AuthService.login(username, password).then(
            () => {
                this.props.navigate("/");
                window.location.reload();
            },
            error => {
                console.log(error);
                setTimeout(() => {
                    setFieldError("password", "Invalid Password.");
                }, 1000);
            }
        );
    }

    render() {
        return (
            <div className="col-md-4 mx-auto my-4">
                <div className="card text-bg-light py-5 px-5">
                    <h3 className="card-title text-center">Please sign in</h3>
                    <Formik
                        initialValues={{
                            username: "",
                            password: ""
                        }}
                        onSubmit={(values, errors) => {
                            this.handleSubmit(values, errors);
                        }}
                        validationSchema={this.validationSchema}
                    >
                        {({
                            values, errors, handleSubmit, handleChange, handleBlur, 
                        }) => {
                            return (
                                <form onSubmit={handleSubmit} autoComplete="off">
                                    <div className="form-group my-3">
                                        <label htmlFor="username" className="form-label">Username:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            aria-describedby="usernameFeedback"
                                            value={values.username}
                                            onChange={handleChange("username")}
                                            onBlur={handleBlur("username")}
                                        />
                                        <div id="usernameFeedback" className="form-text text-danger">{errors.username}</div>
                                    </div>
                                    <div className="form-group my-3">
                                        <label htmlFor="password" className="form-label">Password:</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            aria-describedby="passwordFeedback"
                                            value={values.password}
                                            onChange={handleChange("password")}
                                            onBlur={handleBlur("password")}
                                        />
                                        <div id="passwordFeedback" className="form-text text-danger">{errors.password}</div>
                                    </div>
                                    <button className="btn btn-primary w-100 py-2" type="submit">Login</button>
                                </form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        );
    }
}

export default withNav(Login);