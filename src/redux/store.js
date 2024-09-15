// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slicers/userSlice'; // Adjust the path as necessary

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
  });
};
