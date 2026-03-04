"use strict";

const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const adminDashboardSection = document.getElementById("admin-dashboard-section");

const loginForm = document.getElementById("login-form");

const inputEmail = document.getElementById("email");
const inputName = document.getElementById("hosteller-name");
const inputRoom = document.getElementById("room-number");
const inputHostelId = document.getElementById("hostel-id");
const inputBranch = document.getElementById("branch");
const inputYear = document.getElementById("year");

const displayName = document.getElementById("display-name");
const displayRoom = document.getElementById("display-room");
const displayHostelId = document.getElementById("display-hostel-id");
const displayBranch = document.getElementById("display-branch");
const displayYear = document.getElementById("display-year");
const displayDate = document.getElementById("display-date");

const tokenDisplay = document.getElementById("token-display");
const generateBtn = document.getElementById("generate-btn");

const copyBtn = document.getElementById("copy-token-btn");

const logoutBtn = document.getElementById("logout-btn");

// admin elements
const adminLoginBtn = document.getElementById("admin-login-btn");
const adminPanel = document.getElementById("admin-panel");
const adminUserInput = document.getElementById("admin-user");
const adminPassInput = document.getElementById("admin-pass");
const adminLoginSubmit = document.getElementById("admin-login-submit");
const adminUserError = document.getElementById("admin-user-error");
const adminPassError = document.getElementById("admin-pass-error");
const adminActions = document.getElementById("admin-actions");
const verifyBtn = document.getElementById("verify-btn");
const rejectBtn = document.getElementById("reject-btn");
const adminLogoutBtn = document.getElementById("admin-logout-btn");
const adminList = document.getElementById("admin-list");
const noEntriesMsg = document.getElementById("no-entries");
const dashboardAdminBtn = document.getElementById("admin-panel-btn");
const notificationsList = document.getElementById("notifications-list");
const noNotificationsMsg = document.getElementById("no-notifications");
const passStatsChart = document.getElementById("passStatsChart");
let adminLogged = false;
let hostellers = [];
let notifications = [];
let passStatsChartInstance = null;
const qrcodeDiv = document.getElementById("qrcode");
let currentUser = null;


function getTodayDate(){

let d = new Date();

return d.toISOString().split("T")[0];

}



function generateRandomString(){

const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

let str="";

for(let i=0;i<6;i++){

str+=chars[Math.floor(Math.random()*chars.length)];

}

return str;

}



function generateToken(hostelId){

let date=getTodayDate().replaceAll("-","");

let rand=generateRandomString();

return `HST-${hostelId}-${date}-${rand}`;

}



function generateQRCode(token){

qrcodeDiv.innerHTML="";

new QRCode(qrcodeDiv,{

text:token,

width:160,

height:160

});

}



function showDashboard(user){

loginSection.classList.add("hidden");

dashboardSection.classList.remove("hidden");

displayName.textContent=user.name;

displayRoom.textContent=user.room;

displayHostelId.textContent=user.hostelId;

displayBranch.textContent=user.branch || '--';

displayYear.textContent=user.year ? user.year + (user.year==='1'?'st':user.year==='2'?'nd':user.year==='3'?'rd':'th') : '--';


displayDate.textContent=getTodayDate();

// display status
const statusDisplay = document.getElementById("display-status");
const approvalMsg = document.getElementById("approval-message");
statusDisplay.textContent = user.status || 'pending';
statusDisplay.className = `status-badge ${user.status || 'pending'}`;

// disable/enable generate button based on approval
if (user.status === 'approved') {
  generateBtn.disabled = false;
  approvalMsg.classList.add("hidden");
} else {
  generateBtn.disabled = true;
  approvalMsg.classList.remove("hidden");
}

}



function validateEmail(email) {
  // restrict to official VNRVJIET domain
  const re = /^[a-zA-Z0-9._%+-]+@vnrvjiet\.ac\.in$/;
  return re.test(email);
}

loginForm.addEventListener("submit",function(e){
  e.preventDefault();

  // clear prev errors
  document.getElementById("email-error").textContent = "";
  document.getElementById("name-error").textContent = "";
  document.getElementById("room-error").textContent = "";
  document.getElementById("id-error").textContent = "";

  let valid = true;

  if (!inputEmail.value || !validateEmail(inputEmail.value)) {
    document.getElementById("email-error").textContent = "Invalid college email";
    valid = false;
  }
  if (!inputName.value.trim()) {
    document.getElementById("name-error").textContent = "Name is required";
    valid = false;
  }
  if (!inputRoom.value.trim()) {
    document.getElementById("room-error").textContent = "Room number is required";
    valid = false;
  }
  if (!inputHostelId.value.trim()) {
    document.getElementById("id-error").textContent = "Hostel ID is required";
    valid = false;
  }
  if (!inputBranch.value.trim()) {
    document.getElementById("branch-error").textContent = "Branch is required";
    valid = false;
  }
  if (!inputYear.value) {
    document.getElementById("year-error").textContent = "Please select a year";
    valid = false;
  }

  if (!valid) return;

  // try to find existing hosteller entry by email+hostelId
  let existing = hostellers.find(h => h.email === inputEmail.value && h.hostelId === inputHostelId.value);
  if (existing) {
    // update fields in case user typed new info
    existing.name = inputName.value;
    existing.room = inputRoom.value;
    existing.branch = inputBranch.value;
    existing.year = inputYear.value;
    currentUser = existing;
  } else {
    currentUser={
      email: inputEmail.value,
      name:inputName.value,
      room:inputRoom.value,
      hostelId:inputHostelId.value,
      branch: inputBranch.value,
      year: inputYear.value,
      id: Date.now(),
      status: 'pending'
    };
    hostellers.push(currentUser);
  }
  localStorage.setItem("hostellers", JSON.stringify(hostellers));

  showDashboard(currentUser);
});



generateBtn.addEventListener("click",function(){

if(!currentUser) return;

if(currentUser.status !== 'approved') {
  alert('Your pass is not approved by admin yet.');
  return;
}

let token=generateToken(currentUser.hostelId);

tokenDisplay.textContent=token;

generateQRCode(token);

localStorage.setItem("dailyPass",JSON.stringify({

token:token,

expiry:new Date().setHours(23,59,59)

}));

});



copyBtn.addEventListener("click",function(){

navigator.clipboard.writeText(tokenDisplay.textContent);

alert("Token Copied");

});



logoutBtn.addEventListener("click",function(){
  dashboardSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
});

// admin toggle behavior
adminLoginBtn.addEventListener("click", function(){
  adminPanel.classList.toggle("hidden");
});

// Quick admin access from dashboard
dashboardAdminBtn.addEventListener("click", function(){
  dashboardSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
  adminPanel.classList.remove("hidden");
  adminUserInput.focus();
});

adminLoginSubmit.addEventListener("click", function(){
  // simple credential check (replace with real auth)
  adminUserError.textContent = "";
  adminPassError.textContent = "";
  const user = adminUserInput.value.trim();
  const pass = adminPassInput.value;
  if (!user) {
    adminUserError.textContent = "Username required";
    return;
  }
  if (!pass) {
    adminPassError.textContent = "Password required";
    return;
  }
  if (user === "admin" && pass === "admin123") {
    adminLogged = true;
    showAdminDashboard();
  } else {
    adminPassError.textContent = "Invalid credentials";
  }
});

verifyBtn.addEventListener("click", function(){
  if (!adminLogged) return;
  const info = `Name: ${inputName.value}, Room: ${inputRoom.value}, Hostel ID: ${inputHostelId.value}`;
  alert("Verified details:\n" + info);
});

rejectBtn.addEventListener("click", function(){
  if (!adminLogged) return;
  alert("Details not verified.");
});

// Load hostellers from localStorage
function loadHostellers() {
  const saved = localStorage.getItem("hostellers");
  if (saved) {
    hostellers = JSON.parse(saved);
  }
}

// Display admin dashboard
function showAdminDashboard() {
  loginSection.classList.add("hidden");
  adminDashboardSection.classList.remove("hidden");
  renderAdminList();
}

// Render hosteller list in admin dashboard
function renderAdminList() {
  const pending = hostellers.filter(h => h.status === 'pending');
  
  if (pending.length === 0) {
    adminList.innerHTML = '';
    noEntriesMsg.style.display = 'block';
    return;
  }

  noEntriesMsg.style.display = 'none';
  adminList.innerHTML = pending.map(hosteller => `
    <div class="admin-entry" data-id="${hosteller.id}">
      <div class="admin-entry-details">
        <div class="admin-entry-item">
          <span class="admin-entry-label">Name</span>
          <span class="admin-entry-value">${hosteller.name}</span>
        </div>
        <div class="admin-entry-item">
          <span class="admin-entry-label">Email</span>
          <span class="admin-entry-value">${hosteller.email}</span>
        </div>
        <div class="admin-entry-item">
          <span class="admin-entry-label">Room</span>
          <span class="admin-entry-value">${hosteller.room}</span>
        </div>
        <div class="admin-entry-item">
          <span class="admin-entry-label">Hostel ID</span>
          <span class="admin-entry-value">${hosteller.hostelId}</span>
        </div>
        <div class="admin-entry-item">
          <span class="admin-entry-label">Branch</span>
          <span class="admin-entry-value">${hosteller.branch}</span>
        </div>
        <div class="admin-entry-item">
          <span class="admin-entry-label">Year</span>
          <span class="admin-entry-value">${hosteller.year}${hosteller.year === '1' ? 'st' : hosteller.year === '2' ? 'nd' : hosteller.year === '3' ? 'rd' : 'th'}</span>
        </div>
      </div>
      <div class="admin-entry-actions">
        <button class="btn-approve" onclick="approveHosteller(${hosteller.id})">
          <i class="fas fa-check"></i> Approve
        </button>
        <button class="btn-decline" onclick="declineHosteller(${hosteller.id})">
          <i class="fas fa-times"></i> Decline
        </button>
      </div>
    </div>
  `).join('');
}

// Approve hosteller
function approveHosteller(id) {
  const hosteller = hostellers.find(h => h.id === id);
  if (hosteller) {
    hosteller.status = 'approved';
    localStorage.setItem("hostellers", JSON.stringify(hostellers));
    
    // Add notification
    addNotification(
      `Pass Approved ✓`,
      `Your hostel pass has been approved by the admin. You can now generate your QR code.`,
      'approved'
    );
    
    // if this is the currently logged-in user, update display
    if (currentUser && currentUser.id === id) {
      currentUser.status = 'approved';
      updateDashboardStatus();
      alert(`✓ Pass approved for ${hosteller.name}\n\nToken and QR code have been automatically generated!`);
    } else {
      alert(`✓ Pass approved for ${hosteller.name}\n\nToken and QR code will be generated when they view their dashboard.`);
    }
    renderAdminList();
    renderPassStatsChart();
  }
}

// Decline hosteller
function declineHosteller(id) {
  const hosteller = hostellers.find(h => h.id === id);
  if (hosteller) {
    hosteller.status = 'declined';
    localStorage.setItem("hostellers", JSON.stringify(hostellers));
    
    // Add notification
    addNotification(
      `Pass Declined`,
      `Your hostel pass request has been declined by the admin. Please contact the admin for more information.`,
      'declined'
    );
    
    // if this is the currently logged-in user, update display
    if (currentUser && currentUser.id === id) {
      currentUser.status = 'declined';
      updateDashboardStatus();
    }
    
    alert(`Pass declined for ${hosteller.name}`);
    renderAdminList();
    renderPassStatsChart();
  }
}

// Update dashboard status display
function updateDashboardStatus() {
  const statusDisplay = document.getElementById("display-status");
  const approvalMsg = document.getElementById("approval-message");
  
  statusDisplay.textContent = currentUser.status || 'pending';
  statusDisplay.className = `status-badge ${currentUser.status || 'pending'}`;
  
  if (currentUser.status === 'approved') {
    generateBtn.disabled = false;
    approvalMsg.classList.add("hidden");
    
    // show notification if logging in after approval
    addNotification('Pass Approved','Your pass has been approved and the token is ready.','approved');
    
    // Auto-generate token and QR code on approval
    setTimeout(function() {
      let token = generateToken(currentUser.hostelId);
      tokenDisplay.textContent = token;
      generateQRCode(token);
      localStorage.setItem("dailyPass", JSON.stringify({
        token: token,
        expiry: new Date().setHours(23,59,59)
      }));
      
      // Add success glow animation
      const wrapper = document.querySelector(".token-display-wrapper");
      if (wrapper) {
        wrapper.classList.add("success-glow");
        setTimeout(() => wrapper.classList.remove("success-glow"), 3000);
      }
    }, 500);
  } else {
    generateBtn.disabled = true;
    approvalMsg.classList.remove("hidden");
  }
}


// Check for approval status periodically (every 3 seconds)
setInterval(function() {
  if (currentUser && dashboardSection.classList.contains("hidden") === false) {
    const updated = hostellers.find(h => h.id === currentUser.id);
    if (updated && updated.status !== currentUser.status) {
      currentUser.status = updated.status;
      updateDashboardStatus();
    }
  }
}, 3000);

// Admin logout
adminLogoutBtn.addEventListener("click", function(){
  adminLogged = false;
  adminDashboardSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
  adminPanel.classList.add("hidden");
  adminUserInput.value = '';
  adminPassInput.value = '';
});

// Add notification for user
function addNotification(title, message, type = 'info') {
  const notification = {
    id: Date.now(),
    title: title,
    message: message,
    type: type,
    timestamp: new Date().toLocaleString()
  };
  notifications.push(notification);
  localStorage.setItem("notifications", JSON.stringify(notifications));
  renderNotifications();
}

// Render notifications
function renderNotifications() {
  if (notifications.length === 0) {
    notificationsList.innerHTML = '';
    noNotificationsMsg.style.display = 'block';
    return;
  }

  noNotificationsMsg.style.display = 'none';
  notificationsList.innerHTML = notifications.slice().reverse().map(notif => `
    <div class="notification-item ${notif.type}">
      <div class="notification-icon">
        <i class="fas ${notif.type === 'approved' ? 'fa-check-circle' : notif.type === 'declined' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
      </div>
      <div class="notification-content">
        <div class="notification-title">${notif.title}</div>
        <div class="notification-message">${notif.message}</div>
      </div>
    </div>
  `).join('');
}

// Load notifications from storage
function loadNotifications() {
  const saved = localStorage.getItem("notifications");
  if (saved) {
    notifications = JSON.parse(saved);
  }
}

// Render statistics chart
function renderPassStatsChart() {
  if (!passStatsChart) return;

  // Get today's date
  const today = getTodayDate();
  
  // Count passes by year
  const stats = {
    '1': { taken: 0, notTaken: 0 },
    '2': { taken: 0, notTaken: 0 },
    '3': { taken: 0, notTaken: 0 },
    '4': { taken: 0, notTaken: 0 }
  };

  hostellers.forEach(h => {
    if (h.year) {
      if (h.status === 'approved') {
        stats[h.year].taken += 1;
      } else if (h.status === 'declined') {
        stats[h.year].notTaken += 1;
      } else {
        stats[h.year].notTaken += 1;
      }
    }
  });

  const ctx = passStatsChart.getContext('2d');
  
  // Destroy previous chart if it exists
  if (passStatsChartInstance) {
    passStatsChartInstance.destroy();
  }

  passStatsChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
      datasets: [
        {
          label: 'Passes Taken',
          data: [stats['1'].taken, stats['2'].taken, stats['3'].taken, stats['4'].taken],
          backgroundColor: '#22c55e',
          borderColor: '#16a34a',
          borderWidth: 2,
          borderRadius: 6
        },
        {
          label: 'Passes Not Taken',
          data: [stats['1'].notTaken, stats['2'].notTaken, stats['3'].notTaken, stats['4'].notTaken],
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          borderWidth: 2,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: '#ffffff',
            font: { size: 13, weight: 600 },
            padding: 20
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#000000', font: { size: 12 } },
          grid: { color: 'rgba(0,0,0,0.1)' }
        },
        y: {
          ticks: { color: '#000000', font: { size: 12 } },
          grid: { color: 'rgba(0,0,0,0.1)' },
          beginAtZero: true
        }
      }
    }
  });
}

// Initialize - load hostellers on page load
loadHostellers();
loadNotifications();
setTimeout(renderPassStatsChart, 1000);