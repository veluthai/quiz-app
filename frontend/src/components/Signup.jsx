import React, { useState } from "react";
import { signupStyles } from "../assets/dummyStyles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Signup = ({ onSignupSuccess = null }) => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Validation
  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Enter valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Minimum 6 characters";
    return e;
  };

  // 🔹 FAKE SIGNUP (NO BACKEND)
  const handleSubmit = async (ev) => {
  ev.preventDefault();
  setSubmitError("");

  const v = validate();
  setErrors(v);

  if (Object.keys(v).length) return;

  setLoading(true);

  try {
    const res = await axios.post(
      "http://localhost:4000/api/user/register",
      {
        name,
        email,
        password,
      }
    );

    if (res.data.success) {
      // Save JWT token
      localStorage.setItem("authToken", res.data.token);

      // Save user
      localStorage.setItem(
        "currentUser",
        JSON.stringify(res.data.user)
      );

      // Notify Navbar
      window.dispatchEvent(
        new CustomEvent("authChanged", {
          detail: { user: res.data.user },
        })
      );

      if (typeof onSignupSuccess === "function") {
        onSignupSuccess(res.data.user);
      }

      navigate("/", { replace: true });
    }
  } catch (err) {
    setSubmitError(
      err.response?.data?.message || "Signup failed"
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div className={signupStyles.pageContainer}>
      <Link to="/login" className={signupStyles.backButton}>
        <ArrowLeft className={signupStyles.backButtonIcon} />
        <span className={signupStyles.backButtonText}>Back</span>
      </Link>

      <div className={signupStyles.formContainer}>
        <form onSubmit={handleSubmit} noValidate>
          <div className={signupStyles.animatedBorder}>
            <div className={signupStyles.formContent}>
              <h2 className={signupStyles.heading}>
                <span className={signupStyles.headingIcon}>
                  <CheckCircle
                    className={signupStyles.headingIconInner}
                  />
                </span>
                <span className={signupStyles.headingText}>
                  Create Account
                </span>
              </h2>

              <p className={signupStyles.subtitle}>
                Create account to continue Quiz app.
              </p>

              {/* NAME */}
              <label className={signupStyles.label}>
                <span className={signupStyles.labelText}>
                  Full Name
                </span>
                <div className={signupStyles.inputContainer}>
                  <User
                    className={signupStyles.inputIconInner}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name)
                        setErrors((s) => ({
                          ...s,
                          name: undefined,
                        }));
                    }}
                    className={`${signupStyles.input} ${
                      errors.name
                        ? signupStyles.inputError
                        : signupStyles.inputNormal
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className={signupStyles.errorText}>
                    {errors.name}
                  </p>
                )}
              </label>

              {/* EMAIL */}
              <label className={signupStyles.label}>
                <span className={signupStyles.labelText}>
                  Email
                </span>
                <div className={signupStyles.inputContainer}>
                  <Mail
                    className={signupStyles.inputIconInner}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors((s) => ({
                          ...s,
                          email: undefined,
                        }));
                    }}
                    className={`${signupStyles.input} ${
                      errors.email
                        ? signupStyles.inputError
                        : signupStyles.inputNormal
                    }`}
                    placeholder="your@example.com"
                  />
                </div>
                {errors.email && (
                  <p className={signupStyles.errorText}>
                    {errors.email}
                  </p>
                )}
              </label>

              {/* PASSWORD */}
              <label className={signupStyles.label}>
                <span className={signupStyles.labelText}>
                  Password
                </span>
                <div className={signupStyles.inputContainer}>
                  <Lock
                    className={signupStyles.inputIconInner}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((s) => ({
                          ...s,
                          password: undefined,
                        }));
                    }}
                    className={`${signupStyles.input} ${
                      errors.password
                        ? signupStyles.inputError
                        : signupStyles.inputNormal
                    }`}
                    placeholder="Create password"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((s) => !s)
                    }
                    className={signupStyles.passwordToggle}
                  >
                    {showPassword ? (
                      <EyeOff
                        className={
                          signupStyles.passwordToggleIcon
                        }
                      />
                    ) : (
                      <Eye
                        className={
                          signupStyles.passwordToggleIcon
                        }
                      />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className={signupStyles.errorText}>
                    {errors.password}
                  </p>
                )}
              </label>

              {submitError && (
                <p className={signupStyles.submitError}>
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={signupStyles.submitButton}
              >
                {loading
                  ? "Creating account..."
                  : "Create Account"}
              </button>
            </div>
          </div>
        </form>

        <div className={signupStyles.loginPromptContainer}>
          <span className={signupStyles.loginPromptText}>
            Already have an account?
          </span>
          <Link
            to="/login"
            className={signupStyles.loginPromptLink}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;