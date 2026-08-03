import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

import {
  FaArrowLeft,
  FaCheckCircle,
  FaEnvelope,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";

const API_URL = `${import.meta.env.VITE_API_URL}/api/user`;

const initialFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialToast = {
  visible: false,
  message: "",
  type: "success",
};

const SignUp = ({ onBackToLogin }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState("");
  const [showToast, setShowToast] = useState(initialToast);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automatically hide the toast after three seconds.
  useEffect(() => {
    if (!showToast.visible) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowToast(initialToast);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showToast.visible]);

  const displayToast = (message, type = "success") => {
    setShowToast({
      visible: true,
      message,
      type,
    });
  };

  const handleChange = ({ target: { name, value } }) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  const validateForm = () => {
    const username = formData.username.trim();
    const email = formData.email.trim();

    if (!username) {
      return "Please enter a username.";
    }

    if (!email) {
      return "Please enter your email address.";
    }

    if (formData.password.length < 6) {
      return "Your password must contain at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Your passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      // Do not send confirmPassword unless your backend requires it.
      const registrationData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const response = await axios.post(
        `${API_URL}/register`,
        registrationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Registration response:", response.data);

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Registration failed."
        );
      }

      if (response.data.token) {
        localStorage.setItem(
          "authToken",
          response.data.token
        );
      }

      setFormData(initialFormData);

      displayToast(
        response.data?.message ||
          "Your account was created successfully.",
        "success"
      );

      // Return to the login view after registration.
      if (typeof onBackToLogin === "function") {
        setTimeout(() => {
          onBackToLogin();
        }, 1200);
      }
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";

      setFormError(message);
      displayToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toastIsError = showToast.type === "error";

  return (
    <div className="relative w-full">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-16 -top-20 h-52 w-52 rounded-full bg-emerald-500/10 blur-3xl"
          animate={{
            x: [0, 12, 0],
            y: [0, 10, 0],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl"
          animate={{
            x: [0, -12, 0],
            y: [0, -8, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Success or error toast */}
      <AnimatePresence>
        {showToast.visible && (
          <motion.div
            initial={{
              opacity: 0,
              y: -30,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -30,
              scale: 0.9,
            }}
            className={`fixed right-5 top-5 z-[100] max-w-sm rounded-2xl border px-5 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl ${
              toastIsError
                ? "border-red-300/30 bg-[#351817]/95"
                : "border-emerald-300/30 bg-[#10271e]/95"
            }`}
          >
            <div
              className={`flex items-center gap-3 ${
                toastIsError
                  ? "text-red-100"
                  : "text-emerald-100"
              }`}
            >
              {toastIsError ? (
                <FaExclamationCircle className="shrink-0 text-red-400" />
              ) : (
                <FaCheckCircle className="shrink-0 text-emerald-400" />
              )}

              <span className="font-semibold">
                {showToast.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.55,
          ease: "easeOut",
        }}
        className="relative z-10"
      >
        {/* Heading */}
        <div className="mb-8 text-center">
          <motion.p
            initial={{
              opacity: 0,
              letterSpacing: "0.08em",
            }}
            animate={{
              opacity: 1,
              letterSpacing: "0.28em",
            }}
            transition={{
              duration: 0.7,
            }}
            className="mb-3 text-xs font-semibold uppercase text-emerald-400"
          >
            Join the experience
          </motion.p>

          <h2 className="bg-linear-to-r from-emerald-200 via-green-400 to-amber-300 bg-clip-text font-dancingscript text-4xl font-bold text-transparent sm:text-5xl">
            Create Your EKO Account
          </h2>

          <div className="mx-auto mt-4 h-[2px] w-20 bg-linear-to-r from-transparent via-emerald-400 to-transparent" />

          <p className="mt-4 text-sm leading-relaxed text-emerald-100/60">
            Save your favorites, manage your orders, and enjoy a
            more personal dining experience.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
        >
          {/* Username */}
          <motion.div
            whileFocusWithin={{ scale: 1.01 }}
            className="relative"
          >
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              autoComplete="username"
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-emerald-400/20 bg-black/20 px-12 py-3.5 text-emerald-50 outline-none backdrop-blur-md transition-all duration-300 placeholder:text-emerald-100/35 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </motion.div>

          {/* Email */}
          <motion.div
            whileFocusWithin={{ scale: 1.01 }}
            className="relative"
          >
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-emerald-400/20 bg-black/20 px-12 py-3.5 text-emerald-50 outline-none backdrop-blur-md transition-all duration-300 placeholder:text-emerald-100/35 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </motion.div>

          {/* Password */}
          <motion.div
            whileFocusWithin={{ scale: 1.01 }}
            className="relative"
          >
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-emerald-400/20 bg-black/20 px-12 py-3.5 pr-14 text-emerald-50 outline-none backdrop-blur-md transition-all duration-300 placeholder:text-emerald-100/35 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <motion.button
              type="button"
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              onClick={() =>
                setShowPassword((previous) => !previous)
              }
              disabled={isSubmitting}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </motion.button>
          </motion.div>

          {/* Confirm password */}
          <motion.div
            whileFocusWithin={{ scale: 1.01 }}
            className="relative"
          >
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />

            <input
              type={
                showConfirmPassword ? "text" : "password"
              }
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-emerald-400/20 bg-black/20 px-12 py-3.5 pr-14 text-emerald-50 outline-none backdrop-blur-md transition-all duration-300 placeholder:text-emerald-100/35 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <motion.button
              type="button"
              aria-label={
                showConfirmPassword
                  ? "Hide confirmation password"
                  : "Show confirmation password"
              }
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              onClick={() =>
                setShowConfirmPassword(
                  (previous) => !previous
                )
              }
              disabled={isSubmitting}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showConfirmPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </motion.button>
          </motion.div>

          {/* Form error */}
          <AnimatePresence mode="wait">
            {formError && (
              <motion.p
                key={formError}
                initial={{
                  opacity: 0,
                  y: -8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                {formError}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <motion.button
            type="submit"
            whileHover={
              isSubmitting
                ? {}
                : {
                    y: -3,
                    scale: 1.02,
                  }
            }
            whileTap={
              isSubmitting
                ? {}
                : {
                    scale: 0.95,
                  }
            }
            disabled={isSubmitting}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-linear-to-r from-emerald-400 via-green-500 to-emerald-600 px-6 py-3.5 font-bold text-[#100a07] shadow-xl shadow-emerald-950/40 disabled:cursor-not-allowed disabled:opacity-65"
          >
            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-white/25 via-transparent to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <FaUserPlus className="relative z-10" />

            <span className="relative z-10">
              {isSubmitting
                ? "Creating Account..."
                : "Create Account"}
            </span>
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-emerald-400/15" />

          <span className="text-xs uppercase tracking-widest text-emerald-100/35">
            Already a member?
          </span>

          <div className="h-px flex-1 bg-emerald-400/15" />
        </div>

        {/* Back to login */}
        <motion.button
          type="button"
          whileHover={{
            y: -2,
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={onBackToLogin}
          disabled={isSubmitting}
          className="group flex w-full items-center justify-center gap-3 rounded-full border border-emerald-400/25 bg-white/5 px-6 py-3.5 font-semibold text-emerald-200 backdrop-blur-md transition-colors hover:border-emerald-400/50 hover:bg-emerald-900/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />

          Back to Login
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SignUp;