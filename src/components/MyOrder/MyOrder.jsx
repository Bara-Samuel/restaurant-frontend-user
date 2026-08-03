import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaBoxOpen,
  FaShoppingBag,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaTimesCircle,
} from "react-icons/fa";

const API_URL = `${import.meta.env.VITE_API_URL}/api/orders`;

const getRequestConfig = () => {
  const token = localStorage.getItem("authToken");

  return {
    withCredentials: true,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
};

const getNumericPrice = (price) => {
  if (typeof price === "number" && Number.isFinite(price)) {
    return price;
  }

  const parsed = parseFloat(String(price ?? "").replace(/[^0-9.-]+/g, ""));

  return Number.isNaN(parsed) ? 0 : parsed;
};

// Order line items may already carry a full URL (set when the order was
// placed) — only prepend the API host if the value is a relative path.
const getOrderItemImage = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${API_URL}${imageUrl}`;
};

const paymentStatusStyles = {
  succeeded: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  pending: "border-amber-400/30 bg-amber-500/10 text-amber-200",
  failed: "border-red-400/30 bg-red-500/10 text-red-200",
};

const orderStatusMeta = {
  processing: { icon: FaClock, label: "Processing" },
  outForDelivery: { icon: FaTruck, label: "Out for Delivery" },
  delivered: { icon: FaCheckCircle, label: "Delivered" },
};

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await axios.get(
          API_URL,
          getRequestConfig()
        );

        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(
          "Unable to load orders:",
          err.response?.data || err.message || err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load your order history right now."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <main
      className="relative min-h-screen overflow-hidden
      bg-linear-to-br from-[#100a07] via-[#21150d] to-[#063d2d]
      py-20 px-4 sm:px-6 lg:px-8 text-white"
    >
      {/* BACKGROUND GLOWS */}
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

      <div className="relative max-w-5xl mx-auto">
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
            Your dining history
          </motion.p>

          <h1
            className="font-dancingscript text-5xl sm:text-6xl
            md:text-7xl font-bold
            bg-linear-to-r from-emerald-200
            via-green-400 to-amber-300
            bg-clip-text text-transparent drop-shadow-lg"
          >
            My Orders
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

        {isLoading && (
          <div className="py-16 text-center text-lg text-emerald-200">
            Loading your orders...
          </div>
        )}

        {!isLoading && error && (
          <div
            className="mx-auto max-w-xl rounded-2xl border
            border-red-400/20 bg-red-500/10
            px-6 py-5 text-center text-red-200"
          >
            {error}
          </div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="max-w-xl mx-auto text-center
            rounded-[2rem] border border-emerald-400/20
            bg-white/5 backdrop-blur-xl p-10
            shadow-2xl shadow-black/25"
          >
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full
              bg-emerald-900/40 border border-emerald-400/20
              flex items-center justify-center"
            >
              <FaBoxOpen className="text-3xl text-emerald-400" />
            </div>

            <h2 className="text-2xl font-bold text-emerald-100 mb-3">
              No orders yet
            </h2>

            <p className="text-emerald-100/65 text-lg mb-7">
              Once you place an order, it will show up here.
            </p>

            <Link
              to="/menu"
              className="inline-flex items-center gap-3
              rounded-full bg-linear-to-r
              from-emerald-400 to-green-600
              px-7 py-3.5 font-bold text-[#100a07]
              shadow-lg shadow-emerald-950/40"
            >
              <FaShoppingBag />
              Browse Menu
            </Link>
          </motion.div>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, index) => {
                const meta = orderStatusMeta[order.status] || orderStatusMeta.processing;
                const StatusIcon = meta.icon;
                const paymentClass =
                  paymentStatusStyles[order.paymentStatus] ||
                  paymentStatusStyles.pending;

                return (
                  <motion.article
                    key={order._id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    className="rounded-[2rem] border border-emerald-400/15
                    bg-white/5 backdrop-blur-xl p-6 sm:p-7
                    shadow-xl shadow-black/20"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-emerald-100/45">
                          Order ID
                        </p>
                        <p className="font-mono text-sm text-emerald-200">
                          {order._id}
                        </p>
                        {order.createdAt && (
                          <p className="mt-1 text-sm text-emerald-100/55">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${paymentClass}`}
                        >
                          {order.paymentStatus === "succeeded" ? (
                            <FaCheckCircle />
                          ) : order.paymentStatus === "failed" ? (
                            <FaTimesCircle />
                          ) : (
                            <FaClock />
                          )}
                          {order.paymentStatus}
                        </span>

                        <span
                          className="inline-flex items-center gap-2
                          rounded-full border border-emerald-400/20
                          bg-black/20 px-3 py-1.5 text-xs font-semibold
                          text-emerald-100/80"
                        >
                          <StatusIcon />
                          {meta.label}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 border-t border-emerald-400/10 pt-4">
                      {(order.items || []).map((entry) => {
                        const price = getNumericPrice(entry.item?.price);
                        const quantity = Number(entry.quantity) || 0;
                        const imageSource = getOrderItemImage(entry.item?.imageUrl);

                        return (
                          <div
                            key={entry._id}
                            className="flex items-center justify-between gap-3 text-sm"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              {imageSource ? (
                                <img
                                  src={imageSource}
                                  alt={entry.item?.name || "Item"}
                                  className="h-12 w-12 shrink-0 rounded-xl object-cover border border-emerald-400/15"
                                />
                              ) : (
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-black/20 text-[10px] text-emerald-100/40">
                                  No image
                                </div>
                              )}

                              <span className="text-emerald-100/75 truncate">
                                {entry.item?.name || "Item"}{" "}
                                <span className="text-emerald-100/45">
                                  × {quantity}
                                </span>
                              </span>
                            </div>

                            <span className="shrink-0 font-semibold text-emerald-200">
                              ${(price * quantity).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-emerald-400/10 pt-4">
                      <span className="text-emerald-100/60 text-sm">
                        {order.paymentMethod === "cod"
                          ? "Cash on delivery"
                          : "Paid online"}
                      </span>

                      <span className="text-xl font-bold text-amber-300">
                        ${getNumericPrice(order.total).toFixed(2)}
                      </span>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrder;
