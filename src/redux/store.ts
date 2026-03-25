import { combineReducers, configureStore } from "@reduxjs/toolkit";
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
});

const persistConfig = {
  key: "global_institute",
  storage,
  blacklist: [authSlice.reducerPath, userApiSlice.reducerPath, courseApiSlice.reducerPath, lessonSlice.reducerPath, ticketSlice.reducerPath, paymentSlice.reducerPath, learnerSlice.reducerPath, certificateSlice.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
    .concat(authSlice.middleware, userApiSlice.middleware, courseApiSlice.middleware, lessonSlice.middleware, ticketSlice.middleware, paymentSlice.middleware, learnerSlice.middleware, certificateSlice.middleware )
});

setupListeners(store.dispatch);
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
