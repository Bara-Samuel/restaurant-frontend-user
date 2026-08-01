import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useCart } from "../../CartContext/CartContext";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import {
  FaMinus,
  FaPlus,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./OurHomeMenu.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api/items`;

const categories = [
  { label: "Soups", key: "soups" },
  { label: "Rice", key: "rice" },
  { label: "Swallow", key: "swallow" },
  { label: "Grills", key: "grills" },
  { label: "Pastries", key: "pastries" },
  { label: "Drinks", key: "drinks" },
];

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.96,
  },

  visible: (index) => ({
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.55,
      delay: index * 0.1,
      ease: "easeOut",
    },
  }),

  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,

    transition: {
      duration: 0.2,
    },
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

const OurHomeMenu = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].key);
  const [menuItemsByCategory, setMenuItemsByCategory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [menuError, setMenuError] = useState("");

  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated, requireLogin } = useRequireAuth();

  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      setMenuError("");

      try {
        const response = await axios.get(`${API_URL}/api/items`);

        const items = Array.isArray(response.data)
          ? response.data
          : response.data?.items;

        if (!Array.isArray(items)) {
          throw new Error("The items API did not return an array.");
        }

        const grouped = items.reduce((groups, item) => {
          const category = String(item.category ?? "").trim().toLowerCase();

          if (!category) {
            return groups;
          }

          if (!groups[category]) {
            groups[category] = [];
          }

          groups[category].push(item);

          return groups;
        }, {});

        setMenuItemsByCategory(grouped);
      } catch (error) {
        console.error(
          "Unable to load menu items:",
          error.response?.data ?? error.message ?? error
        );

        setMenuError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load the menu."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const displayItems = (menuItemsByCategory[activeCategory] || []).slice(0, 4);

  const getCartEntry = (menuItemId) => {
    return cartItems.find(
      (cartEntry) => String(cartEntry.itemId) === String(menuItemId)
    );
  };

  const getQuantity = (menuItemId) => {
    return Math.max(0, Number(getCartEntry(menuItemId)?.quantity) || 0);
  };

  const handleAddToCart = (item) => {
    if (!isAuthenticated) {
      requireLogin();
      return;
    }

    addToCart(item, 1);
  };

  const handleIncreaseQuantity = (item, quantity) => {
    const cartEntry = getCartEntry(item._id);

    if (!cartEntry) {
      return;
    }

    updateQuantity(cartEntry.cartEntryId, quantity + 1);
  };

  const handleDecreaseQuantity = (item, quantity) => {
    const cartEntry = getCartEntry(item._id);

    if (!cartEntry) {
      return;
    }

    if (quantity > 1) {
      updateQuantity(cartEntry.cartEntryId, quantity - 1);
    } else {
      removeFromCart(cartEntry.cartEntryId);
    }
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden
      bg-linear-to-br from-[#120c08] via-[#1f1710] to-[#073b2c]
      py-20 px-4 sm:px-6 lg:px-8 text-white"
    >
      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-24
          w-96 h-96 bg-green-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 25, 0],
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
          className="absolute bottom-0 -right-24
          w-[420px] h-[420px]
          bg-amber-500/10 rounded-full blur-3xl"
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

      <div className="relative max-w-7xl mx-auto">
        {/* HEADING */}
        <motion.header
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
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
            Taste the experience
          </motion.p>

          <h2
            className="font-dancingscript text-5xl sm:text-6xl
            md:text-7xl font-bold
            bg-linear-to-r from-green-200
            via-emerald-400 to-amber-300
            bg-clip-text text-transparent drop-shadow-lg"
          >
            Our Exquisite Menu
          </h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="h-[2px] bg-linear-to-r
            from-transparent via-green-400 to-transparent
            mx-auto my-5"
          />

          <p
            className="text-green-100/75 text-lg sm:text-xl
            md:text-2xl font-cinzel italic tracking-wide"
          >
            A symphony of flavors, crafted with elegance
          </p>
        </motion.header>

        {/* CATEGORY BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center
          gap-3 sm:gap-4 mb-16"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category.key;

            return (
              <motion.button
                type="button"
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                whileHover={{ y: -3, scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                className={`relative overflow-hidden px-5 sm:px-7
                py-2.5 rounded-full border font-cinzel
                text-sm sm:text-base tracking-widest
                transition-colors duration-300
                ${
                  isActive
                    ? `bg-linear-to-r from-green-400 to-emerald-600
                       text-[#120c08] border-green-300
                       shadow-lg shadow-green-500/20`
                    : `bg-white/5 text-green-100/80
                       border-green-500/20
                       hover:bg-green-900/30
                       hover:border-green-400/50
                       hover:text-green-200`
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-category-background"
                    className="absolute inset-0
                    bg-linear-to-r from-white/10
                    via-transparent to-white/5"
                  />
                )}

                <span className="relative z-10">{category.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* LOADING / ERROR */}
        {isLoading && (
          <div className="py-16 text-center text-lg text-emerald-200">
            Loading menu...
          </div>
        )}

        {!isLoading && menuError && (
          <div
            className="mx-auto max-w-xl rounded-2xl border
            border-red-400/20 bg-red-500/10
            px-6 py-5 text-center text-red-200"
          >
            {menuError}
          </div>
        )}

        {!isLoading && !menuError && displayItems.length === 0 && (
          <div className="py-16 text-center text-lg text-emerald-100/70">
            No items are available in this category.
          </div>
        )}

        {/* MENU CARDS */}
        {!isLoading && !menuError && displayItems.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-1 gap-8
            sm:grid-cols-2 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {displayItems.map((item, index) => {
                const itemId = item._id;
                const quantity = getQuantity(itemId);
                const price = getNumericPrice(item.price);
                const imageSource = getImageSource(item);

                return (
                  <motion.article
                    layout
                    key={itemId}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{ y: -12, scale: 1.015 }}
                    className="group relative overflow-hidden
                    rounded-[2rem] border border-emerald-400/15
                    bg-white/5 backdrop-blur-sm
                    shadow-2xl shadow-black/25
                    transition-colors duration-500
                    hover:border-emerald-400/45
                    hover:bg-emerald-950/25
                    hover:shadow-emerald-950/50"
                  >
                    {/* IMAGE */}
                    <div className="relative h-56 sm:h-64 overflow-hidden bg-black/10">
                      {imageSource ? (
                        <motion.img
                          src={imageSource}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1, filter: "brightness(1.05)" }}
                          transition={{ duration: 0.65, ease: "easeOut" }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-black/20 text-emerald-100/50">
                          No image available
                        </div>
                      )}

                      <div
                        className="absolute inset-0
                        bg-linear-to-t from-[#120c08]
                        via-black/10 to-transparent"
                      />

                      {/* RATING */}
                      <motion.div
                        whileHover={{ scale: 1.06 }}
                        className="absolute top-4 right-4
                        flex items-center gap-2
                        rounded-full border border-white/10
                        bg-black/45 backdrop-blur-md
                        px-3 py-1.5"
                      >
                        <FaStar className="text-amber-400" />
                        <span className="text-sm font-bold text-white">
                          {item.rating ?? 4.8}
                        </span>
                      </motion.div>

                      {/* CATEGORY */}
                      <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.06 }}
                        className="absolute bottom-4 left-4
                        rounded-full bg-emerald-400/90
                        px-3 py-1 text-xs font-bold
                        uppercase tracking-wider text-[#120c08]"
                      >
                        {item.category || activeCategory}
                      </motion.span>
                    </div>

                    {/* CONTENT */}
                    <div className="relative flex h-full flex-col p-6">
                      <div
                        className="absolute top-0 left-1/2
                        h-[2px] w-20 -translate-x-1/2
                        bg-linear-to-r from-transparent
                        via-emerald-400/50 to-transparent"
                      />

                      <h3
                        className="mb-3 text-2xl font-bold
                        font-dancingscript
                        bg-linear-to-r from-emerald-200
                        to-amber-300 bg-clip-text
                        text-transparent"
                      >
                        {item.name}
                      </h3>

                      <p
                        className="mb-6 min-h-[72px]
                        text-sm leading-relaxed
                        text-emerald-100/65"
                      >
                        {item.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-4">
                        {/* PRICE */}
                        <motion.span
                          whileHover={{ scale: 1.07 }}
                          className="font-cinzel text-xl
                          font-bold text-emerald-300"
                        >
                          ${price.toFixed(2)}
                        </motion.span>

                        {/* CART CONTROLS */}
                        <AnimatePresence mode="wait">
                          {quantity > 0 ? (
                            <motion.div
                              key="quantity"
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              className="flex items-center gap-2
                              rounded-full border
                              border-emerald-400/20
                              bg-black/25 p-1.5"
                            >
                              <motion.button
                                type="button"
                                aria-label={`Decrease ${item.name} quantity`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.88 }}
                                onClick={() =>
                                  handleDecreaseQuantity(item, quantity)
                                }
                                className="flex h-9 w-9
                                items-center justify-center
                                rounded-full bg-emerald-900/50
                                text-emerald-100
                                hover:bg-emerald-700"
                              >
                                <FaMinus className="text-xs" />
                              </motion.button>

                              <motion.span
                                key={quantity}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="min-w-7 text-center
                                font-bold text-emerald-100"
                              >
                                {quantity}
                              </motion.span>

                              <motion.button
                                type="button"
                                aria-label={`Increase ${item.name} quantity`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.88 }}
                                onClick={() =>
                                  handleIncreaseQuantity(item, quantity)
                                }
                                className="flex h-9 w-9
                                items-center justify-center
                                rounded-full bg-emerald-900/50
                                text-emerald-100
                                hover:bg-emerald-700"
                              >
                                <FaPlus className="text-xs" />
                              </motion.button>
                            </motion.div>
                          ) : (
                            <motion.button
                              key="add"
                              type="button"
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              whileHover={{ y: -3, scale: 1.04 }}
                              whileTap={{ scale: 0.92 }}
                              onClick={() => handleAddToCart(item)}
                              className="group/add relative
                              overflow-hidden rounded-full
                              bg-linear-to-r from-emerald-400
                              to-green-600 px-5 py-2.5
                              text-xs font-bold uppercase
                              tracking-wider text-[#120c08]
                              shadow-lg shadow-emerald-950/30"
                            >
                              <span
                                className="absolute inset-0
                                -translate-x-full
                                bg-linear-to-r from-white/25
                                via-transparent to-transparent
                                transition-transform duration-700
                                group-hover/add:translate-x-full"
                              />

                              <span className="relative z-10">Add to Cart</span>
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* FULL MENU LINK */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-16 flex justify-center"
        >
          <motion.div whileHover={{ y: -4, scale: 1.04 }} whileTap={{ scale: 0.94 }}>
            <Link
              to="/menu"
              className="group relative inline-flex
              items-center gap-3 overflow-hidden
              rounded-full border border-emerald-300/30
              bg-linear-to-r from-[#744212]
              via-emerald-700 to-green-700
              px-8 py-4 font-bold uppercase
              tracking-widest text-white
              shadow-xl shadow-black/25"
            >
              <span
                className="absolute inset-0
                -translate-x-full
                bg-linear-to-r from-white/15
                via-transparent to-white/5
                transition-transform duration-700
                group-hover:translate-x-full"
              />

              <span className="relative z-10">Explore Full Menu</span>

              <FaArrowRight
                className="relative z-10
                transition-transform duration-300
                group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurHomeMenu;
