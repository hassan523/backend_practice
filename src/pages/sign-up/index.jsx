import React, { useState } from "react";
import { useCreate_userMutation } from "@/redux/auth/auth";
import { NotificationAlert } from "@/components/customAlerts/NotificationAlert";
import { useRouter } from "next/router";
import {
  MdOutlineAddPhotoAlternate,
  MdVideoLibrary,
} from "react-icons/md";
import style from "../../styles/post.module.css";

const index = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: "",
  });
  const { name, email, password, profilePic } = formData;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // select Photo Function
  const handleAddPhotos = (e) => {
    const files = e.target.files[0];
    setFormData((prevContent) => ({
      ...prevContent,
      profilePic: files,
    }));
  };

  const [signup] = useCreate_userMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      profilePic !== ""
    ) {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("profilePic", profilePic);
        const res = await signup({
          data: formData,
        });
        if (!res.error) {
          NotificationAlert("user registered successfully", "success");
          setFormData({
            name: "",
            email: "",
            password: "",
          });
          router.push("/login");
          console.log(res.data);
        } else {
          console.log(res);
          NotificationAlert(res.error.data.message);
        }
      } catch (error) {
        NotificationAlert();
      }
    } else {
      NotificationAlert("All Fields Are Required");
    }
  };
  return (
    <>
      <section className="text-gray-400 bg-gray-900 body-font">
        <div
          className="container px-5 py-24 mx-auto flex flex-wrap items-center justify-center"
          style={{ height: "100vh" }}>
          <div className="lg:w-2/6 md:w-1/2 bg-gray-800 bg-opacity-50 rounded-lg p-8 flex flex-col  w-full mt-10 md:mt-0">
            <h2 className="text-white text-lg font-medium title-font mb-5">
              Sign Up
            </h2>
            <div className="relative mb-4">
              <label
                htmlFor="full-name"
                className="leading-7 text-sm text-gray-400">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-400">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                placeholder="Enter your email address"
                onChange={handleInputChange}
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
                type="password"
                id="password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-gray-600 bg-opacity-20 focus:bg-transparent focus:ring-2 focus:ring-indigo-900 rounded border border-gray-600 focus:border-indigo-500 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>
            <div className="relative mb-4 text-white bg-indigo-500 border-0 p-2 focus:outline-none hover:bg-indigo-600 rounded text-lg transition ease-in-out delay-150 hover:-translate-y-1 ">
              <label
                htmlFor="imageUpload"
                style={{ color: "var(--btn-color)" }}
                className="flex justify-center w-full">
                <div
                  className={`${style.addfield} flex justify-center align-center`}
                  style={{ cursor: "pointer", width: "100%" }}>
                  <MdOutlineAddPhotoAlternate
                    style={{ fontSize: "2rem", cursor: "pointer" }}
                  />

                  <h6 className={`${style.addfieldname} ps-3 pt-1`}>
                    Profile Picture
                  </h6>
                </div>
              </label>
              <input
                type="file"
                name="imageUrls"
                onChange={handleAddPhotos}
                id="imageUpload"
                accept="image/png, image/gif, image/jpeg"
                style={{ display: "none" }}
              />
            </div>
            <button
              className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
              onClick={handleSubmit}>
              Sign up
            </button>
            <div className="text-sm mt-3 flex gap-2">
              Al-ready have an account ?{" "}
              <p
                className="text-sm cursor-pointer"
                onClick={() => router.push("/login")}>
                Login
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default index;
