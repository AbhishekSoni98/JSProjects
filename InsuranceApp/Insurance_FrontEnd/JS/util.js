export class Utilities {
  static getUser = async ({ username }) => {
    const response = await fetch("http://localhost:3000/users");
    let users = await response.json();
    // users = users.users;
    // check if users exist
    if (users.length > 0) {
      // then find

      const userFound = users.find(
        (eachUser) => eachUser.username === username,
      );
      if (userFound) {
        return userFound; // user exists, then return that user
      } else {
        return false; //user not found
      }
    }
  };

  static getPolicy = async (policyNumber) => {
    const response = await fetch(
      `http://localhost:3000/policies/${policyNumber}`,
    );
    let policy = await response.json();
    if (policy) {
      return policy; // user exists, then return that user
    } else {
      return false; //user not found
    }
  };

  static getAllPolicies = async (policyNumbers) => {
    const fetchPolicies = policyNumbers.map(async (policyNumber) => {
      const response = await fetch(
        `http://localhost:3000/policies/${policyNumber}`,
      );
      return response.json();
    });
    const policies = await Promise.all(fetchPolicies);
    return policies;
  };

  static loaded() {
    let error = sessionStorage.getItem("error");
    if (error) {
      document.getElementById("errorNotify").innerText = error;
      document.getElementById("errorNotify").style.display = "block";
      sessionStorage.removeItem("error");
    } else {
      document.getElementById("errorNotify").style.display = "none";
    }

    let success = sessionStorage.getItem("success");
    if (success) {
      document.getElementById("successNotify").innerText = success;
      document.getElementById("successNotify").style.display = "block";
      sessionStorage.removeItem("success");
    } else {
      document.getElementById("successNotify").style.display = "none";
    }
  }

  static userLoggedIn() {
    let username = sessionStorage.getItem("username");
    let password = sessionStorage.getItem("password");
    if (username && password) {
      window.location.href = "dashboard.html";
    }
  }

  static verifyPassword = async (inputPassword, storedHash) => {
    // 1. Extract the stored salt and hash
    const [saltString, actualHashString] = storedHash.split(":");
    const salt = Uint8Array.from(atob(saltString), (c) => c.charCodeAt(0));

    // 2. Combine the input password with the retrieved salt
    const encoder = new TextEncoder();
    const inputPasswordBytes = encoder.encode(inputPassword);
    const combinedBytes = new Uint8Array(
      inputPasswordBytes.length + salt.length,
    );
    combinedBytes.set(inputPasswordBytes);
    combinedBytes.set(salt, inputPasswordBytes.length);

    // 3. Hash the combined input using the same algorithm
    const inputHashBuffer = await window.crypto.subtle.digest(
      "SHA-256",
      combinedBytes,
    );
    const inputHashString = btoa(
      String.fromCharCode(...new Uint8Array(inputHashBuffer)),
    );

    // 4. Compare the generated hash with the stored hash
    // Use a timing-safe comparison in a real app to prevent timing attacks
    return inputHashString === actualHashString;
  };

  static hashPasswordWithSalt = async (password) => {
    // 1. Generate a secure, random salt (16 bytes recommended)
    const salt = window.crypto.getRandomValues(new Uint8Array(16));

    // 2. Combine password and salt
    const encoder = new TextEncoder();
    const passwordBytes = encoder.encode(password);
    const combinedBytes = new Uint8Array(passwordBytes.length + salt.length);
    combinedBytes.set(passwordBytes);
    combinedBytes.set(salt, passwordBytes.length);

    // 3. Hash the combined value using a strong, standard algorithm (SHA-256)
    // Note: Standard hash functions like SHA-256 are fast and not specifically designed for password hashing.
    // For true password security, one should use memory-hard functions like Argon2id or scrypt on the server.
    const hashBuffer = await window.crypto.subtle.digest(
      "SHA-256",
      combinedBytes,
    );

    // 4. Convert salt and hash to base64 strings for storage
    const saltString = btoa(String.fromCharCode(...salt));
    const hashString = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));

    return `${saltString}:${hashString}`; // Store this combined string
  };

  static sanitize(string) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    };
    const reg = /[&<>"'/]/gi;
    return string.replace(reg, (match) => map[match]);
  }

  static submitData = async (formData) => {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      sessionStorage.setItem("error", "Something went wrong!");
      console.error("Submission failed:", error);
    }
  };

  static getCoverageType(coverageType) {
    let policyType = "";
    switch (coverageType) {
      case 1:
        policyType = "Health Insurance";
        break;
      case 2:
        policyType = "Life Insurance";
        break;
      case 3:
        policyType = "Health + Life Insurance";
        break;
      default:
        policyType = "Health + Life Insurance";
        break;
    }
    return policyType;
  }

  static getPolicyStatus(date) {
    try {
      if (date === null || date === "") {
        return '<div class="callout-warning p-2" style="text-align: center;">Review Pending</div>';
      }
      let expiryDate = new Date(date);
      let today = new Date();
      if (expiryDate > today) {
        return '<div class="callout-success p-2" style="text-align: center;">Active</div>';
      } else {
        return '<div class="callout-danger p-2" style="text-align: center;">Expired</div>';
      }
    } catch {
      return '<div class="callout-warning p-2" style="text-align: center;">Review Pending</div>';
    }
  }

  /**
   * Calculates insurance premium based on age, coverage amount, and plan type.
   * @param {number} age - Age of the insured (5-65)
   * @param {number} coverageAmount - Desired coverage amount in INR (50,000 - 10,00,00,000)
   * @param {string} planType - Plan type: 'basic', 'standard', 'premium'
   * @returns {number|string} - Calculated premium or error message if invalid inputs
   */
  static calculatePremium(age, coverageAmount, planType) {
    // Validate age
    let errors = [];

    if (age < 5 || age > 65) {
      errors.push("Age should be between 5 and 65 years.");
    }

    // Validate coverage amount
    if (coverageAmount < 50000 || coverageAmount > 1000000000) {
      errors.push("Coverage amount should be between ₹50,000 and ₹10,00,00,000.");
    }

    const planTypeLower = planType.toLowerCase();

    // Plan type multipliers
    const planMultipliers = {
      basic: 1.0,
      standard: 1.2,
      premium: 1.5,
    };

    if (!planMultipliers.hasOwnProperty(planTypeLower)) {
      errors.push("Plan type must be 'basic', 'standard', or 'premium'.");
    }

    if (errors.length > 0) {
      return {
        status: "error",
        errors
      }
    }

    // Age factor for premium calculation
    let ageFactor;
    if (age <= 25) {
      ageFactor = 1.0;
    } else if (age <= 40) {
      ageFactor = 1.2;
    } else if (age <= 60) {
      ageFactor = 1.5;
    } else {
      ageFactor = 2.0; // age 61-65
    }

    // Base premium rate as percentage of coverage amount
    const basePremiumRate = 0.05; // 5%

    // Calculate premium
    let premium =
      coverageAmount *
      basePremiumRate *
      ageFactor *
      planMultipliers[planTypeLower];

    // Round to nearest 2 decimal places
    return  {
      status: "success",
      premium: Math.round(premium * 100) / 100
    }
  }
}
