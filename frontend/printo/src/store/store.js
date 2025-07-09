import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

// Middleware to sync state with localStorage
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  // Sync auth state with localStorage
  if (action.type.startsWith("auth/")) {
    if (state.auth.isAuthenticated) {
      localStorage.setItem(
        "authState",
        JSON.stringify({
          user: state.auth.user,
          token: state.auth.token,
          isAuthenticated: true,
          error: null,
        })
      );
    } else {
      localStorage.removeItem("authState");
    }
  }

  return result;
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

// Initialize auth state from localStorage
const savedAuth = localStorage.getItem("authState");
if (savedAuth) {
  try {
    const authState = JSON.parse(savedAuth);
    store.dispatch({
      type: "auth/setCredentials",
      payload: {
        user: authState.user,
        token: authState.token,
      },
    });
  } catch (error) {
    console.error("Error loading auth state:", error);
    localStorage.removeItem("authState");
  }
}

export default store;
