import { Utilities } from "./util.js";

async function register(e) {
  if (
    sessionStorage.getItem("username") &&
    sessionStorage.getItem("password")
  ) {
    window.location.href = "dashboard.html";
  }

  let username = Utilities.sanitize(e.target.username.value);
  let password = Utilities.sanitize(e.target.password.value);
  let fullname = Utilities.sanitize(e.target.fullname.value);
  let email = Utilities.sanitize(e.target.email.value);

  console.log(username, password, fullname, email);
  sessionStorage.clear();

  try {
    const validations = validate(username, password, fullname, email);
    if (validations.length === 0) {
      const user = await Utilities.getUser({ username });
      if (user) {
        document.getElementById("password").value = "";
        sessionStorage.setItem(
          "error",
          "Username already exists, Please try Login!",
        );
        Utilities.loaded();
      } else {
        const generateHash = await Utilities.hashPasswordWithSalt(password);
        const userData = {
          username,
          password: generateHash,
          fullname,
          policyNumbers: [],
          email,
        };

        const response = await Utilities.submitData(userData);
        if(response.username === username) {
            sessionStorage.setItem("success", "User Registered successfully!");
            window.location.href = "login.html"
        } else {
            sessionStorage.setItem("error", "Something went wrong!");
    Utilities.loaded();
    console.error("Submit User data failed!", error);
        }
      }
    } else {
      let error = "";
      validations.forEach((validation) => {
        if (validation) {
          error += validation;
          error += "\n";
        }
      });
      sessionStorage.setItem("error", error);
      Utilities.loaded();
    }
  } catch (error) {
    sessionStorage.setItem("error", "Something went wrong!");
    Utilities.loaded();
    console.error("Error fetching or processing user data:", error);
  }
}

function validate(username, password, fullname, email) {
  let validations = [];
  let e = validateFullName(fullname);
  if (e != undefined) {
    validations.push(e);
  }
  e = validateUserName(username);
  if (e != undefined) {
    validations.push(e);
  }
  e = validateEmail(email);
  if (e != undefined) {
    validations.push(e);
  }
  e = validatePassword(password);
  if (e != undefined) {
    validations.push(e);
  }
  return validations;
}

// 1. Full name: Alphabets only, minimum 3 characters
function validateFullName(name) {
  const regex = /^[A-Za-z\s]{3,}$/;
  if (!regex.test(name)) {
    return "Invalid FullName!";
  }
}

// 2. Username: Alphabets and digits only, minimum 3 characters
function validateUserName(username) {
  const regex = /^[A-Za-z0-9]{3,}$/;
  if (!regex.test(username)) {
    return "Invalid Username!";
  }
}

// 3. Email: Standard email format
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return "Invalid Email!";
  }
}

// 4. Password: minimum length 4 characters
function validatePassword(password) {
  if (password.length < 4) {
    return "Invalid Password!";
  }
}
//called after the login.html completes the load event
window.onload = () => {
  Utilities.userLoggedIn();
  Utilities.loaded();
  //get the login form
  const registerForm = document.getElementById("registerForm");
  // bind the onSubmit event to login function
  registerForm.onsubmit = (e) => {
    e.preventDefault();
    register(e);
  };
};
