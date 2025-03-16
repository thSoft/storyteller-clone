import { configureStore } from "@reduxjs/toolkit";
import { PersistConfig, persistReducer, persistStore } from "redux-persist"; // defaults to localStorage for web
import storage from "redux-persist/lib/storage";
import gameStateReducer from "./gameStateSlice";
import { GameState } from "./types";

const persistConfig: PersistConfig<GameState> = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, gameStateReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
