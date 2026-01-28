document.body.onload = () => {
  let username = sessionStorage.getItem("username");
  let password = sessionStorage.getItem("password");
  if (username && password) {
    console.log("Logged In!");
    document.getElementById("logout").addEventListener("click", (e) => {
      e.stopPropagation();
      logout();
    });
  } else {
    console.log("No Session found!");
    window.location.href = "login.html";
  }
};

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}
