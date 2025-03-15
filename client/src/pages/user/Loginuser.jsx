import { useState } from "react";
import { Helmet } from "react-helmet";
import "../../assets/pagecss/Loginuser.css";
import bg3 from "../../assets/images/bg3.png";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Loginuser = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(`${apiUrl}user/signin/`, { email, password }).then((response) => {
      console.log(response.data);

      setInterval(() => {
        const storedSubTask = JSON.parse(localStorage.getItem("subTask"));
        if (storedSubTask && storedSubTask.expiresAt < new Date().getTime()) {
          localStorage.removeItem("subTask");
          localStorage.setItem(
            "subTask",
            JSON.stringify({
              value: 0,
              expiresAt: expirationTime,
            })
          );
          console.log("subTask expired and removed automatically");
        }
      }, 60 * 1000); // Check every minute
      

      setInterval(() => {
        const storedvideoTask = JSON.parse(localStorage.getItem("videoTask"));
        if (storedvideoTask && storedvideoTask.expiresAt < new Date().getTime()) {
          localStorage.removeItem("videoTask");
          localStorage.setItem(
            "videoTask",
            JSON.stringify({
              value: 0,
              expiresAt: expirationTime,
            })
          );
          console.log("videoTask expired and removed automatically");
        }
      }, 60 * 1000); // Check every minute


      let status = response.data.user.status;

      const today = new Date().toISOString().split("T")[0];

      let lastLogin = localStorage.getItem("lastLogin");
      let inactiveLogin = localStorage.getItem("inactiveLogin");

      if (lastLogin === null || lastLogin === undefined) {

        localStorage.setItem("lastLogin", today); //set last login date

        if (inactiveLogin === null || inactiveLogin === undefined) {

          lastLogin = localStorage.getItem("lastLogin");

          let lastLoginDate = new Date(lastLogin);
          let inactiveLoginDate = new Date(lastLoginDate);
          inactiveLoginDate.setDate(inactiveLoginDate.getDate() + 3);


          const inactiveLogin = inactiveLoginDate.toLocaleDateString("en-CA");


          localStorage.setItem("inactiveLogin", inactiveLogin);

        } else {

          const shouldTriggerAction = checkInactiveLogin();

          if (shouldTriggerAction) {
            toast.error("Your account is Deleted.", {
              duration: 3000,
              style: {
                borderRadius: "10px",
                height: "60px",
                background: "#171617",
                color: "#fff",
              },
            });

            return false;
          } else {

            localStorage.setItem("lastLogin", today); //set last login date

            lastLogin = localStorage.getItem("lastLogin");

            let lastLoginDate = new Date(lastLogin);
            let inactiveLoginDate = new Date(lastLoginDate);
            inactiveLoginDate.setDate(inactiveLoginDate.getDate() + 3);


            const inactiveLogin = inactiveLoginDate.toLocaleDateString("en-CA");


            localStorage.setItem("inactiveLogin", inactiveLogin);


          }

        }


      }


      toast.success(response.data.message, {
        duration: 3000,
        style: {
          borderRadius: "10px",
          height: "60px",
          background: "#171617",
          color: "#fff",
        },
      });

      setTimeout(() => {
        navigate("/user-dashboard");
      }, 3000);

      //set local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", response.data.user.id);
      sessionStorage.setItem("role", "user");
      localStorage.setItem("lastTime", true);

      localStorage.setItem("lastCallDate", today);

      let firstLoginUser = JSON.parse(localStorage.getItem("firstLoginUser"));

      if (firstLoginUser === null || firstLoginUser === undefined) {
        localStorage.setItem(
          "firstLoginUser",
          JSON.stringify({
            value: false
          })
        );
      }

      const now = new Date().getTime(); // Current time in milliseconds
      const expirationTime = now + 24 * 60 * 60 * 1000; // 1 day in milliseconds

      localStorage.setItem("username", response.data.user.username);
      // subTask
      let subTask = JSON.parse(localStorage.getItem("subTask"));

      if (subTask === null || subTask === undefined) {
        localStorage.setItem(
          "subTask",
          JSON.stringify({
            value: 20,
            expiresAt: expirationTime,
          })
        );
      } else if (subTask.value < 20) {
      } else if (subTask.value > 20) {
        localStorage.setItem(
          "subTask",
          JSON.stringify({
            value: 20,
            expiresAt: expirationTime,
          })
        );
      }

      let videoTask = JSON.parse(localStorage.getItem("videoTask"));

      if (videoTask === null || videoTask === undefined) {
        localStorage.setItem(
          "videoTask",
          JSON.stringify({
            value: 5,
            expiresAt: expirationTime,
          })
        );
      } else if (videoTask.value < 5) {
      } else if (videoTask.value > 5) {
        localStorage.setItem(
          "videoTask",
          JSON.stringify({
            value: 5,
            expiresAt: expirationTime,
          })
        );
      }

      sessionStorage.setItem(
        "isAuth",
        JSON.stringify({
          value: true,
          expiresAt: expirationTime,
        })
      );
    })
      .catch((error) => {
        toast.error(
          error.response?.data?.message &&
            typeof error.response.data.message === "string"
            ? error.response.data.message
            : error.response?.data?.message?.error ||
            "An error occurred. Please try again.",
          {
            duration: 3000,
            style: {
              borderRadius: "10px",
              height: "60px",
              background: "#171617",
              color: "#fff",
            },
          }
        );
        console.log(error);
      });
  };


  const checkInactiveLogin = () => {

    const inactiveLogin = localStorage.getItem("inactiveLogin"); // "2023-10-08"
    const today = new Date().toLocaleDateString("en-CA"); // "2023-10-08"


    if (!inactiveLogin) {
      console.log("inactiveLogin දිනය localStorage එකේ නොමැත!");
      return false;
    }


    const isInactiveDateReached = today >= inactiveLogin;


    return isInactiveDateReached;
  }

  const [eyes, setEyes] = useState('password');
  const [eyesPass, SeteyesPass] = useState('fa-eye')
  const ShowPassword = () => {

    eyes === 'password' ? setEyes('text') : setEyes('password');
    eyesPass === 'fa-eye' ? SeteyesPass('fa-eye-slash') : SeteyesPass('fa-eye');
  }

  return (
    <div>
      <Helmet>
        <title>Login - Hello YT</title>
        <meta
          name="description"
          content="Login to Hello YT and start growing your YouTube channel. Increase subscribers, views, and watch time effortlessly."
        />
        <meta
          name="keywords"
          content="YouTube growth, login, increase subscribers, YouTube views, watch time, Hello YT"
        />
        <meta name="author" content="Hello YT" />
        <meta property="og:title" content="Login - Hello YT" />
        <meta
          property="og:description"
          content="Login to Hello YT and start growing your YouTube channel. Increase subscribers, views, and watch time effortlessly."
        />
        <meta property="og:image" content={bg3} />
        <meta property="og:url" content="https://www.helloyt.com/login" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Login - Hello YT" />
        <meta
          name="twitter:description"
          content="Login to Hello YT and start growing your YouTube channel. Increase subscribers, views, and watch time effortlessly."
        />
        <meta name="twitter:image" content={bg3} />
      </Helmet>

      <Header />

      <section id="login">
        <div className="firstlogin">
          <div className="textlogin">
            <h1>Nice to see you again </h1>
            <p>
              Welcome to Hello YouTube, Your Gateway
              <br /> to Effortless YouTube Promotion
            </p>
          </div>

          <div className="formlogin">
            <form onSubmit={handleSubmit}>
              <h1>Sign In</h1>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="password-box-eyes">
              <input
                type={`${eyes}`}
                id="password"
                name="password"
                placeholder="Enter your Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <i id="eyesopen" class={`fa-regular ${eyesPass}`} onClick={(e) => {ShowPassword()}}></i>
              </div>

              <div className="fogotlogin">
                <a href="/"></a>
              </div>

              <input type="submit" value="Sign In" />
            </form>

            <div className="fogotlogin">
              <p>
                Don't you have an account? <a href="/signup">Sign up</a>
              </p>
            </div>
          </div>
        </div>

        <div className="secondlogin">
          <img src={bg3} alt="Promotion visual" />
        </div>
      </section>

      <Toaster position="top-center" reverseOrder={false} />

      <Footer />
    </div>
  );
};

export default Loginuser;
