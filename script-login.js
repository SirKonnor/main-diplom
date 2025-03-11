document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let isValid = true;
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!email || !validateEmail(email)) {
        isValid = false;
        errorMessage.textContent = 'Пожалуйста, введите корректный адрес электронной почты.';
    } else if (!password || password.length < 5) {
        isValid = false;
        errorMessage.textContent = 'Пароль должен содержать минимум 5 символов.';
    }

    if (!isValid) {
        errorMessage.style.display = 'block';
    } else {
        if (rememberMe) {
            // Сохранение данных в localStorage
            localStorage.setItem('savedEmail', email);
            localStorage.setItem('savedPassword', password);
        } else {
            // Очистка сохраненных данных
            localStorage.removeItem('savedEmail');
            localStorage.removeItem('savedPassword');
        }
        alert('Вход выполнен успешно!');
        // Здесь можно добавить код для перехода на другую страницу
    }
});
// Заполнение сохраненных данных при загрузке страницы
window.addEventListener('load', function() {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedEmail && savedPassword) {
        document.getElementById('email').value = savedEmail;
        document.getElementById('password').value = savedPassword;
        document.getElementById('rememberMe').checked = true;
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}