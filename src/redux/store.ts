import { combineReducers, configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authSlice } from "./services/apiSlices/authSlice";
import { courseApiSlice } from "./services/apiSlices/courseSlice";
import { userApiSlice } from "./services/apiSlices/userSlice";
import userReducer from "./services/Slices/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { lessonSlice } from "./services/apiSlices/lessonSlice";
import { ticketSlice } from "./services/apiSlices/ticketSlice";
import { paymentSlice } from "./services/apiSlices/paymentSlice";
import { learnerSlice } from "./services/apiSlices/learnerSlice";
import { certificateSlice } from "./services/apiSlices/certificateSlice";
import { retakeSlice } from "./services/apiSlices/retakeSlice";
import { subscriptionSlice } from "./services/apiSlices/subscriptionSlice";
import { notificationSlice } from "./services/apiSlices/notificationSlice";
import { feedbackSlice } from "./services/apiSlices/feedbackSlice";
import { evaluationSlice } from "./services/apiSlices/evaluationSlice";
import { nonprofitAdminApiSlice } from "./services/apiSlices/nonprofitAdminApiSlice";
import { removeUser } from "./services/Slices/userSlice";

/** User-specific RTK Query caches (same endpoint key for every account) must clear on logout. */
const logoutListener = createListenerMiddleware();
logoutListener.startListening({
  actionCreator: removeUser,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(paymentSlice.util.resetApiState());
    listenerApi.dispatch(subscriptionSlice.util.resetApiState());
    listenerApi.dispatch(nonprofitAdminApiSlice.util.resetApiState());
  },
});

const rootReducer = combineReducers({
  user: userReducer,
  [authSlice.reducerPath]: authSlice.reducer,
  [userApiSlice.reducerPath]: userApiSlice.reducer,
  [courseApiSlice.reducerPath]: courseApiSlice.reducer,
  [lessonSlice.reducerPath]: lessonSlice.reducer,
  [ticketSlice.reducerPath]: ticketSlice.reducer,
  [paymentSlice.reducerPath]: paymentSlice.reducer,
  [learnerSlice.reducerPath]: learnerSlice.reducer,
  [certificateSlice.reducerPath]: certificateSlice.reducer,
  [retakeSlice.reducerPath]: retakeSlice.reducer,
  [subscriptionSlice.reducerPath]: subscriptionSlice.reducer,
  [notificationSlice.reducerPath]: notificationSlice.reducer,
  [feedbackSlice.reducerPath]: feedbackSlice.reducer,
  [evaluationSlice.reducerPath]: evaluationSlice.reducer,
  [nonprofitAdminApiSlice.reducerPath]: nonprofitAdminApiSlice.reducer,
});

const persistConfig = {
  key: "global_institute",
  storage,
  blacklist: [authSlice.reducerPath, userApiSlice.reducerPath, courseApiSlice.reducerPath, lessonSlice.reducerPath, ticketSlice.reducerPath, paymentSlice.reducerPath, learnerSlice.reducerPath, certificateSlice.reducerPath, retakeSlice.reducerPath, subscriptionSlice.reducerPath, notificationSlice.reducerPath, feedbackSlice.reducerPath, evaluationSlice.reducerPath, nonprofitAdminApiSlice.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(
        authSlice.middleware,
        userApiSlice.middleware,
        courseApiSlice.middleware,
        lessonSlice.middleware,
        ticketSlice.middleware,
        paymentSlice.middleware,
        learnerSlice.middleware,
        certificateSlice.middleware,
        retakeSlice.middleware,
        subscriptionSlice.middleware,
        notificationSlice.middleware,
        feedbackSlice.middleware,
        evaluationSlice.middleware,
        nonprofitAdminApiSlice.middleware,
        logoutListener.middleware,
      )
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
