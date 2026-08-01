import React, { useEffect, useState } from "react";
import { GiChefToque } from "react-icons/gi";
import {
  FiBook,
  FiHome,
  FiKey,
  FiLogOut,
  FiPackage,
  FiPhone,
  FiShoppingCart,
  FiStar,
  FiX,
} from "react-icons/fi";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../../CartContext/CartContext";
import Login from "../../components/Login/Login";
import SignUp from "../../components/SignUp/SignUp";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem("authToken"));
  });

  const { totalItems } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    {
      name: "Home",
      href: "/",
      icon: <FiHome />,
    },
    {
      name: "Menu",
      href: "/menu",
      icon: <FiBook />,
    },
    {
      name: "About",
      href: "/about",
      icon: <FiStar />,
    },
    {
      name: "Contact",
      href: "/contact",
      icon: <FiPhone />,
    },
    ...(isAuthenticated ? [
      {name:'My Orders', href: '/myorder', icon: <FiPackage/>}
    ]: [])
  ];

  // Update authentication when the route changes
  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem("authToken")));
    setIsOpen(false);
  }, [location.pathname]);

  // Open the Login modal when PrivateRoute redirects here
  useEffect(() => {
    if (location.state?.openLogin) {
      setAuthMode("login");
      setShowLoginModal(true);
    }
  }, [location.state]);

  // Lock page scrolling while the modal is open
  useEffect(() => {
    if (!showLoginModal) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowLoginModal(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showLoginModal]);

  const openLoginModal = () => {
    setAuthMode("login");
    setShowLoginModal(true);
    setIsOpen(false);
  };

  const closeAuthModal = () => {
    setShowLoginModal(false);
    setAuthMode("login");
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    closeAuthModal();

    const destination = location.state?.from || "/";

    navigate(destination, {
      replace: true,
      state: {},
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setIsOpen(false);
    navigate("/", { replace: true });
  };

  const renderDesktopAuthButton = () => {
    if (isAuthenticated) {
      return (
        <button
          type="button"
          onClick={handleLogout}
          className="group inline-flex items-center gap-2 rounded-full
          border border-green-400/20 bg-white/5 px-5 py-2.5
          font-semibold text-green-100
          transition-all duration-300
          hover:-translate-y-1 hover:border-green-400/50
          hover:bg-green-500/10 hover:text-green-300
          active:scale-95"
        >
          <FiLogOut className="transition-transform duration-300 group-hover:-rotate-12" />
          <span>Logout</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={openLoginModal}
        className="group relative inline-flex items-center gap-2
        overflow-hidden rounded-full
        bg-linear-to-r from-green-400 to-emerald-500
        px-5 py-2.5 font-bold text-[#120b08]
        shadow-lg shadow-green-950/30
        transition-all duration-300
        hover:-translate-y-1 hover:scale-[1.02]
        hover:shadow-green-500/20
        active:scale-95"
      >
        <span
          className="absolute inset-0 -translate-x-full
          bg-linear-to-r from-white/25 via-transparent to-transparent
          transition-transform duration-700
          group-hover:translate-x-full"
        />

        <FiKey className="relative z-10 transition-transform duration-300 group-hover:rotate-12" />

        <span className="relative z-10">Login</span>
      </button>
    );
  };

  const renderMobileAuthButton = () => {
    if (isAuthenticated) {
      return (
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2
          rounded-xl border border-green-400/20 bg-white/5
          px-4 py-3 font-semibold text-green-100
          transition-all duration-300
          hover:border-green-400/50 hover:bg-green-500/10"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={openLoginModal}
        className="flex w-full items-center justify-center gap-2
        rounded-xl bg-linear-to-r from-green-400 to-emerald-500
        px-4 py-3 font-bold text-[#120b08]
        shadow-lg shadow-green-950/30
        transition-all duration-300
        active:scale-[0.98]"
      >
        <FiKey />
        <span>Login</span>
      </button>
    );
  };

  return (
    <>
      <nav
        className="sticky top-0 z-50
        border-b border-green-400/15
        bg-[#140d09]/95 font-vibes
        shadow-[0_16px_40px_rgba(0,0,0,0.35)]
        backdrop-blur-xl"
      >
        {/* Decorative top line */}
        <div
          className="pointer-events-none absolute left-1/2 top-0
          h-[2px] w-full max-w-7xl -translate-x-1/2
          bg-linear-to-r from-transparent
          via-green-400/60 to-transparent"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between md:h-20">
            {/* Logo */}
            <NavLink
              to="/"
              className="group flex min-w-0 shrink-0 items-center gap-3"
            >
              <div
                className="relative flex h-11 w-11 shrink-0
                items-center justify-center rounded-full
                border border-green-400/20 bg-green-950/40
                shadow-lg shadow-green-950/40
                transition-all duration-300
                group-hover:rotate-6 group-hover:border-green-400/50"
              >
                <div
                  className="absolute inset-0 rounded-full
                  bg-green-400/10 opacity-0 blur-lg
                  transition-opacity duration-300
                  group-hover:opacity-100"
                />

                <GiChefToque className="relative text-2xl text-green-400" />
              </div>

              <div className="min-w-0">
                <span
                  className="block truncate bg-linear-to-r
                  from-green-200 via-emerald-400 to-amber-300
                  bg-clip-text font-monsieur text-2xl
                  text-transparent sm:text-3xl"
                >
                  Maison EKO
                </span>

                <span
                  className="hidden text-[9px] uppercase
                  tracking-[0.28em] text-green-100/45 sm:block"
                >
                  Restaurant &amp; Lounge
                </span>
              </div>
            </NavLink>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2 rounded-full
                    px-3 py-2 text-sm transition-all duration-300 lg:px-4
                    ${
                      isActive
                        ? "bg-green-500/15 text-green-300"
                        : "text-green-50/75 hover:bg-white/5 hover:text-green-200"
                    }`
                  }
                >
                  <span
                    className="text-green-400
                    transition-transform duration-300
                    group-hover:scale-110"
                  >
                    {link.icon}
                  </span>

                  <span>{link.name}</span>

                  <span
                    className="absolute bottom-0 left-1/2
                    h-[2px] w-0 -translate-x-1/2
                    bg-green-400 transition-all duration-300
                    group-hover:w-1/2"
                  />
                </NavLink>
              ))}

              {/* Cart */}
              <NavLink
                to="/cart"
                aria-label="Shopping cart"
                className={({ isActive }) =>
                  `relative ml-2 flex h-10 w-10
                  items-center justify-center rounded-full
                  border transition-all duration-300
                  hover:-translate-y-1
                  ${
                    isActive
                      ? "border-green-400/50 bg-green-500/15 text-green-300"
                      : "border-green-400/20 bg-white/5 text-green-100 hover:border-green-400/50 hover:bg-green-500/15 hover:text-green-300"
                  }`
                }
              >
                <FiShoppingCart />

                {totalItems > 0 && (
                  <span
                    className="absolute -right-2 -top-2 flex h-5
                    min-w-5 items-center justify-center rounded-full
                    bg-green-400 px-1 text-[10px] font-bold
                    text-[#120b08] shadow-md"
                  >
                    {totalItems}
                  </span>
                )}
              </NavLink>

              <div className="ml-2">{renderDesktopAuthButton()}</div>
            </div>

            {/* Mobile controls */}
            <div className="flex items-center gap-2 md:hidden">
              <NavLink
                to="/cart"
                aria-label="Shopping cart"
                className="relative flex h-10 w-10
                items-center justify-center rounded-full
                border border-green-400/20 bg-white/5
                text-green-100 transition-all duration-300
                hover:border-green-400/50 hover:text-green-300"
              >
                <FiShoppingCart />

                {totalItems > 0 && (
                  <span
                    className="absolute -right-2 -top-2 flex h-5
                    min-w-5 items-center justify-center rounded-full
                    bg-green-400 px-1 text-[10px] font-bold
                    text-[#120b08]"
                  >
                    {totalItems}
                  </span>
                )}
              </NavLink>

              <button
                type="button"
                aria-label="Toggle navigation"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((previous) => !previous)}
                className="flex h-11 w-11 flex-col
                items-center justify-center gap-1.5
                rounded-full border border-green-400/20
                bg-white/5 text-green-300
                transition-all duration-300
                hover:border-green-400/50
                hover:bg-green-500/10"
              >
                <span
                  className={`h-[2px] w-5 bg-current
                  transition-all duration-300 ${
                    isOpen ? "translate-y-2 rotate-45" : ""
                  }`}
                />

                <span
                  className={`h-[2px] w-5 bg-current
                  transition-all duration-300 ${
                    isOpen ? "opacity-0" : ""
                  }`}
                />

                <span
                  className={`h-[2px] w-5 bg-current
                  transition-all duration-300 ${
                    isOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <div
          className={`overflow-hidden border-t border-green-400/10
          bg-[#140d09]/98 transition-all duration-500 md:hidden
          ${
            isOpen
              ? "max-h-[600px] opacity-100"
              : "max-h-0 border-transparent opacity-0"
          }`}
        >
          <div className="space-y-2 px-4 py-5 sm:px-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl
                  border px-4 py-3 text-sm
                  transition-all duration-300
                  ${
                    isActive
                      ? "border-green-400/40 bg-green-500/15 text-green-300"
                      : "border-green-400/10 bg-white/5 text-green-100/80 hover:border-green-400/30 hover:bg-green-500/10 hover:text-green-200"
                  }`
                }
              >
                <span className="text-green-400">{link.icon}</span>
                <span>{link.name}</span>
              </NavLink>
            ))}

            <div className="pt-3">{renderMobileAuthButton()}</div>
          </div>
        </div>
      </nav>

      {/* Authentication modal */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-[9999]
          flex items-center justify-center
          overflow-y-auto bg-black/75
          px-4 py-6 backdrop-blur-md sm:py-10"
          onClick={closeAuthModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            onClick={(event) => event.stopPropagation()}
            className="relative my-auto w-full max-w-md
            max-h-[calc(100dvh-3rem)] overflow-y-auto
            rounded-[2rem] border border-green-400/25
            bg-linear-to-br from-[#21140d]
            via-[#17100b] to-[#063d2d]
            p-5 shadow-[0_30px_80px_rgba(0,0,0,0.65)]
            sm:max-h-[calc(100dvh-5rem)] sm:p-7"
          >
            {/* Modal background decoration */}
            <div
              className="pointer-events-none absolute -right-16 -top-20
              h-48 w-48 rounded-full bg-green-500/15 blur-3xl"
            />

            <div
              className="pointer-events-none absolute -bottom-20 -left-16
              h-48 w-48 rounded-full bg-amber-500/10 blur-3xl"
            />

            {/* Close button */}
            <button
              type="button"
              aria-label="Close authentication modal"
              onClick={closeAuthModal}
              className="sticky top-0 z-30 ml-auto
              flex h-10 w-10 items-center justify-center
              rounded-full border border-green-400/25
              bg-[#160f0a]/95 text-xl text-green-300
              shadow-lg backdrop-blur-md
              transition-all duration-300
              hover:rotate-90 hover:border-green-300
              hover:bg-green-400 hover:text-[#120b08]"
            >
              <FiX />
            </button>

            {/* Modal heading */}
            <div className="-mt-5 mb-6 text-center">
              <p
                className="mb-2 text-xs font-semibold uppercase
                tracking-[0.32em] text-green-400"
              >
                Welcome to
              </p>

              <h2
                id="auth-modal-title"
                className="bg-linear-to-r from-green-200
                via-emerald-400 to-amber-300
                bg-clip-text text-3xl font-bold
                text-transparent"
              >
                Maison EKO
              </h2>

              <p className="mt-2 text-sm text-green-50/60">
                {authMode === "login"
                  ? "Sign in to continue your experience."
                  : "Create an account and join the EKO family."}
              </p>
            </div>

            {/* Form */}
            <div className="relative z-10">
              {authMode === "login" ? (
                <Login
                  onLoginSuccess={handleLoginSuccess}
                  onClose={closeAuthModal}
                  onSwitchToSignUp={() => setAuthMode("signup")}
                />
              ) : (
                <SignUp
                  onBackToLogin={() => setAuthMode("login")}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;