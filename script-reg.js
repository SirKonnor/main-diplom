document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    let isValid = true;
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const middleName = document.getElementById('middleName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!firstName || firstName.length < 2) {
        isValid = false;
        errorMessage.textContent = 'Имя должно содержать минимум 2 символа.';
    } else if (!lastName || lastName.length < 2) {
        isValid = false;
        errorMessage.textContent = 'Фамилия должна содержать минимум 2 символа.';
    } else if (!middleName || middleName.length < 2) {
        isValid = false;
        errorMessage.textContent = 'Отчество должно содержать минимум 2 символа.';
    } else if (!email || !validateEmail(email)) {
        isValid = false;
        errorMessage.textContent = 'Пожалуйста, введите корректный адрес электронной почты.';
    } else if (!password || password.length < 5 || !validatePassword(password)) {
        isValid = false;
        errorMessage.textContent = 'Пароль должен содержать минимум 5 символов, включая буквы и цифры.';
    } else if (!phone || !validatePhone(phone)) {
        isValid = false;
        errorMessage.textContent = 'Пожалуйста, введите корректный номер телефона.';
    }

    if (!isValid) {
        errorMessage.style.display = 'block';
    } else {
        alert('Регистрация прошла успешно!');
        // Здесь можно добавить код для отправки данных на сервер
    }
});


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
    return re.test(String(password));
}

function validatePhone(phone) {
    const re = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    return re.test(String(phone));
}

// Маска для номера телефона
document.getElementById('phone').addEventListener('input', function(event) {
    const input = event.target;
    const value = input.value.replace(/\D/g, '');
    let formattedValue = '+7 (___ ___-__-__';

    if (value.length > 1) {
        const part1 = value.slice(1, 4);
        const part2 = value.slice(4, 7);
        const part3 = value.slice(7, 9);
        const part4 = value.slice(9, 11);

        formattedValue = `+7 (${part1}) ${part2}-${part3}-${part4}`;
    }

    input.value = formattedValue;
});