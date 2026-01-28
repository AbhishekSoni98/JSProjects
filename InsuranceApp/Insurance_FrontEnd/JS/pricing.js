import { Utilities } from "./util.js";

function validateForm(e) {
  let age = e.target.age.value;
  let coverageAmount = e.target.coverage.value;
  let planType = e.target.planType.value;
  const result = Utilities.calculatePremium(age, coverageAmount, planType);
  let resultDiv = document.getElementById('result');
  let errorDiv = document.getElementById("error-message");
  if (result.status === "error") {
    let errors = "";
    result.errors.forEach((error) => {
      errors += error;
      errors += "\n";
    });
    errorDiv.innerText = errors;
    errorDiv.style.display = "block";
  } else {
    errorDiv.style.display = "none";
  }

  if (result.status === "success") {
    resultDiv.innerText = `Calculated Premium: ₹${result.premium}`;
    resultDiv.style.display = "block";
  } else {
    resultDiv.style.display = "none";
  }
}

let pricingForm = document.getElementById("pricingForm");
pricingForm.onsubmit = (e) => {
  e.preventDefault();
  validateForm(e);
};
