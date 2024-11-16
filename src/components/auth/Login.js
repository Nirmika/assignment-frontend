import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { setLogin, setUser } from "../../state";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  // Check authentication and set user if token exists
  // useEffect(() => {
  //   const handleCheckAuth = async () => {
  //     try {
  //       const token = window.localStorage.getItem("token");
  //       if (token) {
  //         const response = await fetch(
  //           `${process.env.REACT_APP_Backend_URL}/check`,
  //           {
  //             method: "GET",
  //             headers: {
  //               "Content-Type": "application/json",
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         );
  //         let data = await response.json();
  //         data = data.data;
  //         if (response.status === 200) {
  //           dispatch(setUser({ user: data }));
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Error:", err);
  //     }
  //   };

  //   // Call the function to check authentication
  //   handleCheckAuth();
  // }, []); // empty dependency array ensures this effect runs only once on mount

  // Redirect if user is authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Log in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={handleSubmit(async (data) => {
              const response = await fetch(
                `${process.env.REACT_APP_Backend_URL}/auth/signin`,
                {
                  method: "POST",
                  body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                  }),
                  headers: { "Content-Type": "application/json" },
                }
              );
              let res = await response.json();
              res = res.data;
              window.localStorage.setItem("token", res.token);
              dispatch(setLogin(res));
              reset();
            })}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  className="block w-full pl-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type="password"
                  className="block w-full pl-2 rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
