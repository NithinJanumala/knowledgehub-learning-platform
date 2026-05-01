const API_BASE = 'http://localhost:8081/api';

function getToken() {
  return localStorage.getItem('knowledgehub_token');
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // TEMP FIX: disable auth header
// if (token) {
//   headers['Authorization'] = `Bearer ${token}`;
// }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      return [];
    }
    
    return await response.json();
  } catch (error) {
    return [];
  }
}

// Ensure user role checks across pages
function checkAuth() {
  const userStr = localStorage.getItem('knowledgehub_user');
  if (!userStr) return null;
  return JSON.parse(userStr);
}

function logout() {
  localStorage.removeItem('knowledgehub_token');
  localStorage.removeItem('knowledgehub_user');
  window.location.href = 'index.html';
}

function updateNavigation() {
  const user = checkAuth();
  const navUserSection = document.getElementById('nav-user-section');
  if (!navUserSection) return;

  let adminLink = '';
  let dropdownContent = '';
  
  if (user) {
    if (user.role === 'admin') {
      adminLink = `<li class="nav-item"><a class="nav-link" href="admin.html">Admin</a></li>`;
    }
    dropdownContent = `
        <a href="profile.html"><i class="bi bi-person me-2"></i> Profile</a>
        <a href="settings.html"><i class="bi bi-gear me-2"></i> Settings</a>
        <a href="dashboard.html"><i class="bi bi-speedometer2 me-2"></i> Dashboard</a>
        <hr style="margin: 8px 0; border-color: rgba(255,255,255,0.1);">
        <a href="#" id="logoutBtn" onclick="logout(); return false;"><i class="bi bi-box-arrow-right me-2"></i> Logout</a>
    `;
  } else {
    dropdownContent = `
        <a href="login.html"><i class="bi bi-box-arrow-in-right me-2"></i> Login</a>
        <a href="register.html" class="text-primary fw-bold"><i class="bi bi-person-plus me-2"></i> Sign Up</a>
    `;
  }

  // Get initials or use user icon
  let avatarHTML = `<i class="bi bi-person-circle fs-5"></i>`;
  if (user) {
    let profileData = JSON.parse(localStorage.getItem('userProfile'));
    let name = profileData ? profileData.name : (user.username || user.name || 'U');
    let initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    avatarHTML = `<span class="bg-primary text-dark rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width:28px; height:28px; font-size:12px;">${initials}</span>`;
  }

  navUserSection.innerHTML = `
      ${adminLink}
      <li class="nav-item account-menu ms-2 position-relative">
        <button id="accountBtn" class="btn btn-outline-glass d-flex align-items-center gap-2" style="cursor: pointer; border: 1px solid rgba(255,255,255,0.1);">
            ${avatarHTML}
            <span>Account</span> 
            <i class="bi bi-chevron-down ms-1" id="accountArrow" style="transition: transform 0.3s ease; font-size: 12px;"></i>
        </button>
        <div id="dropdownMenu" class="dropdown">
            ${dropdownContent}
        </div>
      </li>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavigation();

    let closeTimeout;

    // Attach click listener globally if the dropdown exists
    document.addEventListener("click", (e) => {
        const accountBtn = document.getElementById("accountBtn");
        const dropdownMenu = document.getElementById("dropdownMenu");
        const accountArrow = document.getElementById("accountArrow");

        if (accountBtn && dropdownMenu) {
            if (accountBtn.contains(e.target)) {
                e.preventDefault();
                clearTimeout(closeTimeout);
                dropdownMenu.classList.toggle("show");
                if (accountArrow) {
                    accountArrow.style.transform = dropdownMenu.classList.contains("show") ? "rotate(180deg)" : "rotate(0deg)";
                }
            } else if (!dropdownMenu.contains(e.target)) {
                if (dropdownMenu.classList.contains("show")) {
                    closeTimeout = setTimeout(() => {
                        dropdownMenu.classList.remove("show");
                        if (accountArrow) accountArrow.style.transform = "rotate(0deg)";
                    }, 150);
                }
            }
        }
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const dropdownMenu = document.getElementById("dropdownMenu");
            const accountArrow = document.getElementById("accountArrow");
            if (dropdownMenu && dropdownMenu.classList.contains("show")) {
                dropdownMenu.classList.remove("show");
                if (accountArrow) accountArrow.style.transform = "rotate(0deg)";
            }
        }
    });
});
