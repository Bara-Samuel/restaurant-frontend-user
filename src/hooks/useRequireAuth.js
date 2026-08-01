import { useLocation, useNavigate } from "react-router-dom";

/**
 * Shared helper for gating actions (like "Add to Cart") behind login.
 *
 * Reuses the same mechanism PrivateRoute already relies on: Navbar
 * watches location.state.openLogin and opens the auth modal when it
 * sees it. Calling requireLogin() re-navigates to the current page
 * with that flag set, so the login modal pops up without losing the
 * visitor's place (unlike PrivateRoute, which redirects to "/").
 */
export const useRequireAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = Boolean(
    localStorage.getItem("authToken")
  );

  const requireLogin = () => {
    navigate(location.pathname, {
      replace: true,
      state: {
        openLogin: true,
        from: location.pathname,
      },
    });
  };

  return { isAuthenticated, requireLogin };
};

export default useRequireAuth;