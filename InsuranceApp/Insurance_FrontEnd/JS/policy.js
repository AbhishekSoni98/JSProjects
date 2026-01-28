import { Utilities } from "./util.js";

function getPolicies() {
  let username = sessionStorage.getItem("username");
  let policyContainer = document.getElementById("policyContainer");
  let policycard = "";
  Utilities.getUser({ username }).then((user) => {
    Utilities.getAllPolicies(user.policyNumbers).then((policies) => {
    if (policies.length === 0 ) {
        policycard += '<div class="alert alert-primary" role="alert" style="text-align: center;">No policies to display!</div>';
    }
      policies.forEach((policy) => {
        policycard += `<div class="col-sm-4">
            <div class="card shadow-sm m-2">
            <div class="card-header bg-primary text-white text-center">
                <h2 class="mb-0">${policy.policyNumber} Details</h2>
            </div>
            <div class="card-body">
                <p><strong>Policy Holder:</strong> <span id="holder">${user.fullname}</span></p>
                <p><strong>Policy Number:</strong> <span id="number">${policy.policyNumber}</span></p>
                <p><strong>Coverage:</strong> ${Utilities.getCoverageType(policy.coverageType)}</p>
                <p><strong>Expiry Date:</strong> <span id="expiryDate">${policy.expiryDate != '' ? policy.expiryDate : 'Review Pending'}</span></p>
                <p style="text-align: center;"> ${Utilities.getPolicyStatus(policy.expiryDate)}</p>
            </div>
            </div>
            </div>`;
      });
      policyContainer.innerHTML = policycard;
    });
  });
}

getPolicies();

function goBack() {
  window.location.href = "dashboard.html";
}

document.getElementById("policyContainer").addEventListener("click", (e) => {
  e.stopPropagation();
  if (e.target.innerHTML === "Back to Dashboard") {
    goBack();
  }
});
