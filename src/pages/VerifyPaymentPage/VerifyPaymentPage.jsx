import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

import { useCart } from "../../CartContext/CartContext";

const API_URL = "http://localhost:4000";

const getRequestConfig = () => {
  const token = localStorage.getItem("authToken");

  return {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
};

/**
 * Lands here after Stripe redirects back from a successful hosted
 * checkout session (see success_url in orderController.js). It confirms
 * the payment with the backend, and only then clears the cart and moves
 * the person on to their order history — the cart is never touched if
 * the payment can't be confirmed.
 */
const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("Confirming your payment...");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const success = searchParams.get("success");

    if (!success || !sessionId) {
      setStatus("error");
      setMessage("We couldn't find your payment details.");
      return;
    }

    let isMounted = true;

    const verify = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/orders/confirm`, {
          ...getRequestConfig(),
          params: { session_id: sessionId },
        });

        if (!isMounted) return;

        // Only clear the cart once the server confirms payment succeeded.
        await clearCart();

        setStatus("success");
        setMessage("Payment confirmed! Your order has been placed.");

        setTimeout(() => {
          navigate("/myorder", { state: { order: response.data } });
        }, 1800);
      } catch (error) {
        console.error(
          "Payment verification error:",
          error.response?.data || error
        );

        if (!isMounted) return;

        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "We couldn't confirm your payment. Please contact support."
        );
      }
    };

    verify();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <main
      className="relative min-h-screen overflow-hidden
      flex items-center justify-center
      bg-linear-to-br from-[#100a07] via-[#21150d] to-[#063d2d]
      px-4 py-20 text-white"
    >
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-24 w-[420px] h-[420px]
          rounded-full bg-emerald-500/10 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-24 w-[480px] h-[480px]
          rounded-full bg-amber-500/10 blur-3xl"
          animate={{ x: [0, -25, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-md w-full text-center
        rounded-[2rem] border border-emerald-400/20
        bg-white/5 backdrop-blur-xl p-10
        shadow-2xl shadow-black/25"
      >
        <div
          className="w-20 h-20 mx-auto mb-6 rounded-full
          bg-emerald-900/40 border border-emerald-400/20
          flex items-center justify-center"
        >
          {status === "verifying" && (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            >
              <FaSpinner className="text-3xl text-emerald-400" />
            </motion.span>
          )}

          {status === "success" && (
            <FaCheckCircle className="text-3xl text-emerald-400" />
          )}

          {status === "error" && (
            <FaExclamationTriangle className="text-3xl text-red-400" />
          )}
        </div>

        <h1 className="text-2xl font-bold text-emerald-100 mb-3">
          {status === "verifying" && "Verifying Payment"}
          {status === "success" && "Payment Successful"}
          {status === "error" && "Verification Failed"}
        </h1>

        <p className="text-emerald-100/65 text-lg mb-7">{message}</p>

        {status === "error" && (
          <Link
            to="/checkout"
            className="inline-flex items-center gap-3
            rounded-full bg-linear-to-r
            from-emerald-400 to-green-600
            px-7 py-3.5 font-bold text-[#100a07]
            shadow-lg shadow-emerald-950/40"
          >
            Back to Checkout
          </Link>
        )}
      </motion.div>
    </main>
  );
};

export default VerifyPayment;
