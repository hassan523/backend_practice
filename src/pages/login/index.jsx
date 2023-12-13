import React, { useState } from "react";
import style from "../../styles/signup.module.css";
import { useLoginMutation } from "@/redux/auth/auth";
import { NotificationAlert } from "@/components/customAlerts/NotificationAlert";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const index = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [login] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (email !== "" && password !== "") {
        const res = await login(formData);
        if (!res.error) {
          NotificationAlert("user Login successfully", "success");
          setFormData({
            email: "",
            password: "",
          });
          Cookies.set("userData", JSON.stringify(res?.data?.data));
          router.push("/about");
        } else {
          NotificationAlert(res.error.data.message);
        }
      } else {
        NotificationAlert("Both Field Are Required");
      }
    } catch (error) {
      NotificationAlert(error.message);
    }
  };

  return (
    <>
      <section
        className="text-gray-400 bg-gray-900 body-font"
        style={{ height: "100vh" }}>
        <div className="container px-5 py-24 mx-auto flex flex-wrap items-center justify-center">
          <div className="lg:w-2/6 md:w-1/2 bg-gray-800 bg-opacity-50 rounded-lg p-8 flex flex-col  w-full mt-10 md:mt-0">
            <h2 className="text-white text-lg font-medium title-font mb-5">
              Login
            </h2>
            <div className="relative mb-4">
              <label
                htmlFor="full-name"
                className="leading-7 text-sm text-gray-400">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-400">
                Password
              </label>
              <input
                type="text"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <button
              className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
              onClick={handleSubmit}>
              Submit
            </button>
            <div className="text-sm mt-3 flex gap-2">
              Don't Have An Acc?
              <p
                onClick={() => router.push("/sign-up")}
                className="text-sm cursor-pointer">
                Signup
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default index;
