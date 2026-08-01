import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

import axios from "axios";

const CartContext = createContext(null);

const API_URL = "http://localhost:4000/api/cart";

/**
 * Converts prices such as:
 * 18.99
 * "$18.99"
 * "18.99"
 *
 * into valid numbers.
 */
const getNumericPrice = (price) => {
  if (typeof price === "number" && Number.isFinite(price)) {
    return price;
  }

  const parsedPrice = parseFloat(
    String(price ?? "").replace(/[^0-9.-]+/g, "")
  );

  return Number.isNaN(parsedPrice) ? 0 : parsedPrice;
};

/**
 * Finds the cart array regardless of how the backend returns it.
 *
 * Supported examples:
 * res.data = [...]
 * res.data = { cart: [...] }
 * res.data = { cartItems: [...] }
 * res.data = { data: [...] }
 * res.data = { data: { cart: [...] } }
 */
const extractCartArray = (responseData) => {
  const possibleCartArrays = [
    responseData,
    responseData?.cart,
    responseData?.cartItems,
    responseData?.items,
    responseData?.data,
    responseData?.data?.cart,
    responseData?.data?.cartItems,
    responseData?.data?.items,
  ];

  return (
    possibleCartArrays.find((value) => Array.isArray(value)) ?? null
  );
};

/**
 * Sanitizes cart data received from either localStorage or the server.
 *
 * Every cart entry is flattened into a single shape so that every
 * component (OurMenu, SpecialOffer, CartPage, etc.) can rely on the
 * same fields:
 *
 * {
 *   cartEntryId: "the CartItem document's own _id (needed for
 *                 update/remove requests)",
 *   itemId:      "the underlying menu item's _id",
 *   name, description, category, price, image, quantity
 * }
 */
const sanitizeCart = (cart) => {
  if (!Array.isArray(cart)) {
    return [];
  }

  return cart
    .filter((cartEntry) => {
      return (
        cartEntry &&
        typeof cartEntry === "object" &&
        cartEntry.item
      );
    })
    .map((cartEntry) => {
      const product = cartEntry.item;

      const imagePath =
        product.imageUrl ??
        product.image ??
        product.imageURL ??
        "";

      const image =
        imagePath &&
        !imagePath.startsWith("http://") &&
        !imagePath.startsWith("https://")
          ? `http://localhost:4000${imagePath}`
          : imagePath;

      return {
        cartEntryId: cartEntry._id,
        itemId: product._id,
        name: product.name,
        description: product.description,
        category: product.category,
        price: getNumericPrice(product.price),
        image,
        quantity: Math.max(
          1,
          Number(cartEntry.quantity) || 1
        ),
      };
    });
};

/**
 * Cart reducer.
 *
 * The server is treated as the main source of truth.
 * After an API operation, the latest cart is fetched and stored here.
 */
const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return sanitizeCart(action.payload);

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

/**
 * Loads the locally saved cart when the application starts.
 */
const initializer = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedCart = localStorage.getItem("cart");

    if (!savedCart) {
      return [];
    }

    return sanitizeCart(JSON.parse(savedCart));
  } catch (error) {
    console.error(
      "Unable to load cart from localStorage:",
      error
    );

    return [];
  }
};

/**
 * Builds the Axios request configuration.
 */
const getRequestConfig = () => {
  const token = localStorage.getItem("authToken");

  return {
    withCredentials: true,

    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  };
};

export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(
    cartReducer,
    [],
    initializer
  );

  /**
   * Fetch the current user's cart from the server.
   */
  const fetchCart = useCallback(async () => {
    try {
      const response = await axios.get(
        API_URL,
        getRequestConfig()
      );

      console.log("Fetched cart:", response.data);

      const serverCart = extractCartArray(
        response.data
      );

      if (!Array.isArray(serverCart)) {
        console.error(
          "Cart response was not an array:",
          response.data
        );
        return;
      }

      dispatch({
        type: "SET_CART",
        payload: serverCart,
      });
    } catch (error) {
      console.error(
        "Unable to fetch cart:",
        error.response?.data ?? error.message
      );
    }
  }, []);

  /**
   * Hydrate the cart from the server when CartProvider mounts.
   */
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /**
   * Save cart changes to localStorage.
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        "cart",
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error(
        "Unable to save cart to localStorage:",
        error
      );
    }
  }, [cartItems]);

  /**
   * Add a product to the cart.
   *
   * `item` is the *menu item*, so `itemId` here is the menu item's
   * own `_id`. The backend looks up (or creates) the matching
   * CartItem document and increments its quantity.
   */
  const addToCart = useCallback(
    async (item, quantity = 1) => {
      const itemId = item?._id ?? item?.id;

      if (!itemId) {
        throw new Error("Item has no ID.");
      }

      try {
        const response = await axios.post(
          API_URL,
          {
            itemId,
            quantity,
          },
          getRequestConfig()
        );

        console.log(
          "Add-to-cart response:",
          response.data
        );

        await fetchCart();
      } catch (error) {
        console.error(
          "Unable to add item:",
          error.response?.data ?? error.message
        );

        throw error;
      }
    },
    [fetchCart]
  );

  /**
   * Remove an entry from the cart.
   *
   * IMPORTANT: the backend's delete route looks the CartItem up by
   * its own `_id`, so callers must pass a cart *entry* id
   * (`cartEntryId`), not the underlying menu item's id.
   */
  const removeFromCart = useCallback(
    async (cartEntryId) => {
      if (!cartEntryId) {
        throw new Error(
          "Cannot remove an item without a cart entry ID."
        );
      }

      try {
        await axios.delete(
          `${API_URL}/${cartEntryId}`,
          getRequestConfig()
        );

        await fetchCart();
      } catch (error) {
        console.error(
          "Unable to remove item from cart:",
          error.response?.data ?? error.message
        );

        throw error;
      }
    },
    [fetchCart]
  );

  /**
   * Update a cart entry's quantity.
   *
   * IMPORTANT: just like removeFromCart, the backend's update route
   * looks the CartItem up by its own `_id`, so `cartEntryId` must be
   * the cart entry id, not the underlying menu item's id.
   */
  const updateQuantity = useCallback(
    async (cartEntryId, quantity) => {
      if (!cartEntryId) {
        throw new Error(
          "Cannot update an item without a cart entry ID."
        );
      }

      const numericQuantity = Number(quantity);

      if (
        !Number.isFinite(numericQuantity) ||
        numericQuantity < 0
      ) {
        throw new Error(
          "The cart quantity must be zero or greater."
        );
      }

      // A quantity of zero removes the item.
      if (numericQuantity === 0) {
        await removeFromCart(cartEntryId);
        return;
      }

      try {
        await axios.put(
          `${API_URL}/${cartEntryId}`,
          {
            quantity: numericQuantity,
          },
          getRequestConfig()
        );

        await fetchCart();
      } catch (error) {
        console.error(
          "Unable to update cart quantity:",
          error.response?.data ?? error.message
        );

        throw error;
      }
    },
    [fetchCart, removeFromCart]
  );

  /**
   * Remove all products from the cart.
   */
  const clearCart = useCallback(async () => {
    try {
      await axios.post(
        `${API_URL}/clear`,
        {},
        getRequestConfig()
      );

      dispatch({
        type: "CLEAR_CART",
      });
    } catch (error) {
      console.error(
        "Unable to clear cart:",
        error.response?.data ?? error.message
      );

      throw error;
    }
  }, []);

  /**
   * Calculate the total number of products.
   */
  const totalItems = cartItems.reduce(
    (total, cartItem) => {
      return total + (Number(cartItem.quantity) || 0);
    },
    0
  );

  /**
   * Calculate the total cart price.
   */
  const totalAmount = cartItems.reduce(
    (total, cartItem) => {
      const price = getNumericPrice(
        cartItem.price
      );

      const quantity =
        Number(cartItem.quantity) || 0;

      return total + price * quantity;
    },
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalAmount,
        cartTotal: totalAmount,
        totalItemsCount: totalItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider."
    );
  }

  return context;
};
