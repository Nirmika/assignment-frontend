import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "./screens/homePage";
import LoginPage from "./screens/LoginPage";
import SignUpPage from "./screens/SignUpPage";
import CarDetails from "./components/CarDetails";
import { Provider, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./state/index";
import Protected from "../src/components/auth/Protected";
import CarsWidget from "./screens/widgets/CarsWidget";
const App = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });
  return (
    <Provider store={store}>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Protected>
                  <HomePage></HomePage>
                </Protected>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/mycars"
              element={<CarsWidget  />}
            />
            
            <Route path="/car-details/:id" element={<CarDetails />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
};

export default App;
