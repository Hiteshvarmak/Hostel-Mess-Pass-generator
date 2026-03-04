# Hostel Daily Pass System – Digital Token Generator

A **web-based hostel access management system** that generates a secure **daily digital pass with QR code** for hostellers. The system allows students to request a daily pass and enables hostel administrators to **approve or reject requests** through an admin dashboard.

Once approved, a **unique token and QR code** are generated for the student, which can be verified at the mess or hostel entrance.

This project is built using **HTML, CSS, and JavaScript with Local Storage**, making it lightweight and easy to deploy without a backend.

---

# Features

### Hosteller Features

* Secure login using **college email validation**
* Enter personal details such as name, room number, hostel ID, branch, and year
* Request a **daily hostel pass**
* Receive **approval status (Pending / Approved / Declined)**
* Generate **unique digital token**
* Automatic **QR Code generation**
* Copy token to clipboard
* Receive notifications when pass status changes

The token format is automatically generated like:

```
HST-HOSTELID-YYYYMMDD-RANDOMCODE
```

The token generation logic is implemented in the JavaScript logic. 

---

### Admin Features

* Admin login panel
* View list of **pending hostel pass requests**
* Approve or decline requests
* Automatic notification to users
* View **pass statistics by year**
* Dashboard for managing hostel pass approvals

All hosteller data is stored locally in the browser using **Local Storage**, which makes the system simple to deploy without server configuration. 

---

### Token Verification System

A separate verification page allows mess or hostel staff to **validate a token before allowing access**.

Verification checks:

* Token existence
* Token validity
* Token expiry

If the token is valid and not expired, access is granted. 

---

# Tech Stack

Frontend

* HTML5
* CSS3
* JavaScript (Vanilla JS)

Libraries

* QR Code Generator
* Chart.js (for pass statistics)

Storage

* Browser Local Storage

UI

* Responsive UI with modern CSS design system. 

---

# System Workflow

1. Hosteller logs into the system using college email.
2. Hosteller submits hostel details.
3. Request is stored with **Pending status**.
4. Admin reviews the request.
5. Admin approves or rejects the pass.
6. If approved:

   * Unique token is generated
   * QR code is generated
7. Mess staff verifies the token using the **verification page**.

---

# Project Structure

```
Hostel-Pass-System
│
├── index.html        # Main application interface
├── verify.html       # Token verification page
├── style.css         # UI styling
├── script.js         # Application logic
└── README.md         # Project documentation
```

---

# How to Run the Project

1. Download or clone the repository.

```
git clone https://github.com/yourusername/hostel-pass-system.git
```

2. Open the folder.

3. Run the project by opening:

```
index.html
```

in any modern browser.

No installation or backend setup is required.

---

# Future Improvements

* Backend integration (Node.js / Firebase)
* Database storage instead of Local Storage
* Secure authentication system
* QR scanner for mess entry
* Mobile app integration
* Email notifications for pass approval
