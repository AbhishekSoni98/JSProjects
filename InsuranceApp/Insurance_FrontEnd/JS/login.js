import { Utilities } from "./util.js";

async function login(e) {
  if (
    sessionStorage.getItem("username") &&
    sessionStorage.getItem("password")
  ) {
    window.location.href = "dashboard.html";
  }

  let username = Utilities.sanitize(e.target.username.value);
  let password = Utilities.sanitize(e.target.password.value);
  sessionStorage.clear();

  try {
    const user = await Utilities.getUser({ username });
    if (!user) {
      document.getElementById("password").value = "";
      sessionStorage.setItem("error", "Username does not exists!");
      Utilities.loaded();
    } else {
      const vPResult = await Utilities.verifyPassword(password, user?.password);
      if (user && user.username === username && vPResult) {
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("password", password);
        sessionStorage.setItem("id",user.id);
        cookieStore.set('policies',user.policyNumbers);
        window.location.href = "dashboard.html";
      } else {
        document.getElementById("password").value = "";
        sessionStorage.setItem("error", "Username or Password incorrect!");
        Utilities.loaded();
      }
    }
  } catch (error) {
    sessionStorage.setItem("error", "Something went worng!");
    Utilities.loaded();
    console.error("Error fetching or processing user data:", error);
  }
}

//called after the login.html completes the load event
window.onload = () => {
  Utilities.userLoggedIn();
  Utilities.loaded();
  //get the login form
  const loginForm = document.getElementById("loginForm");
  // bind the onSubmit event to login function
  loginForm.onsubmit = (e) => {
    e.preventDefault();
    login(e);
  };
};
