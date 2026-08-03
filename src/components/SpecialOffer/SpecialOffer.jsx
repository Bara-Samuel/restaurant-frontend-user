import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useCart } from "../../CartContext/CartContext";
import {
  FaStar,
  FaHeart,
  FaPlus,
  FaFire,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { HiMinus, HiPlus } from "react-icons/hi";
import FloatingParticle from "../FloatingParticle/FloatingParticle";
import Login from "../Login/Login";

const API_URL = `${import.meta.env.VITE_API_URL}/api/items`;

const headingAnimation = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const cardAnimation = {
  hidden: { opacity: 0, y: 45, scale: 0.96 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, delay: index * 0.1, ease: "easeOut" },
  }),
  exit: {
    opacity: 0,
    y: 25,
    scale: 0.96,
    transition: { duration: 0.25 },
  },
};

const getNumericPrice = (price) => {
  if (typeof price === "number" && Number.isFinite(price)) {
    return price;
  }

  const parsed = Number.parseFloat(
    String(price ?? "").replace(/[^0-9.-]+/g, "")
  );

  return Number.isFinite(parsed) ? parsed : 0;
};

const getImageSource = (item) => {
  const imagePath = item?.imageUrl ?? item?.image ?? item?.imageURL ?? "";

  if (!imagePath) {
    return "";
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  return `${API_URL}${imagePath}`;
};

const SpecialOffer = () => {
  const [showAll, setShowAll] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const { addToCart, updateQuantity, removeFromCart, cartItems } = useCart();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState(null);

  // Require login before adding to cart. If there's no token, remember
  // which item was being added and show the login modal instead of
  // sending a request that the backend will reject.
  const handleAddToCart = async (item) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setPendingCartItem(item);
      setShowLoginModal(true);
      return;
    }

    try {
      await addToCart(item, 1);
    } catch (error) {
      console.error(
        "Could not add item:",
        error.response?.data ?? error.message ?? error
      );
    }
  };

  // Runs after a successful login triggered by trying to add an item
  // while logged out — finishes adding whichever item was pending.
  const handleLoginSuccess = async () => {
    setShowLoginModal(false);

    if (!pendingCartItem) {
      return;
    }

    const itemToAdd = pendingCartItem;
    setPendingCartItem(null);

    try {
      await addToCart(itemToAdd, 1);
    } catch (error) {
      console.error(
        "Could not add item after login:",
        error.response?.data ?? error.message ?? error
      );
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await axios.get(API_URL);

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.items;

        if (!Array.isArray(data)) {
          throw new Error("The items API did not return an array.");
        }

        // Feature the highest rated / most loved dishes as the specials.
        const ranked = [...data].sort((a, b) => {
          const scoreA = (Number(a.rating) || 0) * 100 + (Number(a.hearts) || 0);
          const scoreB = (Number(b.rating) || 0) * 100 + (Number(b.hearts) || 0);
          return scoreB - scoreA;
        });

        setItems(ranked);
      } catch (error) {
        console.error(
          "Unable to load special offers:",
          error.response?.data ?? error.message ?? error
        );

        setLoadError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load today's specials."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const visibleItems = showAll ? items : items.slice(0, 4);

  return (
    <section
      className="relative overflow-hidden
      bg-linear-to-br from-[#120b08] via-[#21140d] to-[#063d2d]
      text-white py-20 px-4 sm:px-6 lg:px-8"
    >
      {/* Login modal — shown when adding to cart while logged out */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center
            justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setShowLoginModal(false)}
          >
            <div
              className="relative w-full max-w-md rounded-[2rem]
              border border-emerald-400/20 bg-[#100a07]/95 p-8
              shadow-2xl shadow-black/40"
              onClick={(event) => event.stopPropagation()}
            >
              <Login
                onLoginSuccess={handleLoginSuccess}
                onClose={() => setShowLoginModal(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-24
          w-[420px] h-[420px]
          bg-green-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute -bottom-40 -right-24
          w-[480px] h-[480px]
          bg-amber-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -25, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute top-1/3 left-1/2
          w-72 h-72 bg-emerald-500/5
          rounded-full blur-3xl"
          animate={{ opacity: [0.25, 0.6, 0.25], scale: [1, 1.15, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* HEADING */}
        <motion.header
          variants={headingAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-14 sm:mb-16"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.35em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-green-400 uppercase
            text-xs sm:text-sm font-semibold mb-4"
          >
            Crafted for your delight
          </motion.p>

          <h2
            className="font-[Playfair_Display] italic
            text-5xl sm:text-6xl md:text-7xl font-bold
            bg-linear-to-r from-green-200
            via-emerald-400 to-amber-300
            bg-clip-text text-transparent drop-shadow-lg"
          >
            Today&apos;s Special Offers
          </h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 112 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="h-[2px] bg-linear-to-r
            from-transparent via-green-400 to-transparent
            mx-auto my-6"
          />

          <p
            className="text-green-50/70 max-w-2xl mx-auto
            text-base sm:text-lg leading-relaxed"
          >
            Savor our culinary masterpieces, thoughtfully prepared
            to bring together bold flavors, tradition, and elegance.
          </p>
        </motion.header>

        {/* LOADING / ERROR */}
        {isLoading && (
          <div className="py-16 text-center text-lg text-green-200">
            Loading today&apos;s specials...
          </div>
        )}

        {!isLoading && loadError && (
          <div
            className="mx-auto max-w-xl rounded-2xl border
            border-red-400/20 bg-red-500/10
            px-6 py-5 text-center text-red-200"
          >
            {loadError}
          </div>
        )}

        {!isLoading && !loadError && visibleItems.length === 0 && (
          <div className="py-16 text-center text-lg text-green-100/70">
            No special offers are available right now.
          </div>
        )}

        {/* PRODUCT CARDS */}
        {!isLoading && !loadError && visibleItems.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2
            lg:grid-cols-4 gap-7 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item, index) => {
                const cartItem = cartItems.find(
                  (cartEntry) => String(cartEntry.itemId) === String(item._id)
                );

                const quantity = Number(cartItem?.quantity) || 0;
                const price = getNumericPrice(item.price);
                const imageSource = getImageSource(item);

                return (
                  <motion.article
                    layout
                    custom={index}
                    variants={cardAnimation}
                    initial="hidden"
                    whileInView="visible"
                    exit="exit"
                    viewport={{ once: true, amount: 0.15 }}
                    whileHover={{ y: -12, scale: 1.015 }}
                    key={item._id}
                    className="group relative overflow-hidden
                    rounded-[2rem] border border-green-400/15
                    bg-white/5 backdrop-blur-sm
                    shadow-2xl shadow-black/30
                    transition-colors duration-500
                    hover:border-green-400/40
                    hover:bg-green-950/25
                    hover:shadow-green-950/50"
                  >
                    {/* IMAGE */}
                    <div className="relative h-72 overflow-hidden">
                      {imageSource ? (
                        <motion.img
                          src={imageSource}
                          alt={item.name}
                          className="w-full h-full object-cover brightness-90"
                          whileHover={{ scale: 1.1, filter: "brightness(1.05)" }}
                          transition={{ duration: 0.65, ease: "easeOut" }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black/20 text-green-100/50">
                          No image available
                        </div>
                      )}

                      <div
                        className="absolute inset-0
                        bg-linear-to-t from-[#120b08]
                        via-black/15 to-transparent"
                      />

                      {/* RATINGS */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <motion.div
                          whileHover={{ scale: 1.08 }}
                          className="flex items-center gap-2
                          px-3 py-1.5 rounded-full
                          bg-black/45 backdrop-blur-md
                          border border-white/10"
                        >
                          <FaStar className="text-amber-400" />
                          <span className="text-sm font-bold text-white">
                            {item.rating ?? 4.8}
                          </span>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.08 }}
                          className="flex items-center gap-2
                          px-3 py-1.5 rounded-full
                          bg-black/45 backdrop-blur-md
                          border border-white/10"
                        >
                          <motion.div whileHover={{ scale: 1.25 }}>
                            <FaHeart className="text-red-400" />
                          </motion.div>

                          <span className="text-sm font-bold text-white">
                            {item.hearts ?? 120}
                          </span>
                        </motion.div>
                      </div>

                      {/* CATEGORY */}
                      {item.category && (
                        <motion.span
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.25 + index * 0.05 }}
                          className="absolute bottom-4 left-4
                          px-3 py-1 rounded-full
                          bg-green-500/90 text-[#120b08]
                          text-xs font-bold uppercase tracking-wider"
                        >
                          {item.category}
                        </motion.span>
                      )}
                    </div>

                    {/* CARD CONTENT */}
                    <div className="relative p-6">
                      <h3
                        className="text-2xl font-bold mb-3
                        font-[Playfair_Display] italic
                        bg-linear-to-r from-green-200 to-amber-300
                        bg-clip-text text-transparent"
                      >
                        {item.name}
                      </h3>

                      <p
                        className="text-green-50/65 mb-6
                        text-sm leading-relaxed min-h-[66px]"
                      >
                        {item.description ||
                          "A delicious Nigerian favorite prepared with authentic spices and rich traditional flavor."}
                      </p>

                      <div className="flex items-center justify-between gap-4">
                        <motion.span
                          whileHover={{ scale: 1.06 }}
                          className="text-2xl font-bold
                          text-green-300 font-cinzel"
                        >
                          ${price.toFixed(2)}
                        </motion.span>

                        <AnimatePresence mode="wait">
                          {cartItem ? (
                            <motion.div
                              key="quantity-controls"
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              className="flex items-center gap-2
                              rounded-full bg-black/30 p-1.5
                              border border-green-400/20"
                            >
                              <motion.button
                                type="button"
                                aria-label={`Decrease ${item.name} quantity`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.88 }}
                                onClick={() => {
                                  if (quantity > 1) {
                                    updateQuantity(
                                      cartItem.cartEntryId,
                                      quantity - 1
                                    );
                                  } else {
                                    removeFromCart(cartItem.cartEntryId);
                                  }
                                }}
                                className="w-9 h-9 rounded-full
                                bg-green-900/50 flex items-center
                                justify-center text-green-100
                                hover:bg-green-700"
                              >
                                <HiMinus className="w-4 h-4" />
                              </motion.button>

                              <motion.span
                                key={quantity}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="min-w-8 text-center
                                text-green-100 font-bold"
                              >
                                {quantity}
                              </motion.span>

                              <motion.button
                                type="button"
                                aria-label={`Increase ${item.name} quantity`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.88 }}
                                onClick={() =>
                                  updateQuantity(
                                    cartItem.cartEntryId,
                                    quantity + 1
                                  )
                                }
                                className="w-9 h-9 rounded-full
                                bg-green-900/50 flex items-center
                                justify-center text-green-100
                                hover:bg-green-700"
                              >
                                <HiPlus className="w-4 h-4" />
                              </motion.button>
                            </motion.div>
                          ) : (
                            <motion.button
                              key="add-button"
                              type="button"
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              whileHover={{ y: -3, scale: 1.04 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => handleAddToCart(item)}
                              className="group/add relative overflow-hidden
                              inline-flex items-center justify-center gap-2
                              rounded-full px-5 py-2.5
                              bg-linear-to-r from-green-400
                              to-emerald-500 text-[#120b08]
                              font-bold shadow-lg shadow-green-950/30
                              hover:shadow-green-500/20"
                            >
                              <span
                                className="absolute inset-0
                                bg-linear-to-r from-white/25
                                via-transparent to-transparent
                                -translate-x-full
                                group-hover/add:translate-x-full
                                transition-transform duration-700"
                              />

                              <motion.span
                                className="relative z-10"
                                whileHover={{ rotate: 90 }}
                              >
                                <FaPlus className="text-sm" />
                              </motion.span>

                              <span className="relative z-10">Add</span>
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div
                      className="opacity-0 group-hover:opacity-100
                      transition-opacity duration-500"
                    >
                      <FloatingParticle />
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* SHOW MORE BUTTON */}
        {!isLoading && !loadError && items.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-14 flex justify-center"
          >
            <motion.button
              type="button"
              onClick={() => setShowAll((previous) => !previous)}
              whileHover={{ y: -4, scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              className="group relative inline-flex
              items-center gap-3 overflow-hidden
              rounded-full px-8 py-4
              bg-linear-to-r from-[#744212]
              via-green-700 to-emerald-700
              text-white font-bold uppercase
              tracking-widest border border-green-300/30
              shadow-xl shadow-black/25
              hover:shadow-green-500/20"
            >
              <span
                className="absolute inset-0
                bg-linear-to-r from-white/15
                via-transparent to-white/5
                -translate-x-full
                group-hover:translate-x-full
                transition-transform duration-700"
              />

              <motion.span
                className="relative z-10"
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1 }}
              >
                <FaFire className="text-xl text-amber-300" />
              </motion.span>

              <span className="relative z-10">
                {showAll ? "Show Less" : "Show More"}
              </span>

              <motion.span
                className="relative z-10"
                animate={{ y: showAll ? [0, -3, 0] : [0, 3, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                {showAll ? <FaChevronUp /> : <FaChevronDown />}
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SpecialOffer;
