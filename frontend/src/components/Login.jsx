import React, { useState } from "react";
import axios from "axios";
import { loginStyles } from "../assets/dummyStyles";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";

const API_BASE = "http://localhost:4000";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = ({ onLoginSuccess = null }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const e = {};

    if (!email) {
      e.email = "Email is required";
    } else if (!isValidEmail(email)) {
      e.email = "Enter valid email";
    }

    if (!password) {
      e.password = "Password is required";
    }

    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    setSubmitError("");

    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length) return;

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/user/login`, {
        email,
        password,
      });

      if (res.data.success) {
  localStorage.setItem("authToken", res.data.token);

  localStorage.setItem(
    "currentUser",
    JSON.stringify(res.data.user)
  );

  window.dispatchEvent(
    new CustomEvent("authChanged", {
      detail: { user: res.data.user },
    })
  );

  alert("Login Successful!");

  navigate("/");
}
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loginStyles.pagecontainer}>
      <div className={loginStyles.bubble1}></div>
      <div className={loginStyles.bubble2}></div>

      <Link to="/" className={loginStyles.backButton}>
        <ArrowLeft className={loginStyles.backButtonIcon} />
        <span className={loginStyles.backButtonText}>Home</span>
      </Link>

      <div className={loginStyles.formContainer}>
        <form
          className={loginStyles.form}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className={loginStyles.formWrapper}>
            <div className={loginStyles.animatedBorder}>
              <div className={loginStyles.formContent}>
                <h2 className={loginStyles.heading}>
                  <span className={loginStyles.headingIcon}>
                    <LogIn className={loginStyles.headingIconInner} />
                  </span>

                  <span className={loginStyles.headingText}>
                    Login
                  </span>
                </h2>

                <p className={loginStyles.subtitle}>
                  Sign in to continue to quiz app.
                </p>

                <label className={loginStyles.label}>
                  <span className={loginStyles.labelText}>
                    Email
                  </span>

                  <div className={loginStyles.inputContainer}>
                    <span className={loginStyles.inputIcon}>
                      <Mail className={loginStyles.inputIconInner} />
                    </span>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={loginStyles.input}
                      placeholder="your@email.com"
                    />
                  </div>

                  {errors.email && (
                    <p className={loginStyles.errorText}>
                      {errors.email}
                    </p>
                  )}
                </label>

                <label className={loginStyles.label}>
                  <span className={loginStyles.labelText}>
                    Password
                  </span>

                  <div className={loginStyles.inputContainer}>
                    <span className={loginStyles.inputIcon}>
                      <Lock className={loginStyles.inputIconInner} />
                    </span>

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className={loginStyles.input}
                      placeholder="Password"
                    />

                    <button
                      type="button"
                      className={loginStyles.passwordToggle}
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          className={
                            loginStyles.passwordToggleIcon
                          }
                        />
                      ) : (
                        <Eye
                          className={
                            loginStyles.passwordToggleIcon
                          }
                        />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className={loginStyles.errorText}>
                      {errors.password}
                    </p>
                  )}
                </label>

                {submitError && (
                  <p className={loginStyles.submitError}>
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={loginStyles.submitButton}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>

                <div className={loginStyles.signupContainer}>
                  <span className={loginStyles.signupText}>
                    Don't have an account?
                  </span>

                  <Link
                    to="/signup"
                    className={loginStyles.signupLink}
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{loginStyles.animations}</style>
    </div>
  );
};

export default Login;