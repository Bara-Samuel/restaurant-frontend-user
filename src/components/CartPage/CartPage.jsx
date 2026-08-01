import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../../CartContext/CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaMinus,
  FaPlus,
  FaTimes,
  FaTrash,
  FaShoppingBag,
  FaArrowLeft,
  FaLock,
} from "react-icons/fa";

const getNumericPrice = (price) => {
  if (typeof price === "number" && Number.isFinite(price)) {
    return price;
  }

  const parsedPrice = parseFloat(
    String(price ?? "").replace(/[^0-9.-]+/g, "")
  );

  return Number.isNaN(parsedPrice) ? 0 : parsedPrice;
};

const cartItemVariants = {
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
    x: -60,
    scale: 0.94,
    transition: {
      duration: 0.25,
    },
  },
};

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  const totalQuantity = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  const handleCheckout = () => {
    navigate("/checkout");
  };

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

      <div className="relative max-w-7xl mx-auto">
        {/* HEADING */}
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
          className="text-center mb-14"
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
            className="text-emerald-400 uppercase
            text-xs sm:text-sm font-semibold mb-4"
          >
            Your selected favorites
          </motion.p>

          <h1
            className="font-dancingscript text-5xl sm:text-6xl
            md:text-7xl font-bold
            bg-linear-to-r from-emerald-200
            via-green-400 to-amber-300
            bg-clip-text text-transparent drop-shadow-lg"
          >
            Your Cart
          </h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="h-[2px] mx-auto mt-6
            bg-linear-to-r from-transparent
            via-emerald-400 to-transparent"
          />
        </motion.header>

        {cartItems.length === 0 ? (
          /* EMPTY CART */
          <motion.section
            initial={{
              opacity: 0,
              y: 35,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.6,
            }}
            className="max-w-xl mx-auto text-center
            rounded-[2rem] border border-emerald-400/20
            bg-white/5 backdrop-blur-xl p-10
            shadow-2xl shadow-black/25"
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-20 h-20 mx-auto mb-6 rounded-full
              bg-emerald-900/40 border border-emerald-400/20
              flex items-center justify-center"
            >
              <FaShoppingBag className="text-3xl text-emerald-400" />
            </motion.div>

            <h2 className="text-2xl font-bold text-emerald-100 mb-3">
              Your cart is waiting
            </h2>

            <p className="text-emerald-100/65 text-lg mb-7">
              Add your favorite Nigerian meals and begin your Maison EKO
              dining experience.
            </p>

            <motion.div
              whileHover={{
                y: -3,
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.94,
              }}
            >
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
          </motion.section>
        ) : (
          <div
            className="grid grid-cols-1
            lg:grid-cols-[1fr_360px] gap-10"
          >
            {/* CART ITEMS */}
            <motion.section layout className="space-y-5">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item, index) => {
                  const price = getNumericPrice(item.price);
                  const quantity = Number(item.quantity) || 1;
                  const itemTotal = price * quantity;

                  return (
                    <motion.article
                      layout
                      custom={index}
                      variants={cartItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      key={item.cartEntryId}
                      whileHover={{
                        y: -4,
                      }}
                      className="group grid grid-cols-1
                      sm:grid-cols-[150px_1fr] gap-5
                      rounded-[2rem]
                      border border-emerald-400/15
                      bg-white/5 backdrop-blur-xl p-5
                      shadow-xl shadow-black/20
                      transition-colors duration-300
                      hover:border-emerald-400/40
                      hover:bg-emerald-950/20"
                    >
                      {/* IMAGE */}
                      <motion.button
                        type="button"
                        whileHover={{
                          scale: 1.02,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        onClick={() => setSelectedImage(item.image)}
                        className="relative h-44 sm:h-full
                        min-h-[150px] overflow-hidden
                        rounded-2xl bg-black/15"
                      >
                        <motion.img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          whileHover={{
                            scale: 1.08,
                          }}
                          transition={{
                            duration: 0.5,
                          }}
                        />

                        <div
                          className="absolute inset-0
                          bg-linear-to-t from-black/30
                          to-transparent"
                        />
                      </motion.button>

                      {/* DETAILS */}
                      <div className="flex flex-col justify-between gap-5">
                        <div className="flex justify-between gap-4">
                          <div>
                            <h2
                              className="text-2xl font-serif font-bold
                              bg-linear-to-r from-emerald-200
                              to-amber-300 bg-clip-text
                              text-transparent"
                            >
                              {item.name}
                            </h2>

                            {item.description && (
                              <p
                                className="mt-2 text-sm leading-relaxed
                                text-emerald-100/55 line-clamp-2"
                              >
                                {item.description}
                              </p>
                            )}

                            <p className="mt-3 text-emerald-300 font-bold">
                              ${price.toFixed(2)} each
                            </p>
                          </div>

                          <motion.button
                            type="button"
                            aria-label={`Remove ${item.name}`}
                            whileHover={{
                              scale: 1.1,
                              rotate: 4,
                            }}
                            whileTap={{
                              scale: 0.88,
                            }}
                            onClick={() => removeFromCart(item.cartEntryId)}
                            className="shrink-0 w-10 h-10
                            rounded-full border border-red-400/20
                            bg-red-500/10 text-red-300
                            flex items-center justify-center
                            hover:bg-red-500/20"
                          >
                            <FaTrash />
                          </motion.button>
                        </div>

                        <div
                          className="flex flex-col sm:flex-row
                          sm:items-center sm:justify-between gap-4"
                        >
                          {/* QUANTITY CONTROLS */}
                          <div
                            className="inline-flex self-start
                            items-center gap-2 rounded-full
                            border border-emerald-400/20
                            bg-black/20 p-1.5"
                          >
                            <motion.button
                              type="button"
                              aria-label={`Decrease ${item.name} quantity`}
                              whileHover={{
                                scale: 1.1,
                              }}
                              whileTap={{
                                scale: 0.88,
                              }}
                              onClick={() => {
                                if (quantity > 1) {
                                  updateQuantity(
                                    item.cartEntryId,
                                    quantity - 1
                                  );
                                } else {
                                  removeFromCart(item.cartEntryId);
                                }
                              }}
                              className="w-9 h-9 rounded-full
                              bg-emerald-900/50 text-emerald-100
                              flex items-center justify-center
                              hover:bg-emerald-700"
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
                              className="min-w-8 text-center font-bold"
                            >
                              {quantity}
                            </motion.span>

                            <motion.button
                              type="button"
                              aria-label={`Increase ${item.name} quantity`}
                              whileHover={{
                                scale: 1.1,
                              }}
                              whileTap={{
                                scale: 0.88,
                              }}
                              onClick={() =>
                                updateQuantity(
                                  item.cartEntryId,
                                  quantity + 1
                                )
                              }
                              className="w-9 h-9 rounded-full
                              bg-emerald-900/50 text-emerald-100
                              flex items-center justify-center
                              hover:bg-emerald-700"
                            >
                              <FaPlus className="text-xs" />
                            </motion.button>
                          </div>

                          <motion.p
                            key={itemTotal}
                            initial={{
                              opacity: 0,
                              scale: 0.9,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            className="text-xl font-bold text-amber-300"
                          >
                            ${itemTotal.toFixed(2)}
                          </motion.p>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.section>

            {/* ORDER SUMMARY */}
            <motion.aside
              initial={{
                opacity: 0,
                x: 40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.6,
                delay: 0.2,
              }}
              className="h-fit lg:sticky lg:top-28
              rounded-[2rem]
              border border-emerald-400/20
              bg-white/5 backdrop-blur-xl p-7
              shadow-2xl shadow-black/30"
            >
              <h2 className="text-2xl font-serif font-bold text-emerald-100">
                Order Summary
              </h2>

              <div
                className="w-16 h-[2px] mt-4 mb-7
                bg-linear-to-r from-emerald-400
                to-transparent"
              />

              <div className="space-y-4 text-emerald-100/70">
                <div className="flex justify-between">
                  <span>Total items</span>
                  <span>{totalQuantity}</span>
                </div>

                <div className="flex justify-between">
                  <span>Subtotal</span>

                  <span>
                    ${Number(cartTotal || 0).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span>Delivery</span>

                  <span className="text-emerald-300 text-right">
                    Calculated at checkout
                  </span>
                </div>
              </div>

              <div
                className="my-6 border-t
                border-emerald-400/15"
              />

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">
                  Total
                </span>

                <motion.span
                  key={cartTotal}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="text-3xl font-bold text-amber-300"
                >
                  ${Number(cartTotal || 0).toFixed(2)}
                </motion.span>
              </div>

              <motion.button
                type="button"
                onClick={handleCheckout}
                whileHover={{
                  y: -3,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.94,
                }}
                className="mt-7 w-full inline-flex
                items-center justify-center gap-3
                rounded-full px-7 py-4
                bg-linear-to-r from-emerald-400
                to-green-600 text-[#100a07]
                font-bold shadow-lg
                shadow-emerald-950/40"
              >
                <FaLock className="text-sm" />
                Checkout Securely
              </motion.button>

              <Link
                to="/menu"
                className="mt-5 w-full inline-flex
                items-center justify-center gap-2
                text-sm text-emerald-200/70
                hover:text-emerald-300
                transition-colors"
              >
                <FaArrowLeft />
                Continue Shopping
              </Link>
            </motion.aside>
          </div>
        )}
      </div>

      {/* IMAGE MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-50
            flex items-center justify-center
            bg-black/80 backdrop-blur-md p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 30,
              }}
              transition={{
                duration: 0.3,
              }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Selected meal"
                className="max-w-[90vw] max-h-[85vh]
                rounded-[2rem] object-contain
                shadow-2xl shadow-black"
              />

              <motion.button
                type="button"
                aria-label="Close image"
                whileHover={{
                  scale: 1.1,
                  rotate: 90,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4
                w-11 h-11 rounded-full
                bg-emerald-500 text-[#100a07]
                flex items-center justify-center
                shadow-xl"
              >
                <FaTimes />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default CartPage;
