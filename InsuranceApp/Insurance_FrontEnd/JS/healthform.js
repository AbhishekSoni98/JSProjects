function validateHealthForm() {
  const namePattern = /^[A-Za-z\s]{3,50}$/;
  const contactPattern = /^[0-9]{10}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fullname = document.getElementById("name").value.trim();
  const dob = document.getElementById("dob").value;
  const contact = document.getElementById("contact").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();
  const nominee = document.getElementById("nominee").value.trim();
  const relationship = document
    .getElementById("relationship")
    .value.toLowerCase();
  const plan = document.getElementById("plan").value.toLowerCase();
  const formType = document.getElementById("formType").value;

  let policyMetaData = {
    policiesId: "",
    fullname: fullname,
    dob: dob,
    phone: contact,
    email,
    address,
    nominee,
    nomineeRelationship: relationship,
    planType: plan,
  };

  let errors = [];

  // Full Name
  if (!namePattern.test(fullname)) {
    errors.push("Full name must be 3-50 letters only.");
  }

  // Age check (must be 18+)
  if (!dob) {
    errors.push("Please enter your date of birth.");
  }
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  if (age < 18) {
    errors.push("You must be at least 18 years old.");
  }

  // Contact Number
  if (!contactPattern.test(contact)) {
    errors.push("Contact number must be exactly 10 digits.");
  }

  // Email
  if (!emailPattern.test(email)) {
    errors.push("Please enter a valid email address.");
  }

  // Address
  if (address.length < 5) {
    errors.push("Address must be at least 5 characters long.");
  }

  // Nominee Name
  if (!namePattern.test(nominee)) {
    errors.push("Nominee name must be 3-50 letters only.");
  }

  // Relationship
  const validRelationships = ["son", "daughter", "father", "mother", "sibling"];
  if (!validRelationships.includes(relationship)) {
    errors.push(
      `Please enter a valid relationship like [ ${validRelationships} ]`,
    );
  }

  // Plan Type
  const validPlans = ["basic", "standard", "premium"];
  if (!validPlans.includes(plan)) {
    errors.push("Please select a valid plan type.");
  }

  let result;

  if (errors.length > 0) {
    result = {
      status: "error",
      errors,
    };
  } else {
    result = {
      status: "success",
    };
  }

  let resultDiv = document.getElementById("successNotify");
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
    try {
      policyData = {
        policyNumber: "",
        coverageType: getCoverageType(formType),
        expiryDate: "",
      };

      submitPolicy(policyData, policyMetaData);
    } catch (error) {
      sessionStorage.setItem("error", "Something went wrong!");
      console.error("Submission failed:", error);
    } finally {
      // alert("Application Submitted Successfully!")
      sessionStorage.setItem("policyFormSuccess", true);
    }
  } else {
    resultDiv.style.display = "none";
  }
}

function getCoverageType(formType) {
  switch (formType) {
    case "HealthForm":
      return 1;
    case "LifeForm":
      return 2;
    default:
      return 3;
  }
}

async function submitPolicy(policyData, policyMetaData) {
  await fetch("http://localhost:3000/policies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(policyData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(async (data) => {
      let id = data.id;
      policyData.policyNumber = `INS-A0${id}`;
      await fetch(`http://localhost:3000/policies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(policyData),
      });
      policyMetaData.policiesId = id;
      await fetch(`http://localhost:3000/policyMetaData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(policyMetaData),
      });
      cookieStore.get("policies").then(async (policies) => {
        userId = sessionStorage.getItem("id");
        let policyArr = policies.value.split(",");
        policyArr = policyArr.map((n) => parseInt(n));
        policyArr.push(id);
        cookieStore.set("policies", policyArr);
        await fetch(`http://localhost:3000/users/${userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ policyNumbers: policyArr }),
        });
      });
    });
}

function checkSuccess() {
  let resultDiv = document.getElementById("successNotify");
  if (sessionStorage.getItem("policyFormSuccess")) {
    resultDiv.innerText = "Application Submitted Successfully!";
    resultDiv.style.display = "block";
    sessionStorage.removeItem("policyFormSuccess");
  } else {
    resultDiv.innerText = "";
    resultDiv.style.display = "none";
  }
}

checkSuccess();
