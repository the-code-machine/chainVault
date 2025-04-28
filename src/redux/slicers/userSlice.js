import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  login: false,
  address: null,
  ethreumAddress: null,
  firstName: null,
  lastName: null,
  email: null,
  role: null,
  company: null,
  isCompanyAdmin: false,
  storagePercentage: 0,
  lastLogin: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserLogin: (state, action) => {
      state.login = action.payload;
      
      // Reset state if logging out
      if (!action.payload) {
        return initialState;
      }
    },
    setUserAddress: (state, action) => {
      state.ethreumAddress = action.payload;
    },
    setUserDetails: (state, action) => {
      const userDetails = action.payload;
      
      // Update user details
      state.firstName = userDetails.firstName || state.firstName;
      state.lastName = userDetails.lastName || state.lastName;
      state.email = userDetails.email || state.email;
      state.role = userDetails.role || state.role;
      state.company = userDetails.companyName || state.company;
      state.isCompanyAdmin = userDetails.isCompanyAdmin || state.isCompanyAdmin;
      state.lastLogin = userDetails.lastLogin || state.lastLogin;
      
      // Optional: Set Ethereum address if not already set
      if (userDetails.ethreumAddress && !state.ethreumAddress) {
        state.ethreumAddress = userDetails.ethreumAddress;
      }
      
      // Set storage percentage if available
      if (userDetails.storagePercentage) {
        state.storagePercentage = userDetails.storagePercentage;
      }
    },
    setStoragePercentage: (state, action) => {
      state.storagePercentage = action.payload;
    },
  },
});

export const { 
  setUserLogin, 
  setUserAddress, 
  setUserDetails,
  setStoragePercentage
} = userSlice.actions;

export default userSlice.reducer;