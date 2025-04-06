import { configureStore } from "@reduxjs/toolkit";
import { PersistConfig, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import gameStateReducer from "./gameStateSlice";
import { listenerMiddleware } from "./listenerMiddleware";
import { GameState } from "./types";

const persistConfig: PersistConfig<GameState> = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, gameStateReducer);

const options = {
  serializableCheck: {
    ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
  },
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(options).prepend(listenerMiddleware.middleware),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
