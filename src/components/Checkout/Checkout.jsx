import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  FaCheckCircle,
  FaExclamationCircle,
  FaLock,
  FaMoneyBillWave,
  FaShoppingBag,
  FaCreditCard,
} from "react-icons/fa";

import { useCart } from "../../CartContext/CartContext";

const API_URL = `${import.meta.env.VITE_API_URL}/api/orders`;

const TAX_RATE = 0.075;

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  zipCode: "",
  paymentMethod: "cod",
};

const initialToast = {
  visible: false,
  message: "",
  isError: false,
};

const getNumericPrice = (price) => {
  if (typeof price === "number" && Number.isFinite(price)) {
    return price;
  }

  const parsedPrice = parseFloat(
    String(price ?? "").replace(/[^0-9.-]+/g, "")
  );

  return Number.isNaN(parsedPrice) ? 0 : parsedPrice;
};

const getRequestConfig = () => {
  const token = localStorage.getItem("authToken");

  return {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
};

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState("");
  const [showToast, setShowToast] = useState(initialToast);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayToast = (message, isError = false) => {
    setShowToast({ visible: true, message, isError });

    if (!isError) {
      setTimeout(() => setShowToast(initialToast), 3000);
    }
  };

  // Stripe sends the user back here with ?payment_status=cancel if they
  // back out of the hosted checkout page. Let them know and let them retry.
  useEffect(() => {
    const paymentStatus = searchParams.get("payment_status");

    if (paymentStatus === "cancel") {
      const message = "Your payment was cancelled. You can try again below.";
      setFormError(message);
      displayToast(message, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const totalQuantity = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  const subtotal = Number(cartTotal || 0);

  const tax = useMemo(
    () => Math.round(subtotal * TAX_RATE * 100) / 100,
    [subtotal]
  );

  const shipping = 0;

  const total = useMemo(
    () => Math.round((subtotal + tax + shipping) * 100) / 100,
    [subtotal, tax, shipping]
  );

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
    if (!formData.firstName.trim()) {
      return "Please enter your first name.";
    }

    if (!formData.lastName.trim()) {
      return "Please enter your last name.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (!formData.phone.trim()) {
      return "Please enter a phone number.";
    }

    if (!formData.address.trim()) {
      return "Please enter your delivery address.";
    }

    if (!formData.city.trim()) {
      return "Please enter your city.";
    }

    if (!formData.zipCode.trim()) {
      return "Please enter your zip code.";
    }

    if (cartItems.length === 0) {
      return "Your cart is empty.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      displayToast(validationError, true);
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      const orderPayload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim().toLowerCase(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        zipCode: formData.zipCode.trim(),
        paymentMethod: formData.paymentMethod,
        subtotal,
        tax,
        total,
        items: cartItems.map((item) => ({
          name: item.name,
          price: getNumericPrice(item.price),
          imageUrl: item.image,
          quantity: Number(item.quantity) || 1,
        })),
      };

      const response = await axios.post(
        API_URL,
        orderPayload,
        getRequestConfig()
      );

      const { checkoutUrl } = response.data || {};

      if (formData.paymentMethod === "online" && checkoutUrl) {
        // Hand off to Stripe Checkout. The cart stays exactly as it is
        // until the payment is actually confirmed on the verification
        // page — we only clear it and move to My Orders once Stripe
        // reports success.
        window.location.href = checkoutUrl;
        return;
      }

      // Cash-on-delivery orders are placed immediately, so it's safe to
      // clear the cart and send the person to their order history now.
      await clearCart();

      displayToast("Your order was placed successfully.", false);

      setTimeout(() => {
        navigate("/myorder");
      }, 1000);
    } catch (error) {
      console.log(error.response?.data)
      console.error(
        "Checkout error:",
        error.response?.status,
        error.response?.data ?? error.message ?? error
        
      );
      

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong placing your order. Please try again.";

      setFormError(message);
      displayToast(message, true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <main
        className="relative min-h-screen overflow-hidden
        bg-linear-to-br from-[#100a07] via-[#21150d] to-[#063d2d]
        py-20 px-4 sm:px-6 lg:px-8 text-white"
      >
        <div
          className="relative max-w-xl mx-auto text-center
          rounded-[2rem] border border-emerald-400/20
          bg-white/5 backdrop-blur-xl p-10
          shadow-2xl shadow-black/25"
        >
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-full
            bg-emerald-900/40 border border-emerald-400/20
            flex items-center justify-center"
          >
            <FaShoppingBag className="text-3xl text-emerald-400" />
          </div>

          <h2 className="text-2xl font-bold text-emerald-100 mb-3">
            Your cart is empty
          </h2>

          <p className="text-emerald-100/65 text-lg mb-7">
            Add a few dishes to your cart before checking out.
          </p>

          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="inline-flex items-center gap-3
            rounded-full bg-linear-to-r
            from-emerald-400 to-green-600
            px-7 py-3.5 font-bold text-[#100a07]
            shadow-lg shadow-emerald-950/40"
          >
            <FaShoppingBag />
            Browse Menu
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden
      bg-linear-to-br from-[#100a07] via-[#21150d] to-[#063d2d]
      py-20 px-4 sm:px-6 lg:px-8 text-white"
    >
      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-24
          w-[420px] h-[420px]
          rounded-full bg-emerald-500/10 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -bottom-40 -right-24
          w-[480px] h-[480px]
          rounded-full bg-amber-500/10 blur-3xl"
          animate={{
            x: [0, -25, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* TOAST */}
      <AnimatePresence>
        {showToast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            className={`fixed right-5 top-5 z-[100] max-w-sm rounded-2xl border px-5 py-3 shadow-2xl shadow-black/30 backdrop-blur-xl ${
              showToast.isError
                ? "border-red-300/30 bg-[#351817]/95"
                : "border-emerald-300/30 bg-[#10271e]/95"
            }`}
          >
            <div
              className={`flex items-center gap-3 ${
                showToast.isError ? "text-red-100" : "text-emerald-100"
              }`}
            >
              {showToast.isError ? (
                <FaExclamationCircle className="shrink-0 text-red-400" />
              ) : (
                <FaCheckCircle className="shrink-0 text-emerald-400" />
              )}

              <span className="font-semibold">{showToast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative max-w-7xl mx-auto">
        {/* HEADING */}
        <motion.header
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.35em" }}
            transition={{ duration: 0.8 }}
            className="text-emerald-400 uppercase
            text-xs sm:text-sm font-semibold mb-4"
          >
            Almost there
          </motion.p>

          <h1
            className="font-dancingscript text-5xl sm:text-6xl
            md:text-7xl font-bold
            bg-linear-to-r from-emerald-200
            via-green-400 to-amber-300
            bg-clip-text text-transparent drop-shadow-lg"
          >
            Checkout
          </h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[2px] mx-auto mt-6
            bg-linear-to-r from-transparent
            via-emerald-400 to-transparent"
          />
        </motion.header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
            {/* DELIVERY DETAILS */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-[2rem] border border-emerald-400/20
              bg-white/5 backdrop-blur-xl p-7
              shadow-2xl shadow-black/25 space-y-7"
            >
              <div>
                <h2 className="text-2xl font-serif font-bold text-emerald-100 mb-1">
                  Delivery Details
                </h2>
                <p className="text-sm text-emerald-100/55">
                  Tell us where to bring your Maison EKO order.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="given-name"
                  className="w-full rounded-2xl border border-emerald-400/20 bg-black/20 px-5 py-3.5 text-emerald-50 outline-none backdrop-blur-md transition-all duration-300 placeholder:text-emerald-100/35 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="family-name"
                  className="w-full rounded-2xl border border-emerald-400/20 bg-black/20 px-5 py-3.5 text-emerald-50 outline-none backdrop-blur-md transition-all duration-300 placeholder:text-emerald-100/35 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="email"
                  className="w-full rounded-2xl border border-emerald-400/20 bg-black/20 px-5 py-3.5 text-emerald-50 outline-none backdrop-blur-md transition-all duration-300 placeholder:text-emerald-100/35 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="tel"
                  className="w-full rounded-2xl border border-emerald-400/20 bg-black/20 px-5 py-3.5 text-emerald-50 outline-none backdrop-blur-md transition-all duration-300 placeholder:text-emerald-100/35 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <input
                  type="text"
                  name="address"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="street-address"
                  className="w-full rounded-2xl border border-emerald-400/20 bg-black/20 px-5 py-3.5 text-emerald-50 outline-none backdrop-blur-md transition-all duration-300 placeholder:text-emerald-100/35 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="address-level2"
                  className="w-full rounded-2xl border border-emerald-400/20 bg-black/20 px-5 py-3.5 text-emerald-50 outline-none backdrop-blur-md transition-all duration-300 placeholder:text-emerald-100/35 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <input
                  type="text"
                  name="zipCode"
                  placeholder="Zip code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  autoComplete="postal-code"
                  className="w-full rounded-2xl border border-emerald-400/20 bg-black/20 px-5 py-3.5 text-emerald-50 outline-none backdrop-blur-md transition-all duration-300 placeholder:text-emerald-100/35 focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-emerald-100 mb-4">
                  Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-5 py-4 transition-all duration-300 ${
                      formData.paymentMethod === "cod"
                        ? "border-emerald-400/60 bg-emerald-500/10"
                        : "border-emerald-400/15 bg-black/10 hover:border-emerald-400/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="accent-emerald-500"
                    />
                    <FaMoneyBillWave className="text-emerald-400" />
                    <span className="text-emerald-100/85 font-medium">
                      Cash on delivery
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-5 py-4 transition-all duration-300 ${
                      formData.paymentMethod === "online"
                        ? "border-emerald-400/60 bg-emerald-500/10"
                        : "border-emerald-400/15 bg-black/10 hover:border-emerald-400/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === "online"}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="accent-emerald-500"
                    />
                    <FaCreditCard className="text-emerald-400" />
                    <span className="text-emerald-100/85 font-medium">
                      Pay online
                    </span>
                  </label>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {formError && (
                  <motion.p
                    key={formError}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  >
                    {formError}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.section>

            {/* ORDER SUMMARY */}
            <motion.aside
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-fit lg:sticky lg:top-28
              rounded-[2rem]
              border border-emerald-400/20
              bg-white/5 backdrop-blur-xl p-7
              shadow-2xl shadow-black/30"
            >
              <h2 className="text-2xl font-serif font-bold text-emerald-100">
                Order Summary
              </h2>

              <div className="w-16 h-[2px] mt-4 mb-6 bg-linear-to-r from-emerald-400 to-transparent" />

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cartItems.map((item) => {
                  const price = getNumericPrice(item.price);
                  const quantity = Number(item.quantity) || 1;

                  return (
                    <div
                      key={item.cartEntryId}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="text-emerald-100/75 truncate">
                        {item.name}{" "}
                        <span className="text-emerald-100/45">
                          × {quantity}
                        </span>
                      </span>

                      <span className="shrink-0 font-semibold text-emerald-200">
                        ${(price * quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="my-6 border-t border-emerald-400/15" />

              <div className="space-y-4 text-emerald-100/70">
                <div className="flex justify-between">
                  <span>Total items</span>
                  <span>{totalQuantity}</span>
                </div>

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-emerald-300">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="my-6 border-t border-emerald-400/15" />

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>

                <motion.span
                  key={total}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-3xl font-bold text-amber-300"
                >
                  ${total.toFixed(2)}
                </motion.span>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={isSubmitting ? {} : { y: -3, scale: 1.02 }}
                whileTap={isSubmitting ? {} : { scale: 0.94 }}
                className="mt-7 w-full inline-flex
                items-center justify-center gap-3
                rounded-full px-7 py-4
                bg-linear-to-r from-emerald-400
                to-green-600 text-[#100a07]
                font-bold shadow-lg
                shadow-emerald-950/40
                disabled:cursor-not-allowed disabled:opacity-65"
              >
                <FaLock className="text-sm" />
                {isSubmitting ? "Placing Order..." : "Place Order"}
              </motion.button>
            </motion.aside>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
