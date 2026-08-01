import { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

import {
  FaMinus,
  FaPlus,
  FaStar,
  FaShoppingBag,
} from "react-icons/fa";

import { useCart } from "../../CartContext/CartContext";
import "./OurMenu.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api/items`;

const categories = [
  { label: "Soups", key: "soups" },
  { label: "Rice", key: "rice" },
  { label: "Swallow", key: "swallows" },
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
      duration: 0.5,
      delay: index * 0.08,
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
  if (
    typeof price === "number" &&
    Number.isFinite(price)
  ) {
    return price;
  }

  const parsedPrice = Number.parseFloat(
    String(price ?? "").replace(/[^0-9.-]+/g, "")
  );

  return Number.isFinite(parsedPrice)
    ? parsedPrice
    : 0;
};

const getImageSource = (item) => {
  const imagePath =
    item?.imageUrl ??
    item?.image ??
    item?.imageURL ??
    "";

  if (!imagePath) {
    return "";
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  return `${API_URL}${imagePath}`;
};

const OurMenu = () => {
  const [activeCategory, setActiveCategory] =
    useState(categories[0].key);

  const [
    menuItemsByCategory,
    setMenuItemsByCategory,
  ] = useState({});

  const [isLoading, setIsLoading] =
    useState(true);

  const [menuError, setMenuError] =
    useState("");

  const [updatingItemId, setUpdatingItemId] =
    useState(null);

  const {
    cartItems = [],
    addToCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      setMenuError("");

      try {
        const response = await axios.get(
          `${API_URL}/api/items`
        );

        const items = Array.isArray(response.data)
          ? response.data
          : response.data?.items;

        if (!Array.isArray(items)) {
          throw new Error(
            "The items API did not return an array."
          );
        }

        const groupedItems = items.reduce(
          (groups, item) => {
            const category = String(
              item.category ?? ""
            )
              .trim()
              .toLowerCase();

            if (!category) {
              return groups;
            }

            if (!groups[category]) {
              groups[category] = [];
            }

            groups[category].push(item);

            return groups;
          },
          {}
        );

        setMenuItemsByCategory(groupedItems);
      } catch (error) {
        console.error(
          "Unable to load menu items:",
          error.response?.data ??
            error.message ??
            error
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

  /*
   * Supports cart entries such as:
   *
   * {
   *   cartEntryId: "cart-item-doc-id",
   *   itemId: "menu-item-id",
   *   quantity: 2
   * }
   */
  const getCartEntry = (menuItemId) => {
    return cartItems.find(
      (cartEntry) =>
        String(cartEntry.itemId) ===
        String(menuItemId)
    );
  };

  const getQuantity = (menuItemId) => {
    const cartEntry =
      getCartEntry(menuItemId);

    return Math.max(
      0,
      Number(cartEntry?.quantity) || 0
    );
  };

  const handleAddToCart = async (item) => {
    if (
      !item?._id ||
      updatingItemId === item._id
    ) {
      return;
    }

    setUpdatingItemId(item._id);

    try {
      await addToCart(item, 1);
    } catch (error) {
      console.error(
        "Could not add item:",
        error.response?.data ??
          error.message ??
          error
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleIncreaseQuantity = async (
    item,
    quantity
  ) => {
    if (
      !item?._id ||
      updatingItemId === item._id
    ) {
      return;
    }

    // Updates must reference the cart *entry*, not the menu item.
    const cartEntry = getCartEntry(item._id);

    if (!cartEntry) {
      return;
    }

    setUpdatingItemId(item._id);

    try {
      await updateQuantity(
        cartEntry.cartEntryId,
        quantity + 1
      );
    } catch (error) {
      console.error(
        "Could not increase quantity:",
        error.response?.data ??
          error.message ??
          error
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDecreaseQuantity = async (
    item,
    quantity
  ) => {
    if (
      !item?._id ||
      updatingItemId === item._id
    ) {
      return;
    }

    // Updates/removals must reference the cart *entry*, not the menu item.
    const cartEntry = getCartEntry(item._id);

    if (!cartEntry) {
      return;
    }

    setUpdatingItemId(item._id);

    try {
      if (quantity > 1) {
        await updateQuantity(
          cartEntry.cartEntryId,
          quantity - 1
        );
      } else {
        await removeFromCart(cartEntry.cartEntryId);
      }
    } catch (error) {
      console.error(
        "Could not decrease quantity:",
        error.response?.data ??
          error.message ??
          error
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  const displayItems =
    menuItemsByCategory[activeCategory] ?? [];

  return (
    <main
      className="relative min-h-screen overflow-hidden
      bg-linear-to-br from-[#120c08] via-[#1f1710] to-[#073b2c]
      px-4 py-20 text-white sm:px-6 lg:px-8"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-24 -top-32
          h-96 w-96 rounded-full
          bg-green-500/10 blur-3xl"
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
          className="absolute -right-24 bottom-0
          h-[420px] w-[420px]
          rounded-full bg-amber-500/10
          blur-3xl"
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

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <motion.header
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="mb-14 text-center sm:mb-16"
        >
          <motion.p
            initial={{
              opacity: 0,
              letterSpacing: "0.1em",
            }}
            animate={{
              opacity: 1,
              letterSpacing: "0.35em",
            }}
            transition={{
              duration: 0.8,
            }}
            className="mb-4 text-xs font-semibold
            uppercase text-green-400 sm:text-sm"
          >
            Taste the experience
          </motion.p>

          <h1
            className="bg-linear-to-r from-green-200
            via-emerald-400 to-amber-300
            bg-clip-text font-dancingscript
            text-5xl font-bold text-transparent
            drop-shadow-lg sm:text-6xl md:text-7xl"
          >
            Our Exquisite Menu
          </h1>

          <motion.div
            initial={{
              width: 0,
            }}
            animate={{
              width: 96,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="mx-auto my-5 h-[2px]
            bg-linear-to-r from-transparent
            via-green-400 to-transparent"
          />

          <p
            className="font-cinzel text-lg italic
            tracking-wide text-green-100/75
            sm:text-xl md:text-2xl"
          >
            A symphony of flavors, crafted with elegance
          </p>
        </motion.header>

        {/* Categories */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            delay: 0.2,
          }}
          className="mb-16 flex flex-wrap
          justify-center gap-3 sm:gap-4"
        >
          {categories.map((category) => {
            const isActive =
              activeCategory === category.key;

            return (
              <motion.button
                type="button"
                key={category.key}
                onClick={() =>
                  setActiveCategory(category.key)
                }
                whileHover={{
                  y: -3,
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.94,
                }}
                className={`relative overflow-hidden
                rounded-full border px-5 py-2.5
                font-cinzel text-sm tracking-widest
                transition-colors duration-300
                sm:px-7 sm:text-base ${
                  isActive
                    ? `border-green-300
                       bg-linear-to-r from-green-400
                       to-emerald-600 text-[#120c08]
                       shadow-lg shadow-green-500/20`
                    : `border-green-500/20 bg-white/5
                       text-green-100/80
                       hover:border-green-400/50
                       hover:bg-green-900/30
                       hover:text-green-200`
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="our-menu-active-category"
                    className="absolute inset-0
                    bg-linear-to-r from-white/10
                    via-transparent to-white/5"
                  />
                )}

                <span className="relative z-10">
                  {category.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="py-16 text-center">
            <p className="text-lg text-emerald-200">
              Loading menu...
            </p>
          </div>
        )}

        {/* API error */}
        {!isLoading && menuError && (
          <div
            className="mx-auto max-w-xl
            rounded-2xl border
            border-red-400/20 bg-red-500/10
            px-6 py-5 text-center text-red-200"
          >
            {menuError}
          </div>
        )}

        {/* Empty category */}
        {!isLoading &&
          !menuError &&
          displayItems.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg text-emerald-100/70">
                No items are available in this category.
              </p>
            </div>
          )}

        {/* Menu items */}
        {!isLoading && !menuError && (
          <motion.div
            layout
            className="grid grid-cols-1 gap-8
            sm:grid-cols-2 lg:grid-cols-3
            xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {displayItems.map(
                (item, index) => {
                  const itemId = item._id;

                  const quantity =
                    getQuantity(itemId);

                  const unitPrice =
                    getNumericPrice(item.price);

                  const displayedPrice =
                    quantity > 0
                      ? unitPrice * quantity
                      : unitPrice;

                  const isUpdating =
                    updatingItemId === itemId;

                  const imageSource =
                    getImageSource(item);

                  return (
                    <motion.article
                      layout
                      key={itemId}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileHover={{
                        y: -12,
                        scale: 1.015,
                      }}
                      className="group relative
                      overflow-hidden rounded-[2rem]
                      border border-emerald-400/15
                      bg-white/5 shadow-2xl
                      shadow-black/25 backdrop-blur-sm
                      transition-colors duration-500
                      hover:border-emerald-400/45
                      hover:bg-emerald-950/25
                      hover:shadow-emerald-950/50"
                    >
                      {/* Image */}
                      <div
                        className="relative h-64
                        overflow-hidden bg-black/10"
                      >
                        {imageSource ? (
                          <motion.img
                            src={imageSource}
                            alt={
                              item.name ||
                              "Menu item"
                            }
                            className="h-full w-full
                            object-cover"
                            whileHover={{
                              scale: 1.1,
                              filter:
                                "brightness(1.06)",
                            }}
                            transition={{
                              duration: 0.65,
                              ease: "easeOut",
                            }}
                          />
                        ) : (
                          <div
                            className="flex h-full w-full
                            items-center justify-center
                            bg-black/20
                            text-emerald-100/50"
                          >
                            No image available
                          </div>
                        )}

                        <div
                          className="absolute inset-0
                          bg-linear-to-t
                          from-[#120c08]
                          via-black/10
                          to-transparent"
                        />

                        <motion.div
                          whileHover={{
                            scale: 1.07,
                          }}
                          className="absolute right-4
                          top-4 flex items-center
                          gap-2 rounded-full border
                          border-white/10 bg-black/45
                          px-3 py-1.5
                          backdrop-blur-md"
                        >
                          <FaStar className="text-amber-400" />

                          <span
                            className="text-sm
                            font-bold text-white"
                          >
                            {item.rating ?? 4.8}
                          </span>
                        </motion.div>

                        <span
                          className="absolute bottom-4
                          left-4 rounded-full
                          bg-emerald-400/90
                          px-3 py-1 text-xs
                          font-bold uppercase
                          tracking-wider text-[#120c08]"
                        >
                          {item.category ??
                            activeCategory}
                        </span>
                      </div>

                      {/* Details */}
                      <div
                        className="relative flex
                        flex-col p-6"
                      >
                        <div
                          className="absolute left-1/2
                          top-0 h-[2px] w-20
                          -translate-x-1/2
                          bg-linear-to-r
                          from-transparent
                          via-emerald-400/50
                          to-transparent"
                        />

                        <h2
                          className="mb-3
                          bg-linear-to-r
                          from-emerald-200
                          to-amber-300
                          bg-clip-text
                          font-dancingscript
                          text-2xl font-bold
                          text-transparent"
                        >
                          {item.name}
                        </h2>

                        <p
                          className="mb-6
                          min-h-[72px]
                          text-sm leading-relaxed
                          text-emerald-100/65"
                        >
                          {item.description}
                        </p>

                        <div
                          className="mt-auto flex
                          items-center justify-between
                          gap-4"
                        >
                          <div>
                            <motion.span
                              key={displayedPrice}
                              initial={{
                                opacity: 0.6,
                                y: -3,
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                              }}
                              whileHover={{
                                scale: 1.07,
                              }}
                              className="block
                              font-cinzel text-xl
                              font-bold
                              text-emerald-300"
                            >
                              $
                              {displayedPrice.toFixed(
                                2
                              )}
                            </motion.span>

                            {quantity > 1 && (
                              <span
                                className="mt-1
                                block text-xs
                                text-emerald-100/50"
                              >
                                $
                                {unitPrice.toFixed(
                                  2
                                )}{" "}
                                × {quantity}
                              </span>
                            )}
                          </div>

                          <AnimatePresence mode="wait">
                            {quantity > 0 ? (
                              <motion.div
                                key="quantity-controls"
                                initial={{
                                  opacity: 0,
                                  scale: 0.85,
                                }}
                                animate={{
                                  opacity: 1,
                                  scale: 1,
                                }}
                                exit={{
                                  opacity: 0,
                                  scale: 0.85,
                                }}
                                className="flex
                                items-center gap-2
                                rounded-full border
                                border-emerald-400/20
                                bg-black/25 p-1.5"
                              >
                                <motion.button
                                  type="button"
                                  aria-label={`Decrease ${item.name} quantity`}
                                  whileHover={
                                    isUpdating
                                      ? {}
                                      : {
                                          scale: 1.1,
                                        }
                                  }
                                  whileTap={
                                    isUpdating
                                      ? {}
                                      : {
                                          scale: 0.88,
                                        }
                                  }
                                  onClick={() =>
                                    handleDecreaseQuantity(
                                      item,
                                      quantity
                                    )
                                  }
                                  disabled={
                                    isUpdating
                                  }
                                  className="flex h-9
                                  w-9 items-center
                                  justify-center
                                  rounded-full
                                  bg-emerald-900/50
                                  text-emerald-100
                                  hover:bg-emerald-700
                                  disabled:cursor-not-allowed
                                  disabled:opacity-50"
                                >
                                  <FaMinus className="text-xs" />
                                </motion.button>

                                <motion.span
                                  key={quantity}
                                  initial={{
                                    opacity: 0,
                                    y: -5,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    y: 0,
                                  }}
                                  className="min-w-7
                                  text-center font-bold
                                  text-emerald-100"
                                >
                                  {quantity}
                                </motion.span>

                                <motion.button
                                  type="button"
                                  aria-label={`Increase ${item.name} quantity`}
                                  whileHover={
                                    isUpdating
                                      ? {}
                                      : {
                                          scale: 1.1,
                                        }
                                  }
                                  whileTap={
                                    isUpdating
                                      ? {}
                                      : {
                                          scale: 0.88,
                                        }
                                  }
                                  onClick={() =>
                                    handleIncreaseQuantity(
                                      item,
                                      quantity
                                    )
                                  }
                                  disabled={
                                    isUpdating
                                  }
                                  className="flex h-9
                                  w-9 items-center
                                  justify-center
                                  rounded-full
                                  bg-emerald-900/50
                                  text-emerald-100
                                  hover:bg-emerald-700
                                  disabled:cursor-not-allowed
                                  disabled:opacity-50"
                                >
                                  <FaPlus className="text-xs" />
                                </motion.button>
                              </motion.div>
                            ) : (
                              <motion.button
                                key="add-button"
                                type="button"
                                initial={{
                                  opacity: 0,
                                  scale: 0.85,
                                }}
                                animate={{
                                  opacity: 1,
                                  scale: 1,
                                }}
                                exit={{
                                  opacity: 0,
                                  scale: 0.85,
                                }}
                                whileHover={
                                  isUpdating
                                    ? {}
                                    : {
                                        y: -3,
                                        scale: 1.04,
                                      }
                                }
                                whileTap={
                                  isUpdating
                                    ? {}
                                    : {
                                        scale: 0.92,
                                      }
                                }
                                onClick={() =>
                                  handleAddToCart(
                                    item
                                  )
                                }
                                disabled={
                                  isUpdating
                                }
                                className="group/add
                                relative inline-flex
                                items-center gap-2
                                overflow-hidden
                                rounded-full
                                bg-linear-to-r
                                from-emerald-400
                                to-green-600 px-5
                                py-2.5 text-xs
                                font-bold uppercase
                                tracking-wider
                                text-[#120c08]
                                shadow-lg
                                shadow-emerald-950/30
                                disabled:cursor-not-allowed
                                disabled:opacity-60"
                              >
                                <span
                                  className="absolute
                                  inset-0
                                  -translate-x-full
                                  bg-linear-to-r
                                  from-white/25
                                  via-transparent
                                  to-transparent
                                  transition-transform
                                  duration-700
                                  group-hover/add:translate-x-full"
                                />

                                <FaShoppingBag className="relative z-10" />

                                <span className="relative z-10">
                                  {isUpdating
                                    ? "Adding..."
                                    : "Add"}
                                </span>
                              </motion.button>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.article>
                  );
                }
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  );
};

export default OurMenu;
