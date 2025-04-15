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

    // Валидация данных
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
        errorMessage.textContent = 'Пароль должен содержать минимум 5 символов, включая латинские буквы и цифры.';
    }

    if (!isValid) {
        errorMessage.style.display = 'block';
        return; // Прерываем выполнение если валидация не прошла
    }

    // Подготовка данных для отправки
    const formData = {
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        email: email,
        password: password
    };
    
    // Отправка данных на сервер
    fetch('reg.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            sessionStorage.setItem('registrationSuccess', 'true');
            window.location.href = 'login.html';
        }
    })
    })
    .catch(error => {
        errorMessage.textContent = error.error || 'Произошла ошибка при регистрации';
        errorMessage.style.display = 'block';
    });
;

// Функции валидации
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
    return re.test(String(password));
}


