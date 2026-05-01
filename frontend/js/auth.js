function showAlert(message, type = 'danger') {
    const alertBox = document.getElementById('alert-box');
    alertBox.className = `alert alert-${type}`;
    alertBox.textContent = message;
    alertBox.classList.remove('d-none');
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const data = await apiFetch('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });

                localStorage.setItem('knowledgehub_token', data.token);
                localStorage.setItem('knowledgehub_user', JSON.stringify(data.user));
                
                window.location.href = data.user.role === 'admin' ? 'admin.html' : 'dashboard.html';
            } catch (err) {
                showAlert(err.message);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const data = await apiFetch('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ name, email, password })
                });

                localStorage.setItem('knowledgehub_token', data.token);
                localStorage.setItem('knowledgehub_user', JSON.stringify(data.user));
                
                window.location.href = 'dashboard.html';
            } catch (err) {
                showAlert(err.message);
            }
        });
    }
});
