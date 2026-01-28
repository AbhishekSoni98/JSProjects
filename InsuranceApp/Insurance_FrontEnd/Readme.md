## 🌐 Frontend - SmartInsure

**SmartInsure** is a web application for managing insurance policies.  
The frontend is built with **HTML, CSS, and JavaScript**, and provides an intuitive interface for users to interact with various insurance-related features.

---

### ✨ User Functions
- Registration and login
- Personalized dashboard with Recent Claims view
- Policy management and details view
- Premium calculation
- Claim submission
- Purchase of new policies

---

### 📖 User Stories

1. **Home (Dashboard) – `dashboard.html`**  
   - Displays a personalized dashboard for the logged-in user.  
   - Shows the user's name, policy number, and recent claims.  
   - Provides navigation to features like submitting claims, viewing policies, or purchasing new policies.  

2. **Login – `login.html`**  
   - Contains a form to validate username and password.  
   - Displays error messages for invalid credentials.  

3. **Policy Details – `viewpolicy.html`**  
   - Shows policy details including:  
     - Policy holder’s name  
     - Policy number  
     - Coverage type  
     - Status  
     - Expiry date  

4. **Pricing Calculator – `pricing.html`**  
   - Allows users to calculate insurance premiums based on:  
     - Age  
     - Desired coverage amount  
     - Selected plan type  
   - Displays the calculated premium.  

5. **Buy New Policy – `newpolicy.html`**  
   - Displays available insurance plans (e.g., Health Insurance, Car Insurance).  
   - Users can select a plan and proceed to the respective application form.  

6. **Health Insurance Application – `healthform.html`**  
   - Contains a form to apply for health insurance.  
   - Collects details like:  
     - Name  
     - Date of birth  
     - Contact information  
     - Nominee details  
     - Plan selection  
   - Includes validation for all fields.  

7. **Submit Claim – `claim.html`**  
   - Provides a form for users to submit claims.  
   - Users specify the reason and claim amount.  
   - Displays a confirmation message upon successful submission.  

8. **Logout**  
   - Clears session data.  
   - Redirects the user back to the login page.  

---

### 🖥️ Tech Stack
- **HTML5** – Structure and layout  
- **CSS3** – Styling and responsive design  
- **JavaScript (ES6+)** – Dynamic behavior, form validation, API integration  

---

### 🔐 Key Frontend Features

#### 1. Secure Authentication
- **Login & Registration** implemented with strong password protection.  
- Passwords are **salted and encrypted** before being saved in the database.  
- Retrieval also uses secure **encrypt + salt functions**, ensuring user data safety.  

#### 2. Dynamic & Responsive UI
- Built with **Bootstrap 5**, ensuring compatibility across all devices (desktop, tablet, mobile).  
- Clean, modern design with responsive layouts.  

#### 3. Advanced JavaScript Functionality
- **Event Handling & Bubbling**: Efficient handling of user interactions across the application.  
- **Form Validations**: All forms include validation checks with clear error messages.  
- **Error Display**: Errors are shown using **alerts** for better user feedback.  

#### 4. State Management
- **Session Storage**: Logged-in user details are stored in session storage for quick access during the session.  
- **Cookies**: Metadata is stored in cookies to maintain lightweight user context across pages.  

---

