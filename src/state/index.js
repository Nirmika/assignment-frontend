import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  cars: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setCars: (state, action) => {
      state.cars = action.payload.cars;
    },

    setCar: (state, action) => {
      const updatedCars = state.cars.map((car) => {
        if (car._id === action.payload.car._id) return action.payload.car;
        return car;
      });
      state.cars = updatedCars;
    },
  },
});

export const { setLogin, setLogout, setCars, setCar, setUser } =
  authSlice.actions;

export default authSlice.reducer;
