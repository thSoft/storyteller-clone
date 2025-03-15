import { configureStore } from "@reduxjs/toolkit";
import gameStateReducer from "./gameStateSlice";

export const store = configureStore({
  reducer: {
    gameState: gameStateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
