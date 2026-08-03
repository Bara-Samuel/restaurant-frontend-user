import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

import {
  FaArrowRight,
  FaCheckCircle,
  FaEnvelope,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUserPlus,
} from "react-icons/fa";

const API_URL = `${import.meta.env.VITE_API_URL}/api/user`;

const initialFormData = {
  email: "",
  password: "",
  rememberMe: false,
};

const initialToast = {
  visible: false,
  message: "",
  isError: false,
};

const Login = ({
  onLoginSuccess,
  onClose,
  onSwitchToSignUp,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [showToast, setShowToast] = useState(initialToast);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load the remembered email address.
  useEffect(() => {
    try {
      const storedLogin = localStorage.getItem("rememberedLogin");

      if (!storedLogin) {
        return;
      }

      const rememberedLogin = JSON.parse(storedLogin);

      setFormData((previous) => ({
        ...previous,
        email: rememberedLogin.email || "",
        rememberMe: true,
      }));
    } catch (error) {
      console.error(
        "Could not load remembered login information:",
        error
      );

      localStorage.removeItem("rememberedLogin");
    }
  }, []);

  // Hide toast messages automatically.
  useEffect(() => {
    if (!showToast.visible) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowToast(initialToast);
    }, 3000);

    return () => clearTimeout(timer);
  }, [showToast.visible]);

  const displayToast = (message, isError = false) => {
    setShowToast({
      visible: true,
      message,
      isError,
    });
  };

  const handleChange = ({
    target: { name, value, type, checked },
  }) => {
    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (formError) {
      setFormError("");
    }
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (!formData.password) {
      return "Please enter your password.";
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
      const loginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      };

      const response = await axios.post(
        `${API_URL}/login`,
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Login response:", response.data);

      const { success, token } = response.data;

      if (!success || !token) {
        throw new Error("Login failed.");
      }

      // Store the JWT returned by the backend.
      localStorage.setItem("authToken", token);

      // Store only the email when Remember Me is selected.
      if (formData.rememberMe) {
        localStorage.setItem(
          "rememberedLogin",
          JSON.stringify({
            email: loginData.email,
          })
        );
      } else {
        localStorage.removeItem("rememberedLogin");
      }

      displayToast("Login successful.", false);

      setTimeout(() => {
        if (typeof onLoginSuccess === "function") {
          onLoginSuccess(token);
        }
      }, 1000);
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data || error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please check your email and password.";

      setFormError(message);
      displayToast(message, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-16 -top-20 h-52 w-52 rounded-full bg-emerald-500/10 blur-3xl"
          animate={{
            scale: [1, 1.12, 1],
            x: [0, 12, 0],
            y: [0, 10, 0],
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
            scale: [1, 1.1, 1],
            x: [0, -12, 0],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Toast */}
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
              showToast.isError
                ? "border-red-300/30 bg-[#351817]/95"
                : "border-emerald-300/30 bg-[#10271e]/95"
            }`}
          >
            <div
              className={`flex items-center gap-3 ${
                showToast.isError
                  ? "text-red-100"
                  : "text-emerald-100"
              }`}
            >
              {showToast.isError ? (
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
            Welcome back
          </motion.p>

          <h2 className="bg-linear-to-r from-emerald-200 via-green-400 to-amber-300 bg-clip-text font-dancingscript text-4xl font-bold text-transparent sm:text-5xl">
            Enter Maison EKO
          </h2>

          <div className="mx-auto mt-4 h-[2px] w-20 bg-linear-to-r from-transparent via-emerald-400 to-transparent" />

          <p className="mt-4 text-sm leading-relaxed text-emerald-100/60">
            Sign in to continue your culinary experience.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
        >
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
              autoComplete="current-password"
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

          {/* Remember me and forgot password */}
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <label className="flex cursor-pointer items-center gap-3 text-emerald-100/70">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isSubmitting}
                className="h-4 w-4 rounded border-emerald-400/40 bg-black/20 accent-emerald-500 disabled:cursor-not-allowed"
              />

              <span>Remember me</span>
            </label>

            <button
              type="button"
              disabled={isSubmitting}
              className="self-start text-emerald-400 transition-colors hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Forgot password?
            </button>
          </div>

          {/* Error message */}
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

          {/* Sign in button */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
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
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-linear-to-r from-emerald-400 via-green-500 to-emerald-600 px-6 py-3.5 font-bold text-[#100a07] shadow-xl shadow-emerald-950/40 disabled:cursor-not-allowed disabled:opacity-65"
          >
            <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-white/25 via-transparent to-transparent transition-transform duration-700 group-hover:translate-x-full" />

            <span className="relative z-10">
              {isSubmitting ? "Signing In..." : "Sign In"}
            </span>

            <FaArrowRight className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </form>

        {/* Divider */}
        <div className="my-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-emerald-400/15" />

          <span className="text-xs uppercase tracking-widest text-emerald-100/35">
            New to EKO?
          </span>

          <div className="h-px flex-1 bg-emerald-400/15" />
        </div>

        {/* Create account */}
        <motion.button
          type="button"
          whileHover={{
            y: -2,
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.95,
          }}
          onClick={onSwitchToSignUp}
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-3 rounded-full border border-emerald-400/25 bg-white/5 px-6 py-3.5 font-semibold text-emerald-200 backdrop-blur-md transition-colors hover:border-emerald-400/50 hover:bg-emerald-900/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaUserPlus />
          Create New Account
        </motion.button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="mt-5 w-full text-center text-sm text-emerald-100/40 transition-colors hover:text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Close
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default Login;