import { useState } from "react";
import SignIn from "./pages/SignIn";
import { Routes, Route, Link } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
      <Routes>
        <Route
          path="/"
          element={
            <div className="background-main">
              <header className="w-full">
                <nav className="navbar navbar-expand-lg navbar-light fixed top-0 right-0 left-0 z-30 p-5">
                  <div className="mx-auto flex flex-column flex-wrap items-center justify-between px-3">
                    <a
                      className="navbar-brand js-scroll-trigger"
                      href="https://www.nexvisionlab.com"
                    >
                      <img
                        className="main-logo w-[240px]"
                        src="/src/assets/image/logo/logo.png"
                        alt=""
                      />
                    </a>
                    <div className="navbar-button-bar flex items-center space-between gap-40">
                      <ul className="flex gap-8">
                        <li>
                          <a className="nav-bold" href="/">
                            About
                          </a>
                        </li>
                        <li>
                          <a className="nav-bold" href="/">
                            Contact
                          </a>
                        </li>
                        <li>
                          <a className="nav-bold" href="/">
                            PrivacyPolicy
                          </a>
                        </li>
                      </ul>
                      <div>
                        <Link
                          className="text-[#8c8c8c] no-underline bg-transparent hover:text-red-500 nav-light"
                          to="/signin"
                        >
                          Sign In
                        </Link>
                      </div>
                    </div>
                  </div>
                </nav>
              </header>
              <section className="flex flex-col h-[calc(100vh-250px)] absolute top-[100px] w-full items-center justify-center">
                <h1 className="body-header text-uppercase text-[3rem] text-white items-center font-bold">
                  THE NEXVISION SOCIAL SOLUTION
                </h1>
                <hr className="divider w-[3rem] border-[.2rem] border-[#8c8c8c] my-7"></hr>
                <p className="text-white opacity-75 font-normal leading-normal mb-8">
                  REAL-TIME SOCIAL MEDIA THREAT INTELLIGENCE
                </p>
                <a
                  className="btn btn-primary btn-xl js-scroll-trigger"
                  href="https://www.nexvisionlab.com"
                >
                  Find Out More
                </a>
              </section>
              <footer className="w-full fixed bottom-0 left-0 right-0 !bg-[#121212] text-white py-6 text-center">
                <div className="container mx-auto">
                  <p className="text-sm">
                    NEXVISIONLAB - REAL-TIME SOCIAL MEDIA THREAT INTELLIGENCE.
                    All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
          }
        />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
  );
}

export default App;
