const claimForm = document.getElementById("claimForm");
let resultDiv = document.getElementById("successNotify");
let errorDiv = document.getElementById("errorNotify");
document.getElementById("submitClaim").addEventListener("click", (e) => {
  e.preventDefault()
  const reason = document.getElementById("reason").value;
  const amount = document.getElementById("amount").value;
  cookieStore.get("policies").then((policies) => {
    if (policies.length === 0) {
      errorDiv.innerText =
        "No Policies found, Please Buy a Policy to initiate a claim.";
      errorDiv.style.display = "block";
      resultDiv.style.display = "none";
    } else if (reason === "") {
      errorDiv.innerText = "Please add a Reason!";
      errorDiv.style.display = "block";
      resultDiv.style.display = "none";
    } else if (Number(amount) < 500) {
      errorDiv.innerText = "Claim amount should be higher than 499!";
      errorDiv.style.display = "block";
      resultDiv.style.display = "none";
    } else {
      const claimData = {
        reason,
        amount,
        userId: sessionStorage.getItem("id"),
        status: "Submitted"
      };
      fetch("http://localhost:3000/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(claimData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          sessionStorage.setItem("claimSuccess", true);
          
        })
        .catch(() => {
          errorDiv.innerText = "Something went wrong!";
          errorDiv.style.display = "block";
          resultDiv.style.display = "none";
        });
    }
  });
});

function checkSuccess () {
  if(sessionStorage.getItem("claimSuccess")){
    resultDiv.innerText = `Claim submitted successfully!`;
    resultDiv.style.display = "block";
    errorDiv.style.display = "none";
    sessionStorage.removeItem("claimSuccess");
  }
}

checkSuccess();
