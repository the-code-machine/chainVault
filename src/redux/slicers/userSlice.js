// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        login: false,
        address: '',
    },
    reducers: {
        setUserLogin: (state, action) => {
            state.login = action.payload;
        },
        setUserAddress: (state, action) => {
            state.address = action.payload;
        },
        logout: (state) => {
            state.login = false;
            state.address = '';
        }
    }
});

export const { setUserLogin, setUserAddress, logout } = userSlice.actions;
export default userSlice.reducer;
