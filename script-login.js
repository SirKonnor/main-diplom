document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    // Проверка авторизации при загрузке страницы
    if (sessionStorage.getItem('auth')) {
        window.location.href = 'profile.html';
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        errorMessage.style.display = 'none';

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;

        // Базовая валидация на клиенте
        if (!email || !password) {
            showError('Заполните все поля');
            return;
        }

        try {
            const response = await fetch('login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Ошибка сервера');
            }

            // Сохраняем данные авторизации
            sessionStorage.setItem('auth', JSON.stringify({
                isAuthenticated: true,
                user: {
                    id: data.user.id,
                    firstName: data.user.first_name,
                    lastName: data.user.last_name,
                    email: data.user.email,
                    phone: data.user.phone,
                    address: data.user.address,
                    date_registration: data.user.date_registration,
                    role: data.user.role,
                    avatar_path: data.user.avatar_path
                }
            }));

            if (rememberMe) {
                localStorage.setItem('authEmail', email);
            }

            // Перенаправляем на главную
            window.location.href = 'index.html';

        } catch (error) {
            showError(error.message || 'Ошибка при авторизации');
            console.error('Ошибка:', error);
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    // Автозаполнение email если есть в localStorage
    const savedEmail = localStorage.getItem('authEmail');
    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
        document.getElementById('rememberMe').checked = true;
    }
});