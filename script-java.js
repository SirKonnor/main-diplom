// Проверяем авторизацию при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const authData = JSON.parse(sessionStorage.getItem('auth') || '{}');
    const userIcon = document.getElementById('user-icon');
    
    if (authData.isAuthenticated) {
        userIcon.href = 'profile.html';
        // Можно добавить визуальное отображение
        userIcon.innerHTML = '<i class="fas fa-user-check"></i>';
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const elements = document.querySelectorAll('.hidden');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1 // Элемент будет считаться видимым, когда 10% его площади находится в области видимости
    });

    elements.forEach(element => {
        observer.observe(element);
    });
});

document.addEventListener("DOMContentLoaded", function() {
const toggleButtons = document.querySelectorAll(".toggle-details");
const closeButtons = document.querySelectorAll(".close-details");

toggleButtons.forEach(button => {
button.addEventListener("click", function() {
    const advantageBlock = this.closest(".advantage");
    const details = advantageBlock.querySelector(".details");
    const icon = this.querySelector("i");

    // Закрываем все открытые блоки, кроме текущего
    document.querySelectorAll(".advantage .details.open").forEach(openDetails => {
        if (openDetails !== details) {
            openDetails.classList.remove("open");
            const openIcon = openDetails.closest(".advantage").querySelector(".toggle-details i");
            openIcon.classList.remove("fa-chevron-up");
            openIcon.classList.add("fa-chevron-down");
        }
    });

    // Переключаем текущий блок
    details.classList.toggle("open");

    // Поворот стрелки
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
});
});

closeButtons.forEach(button => {
button.addEventListener("click", function(event) {
    event.stopPropagation(); // Останавливаем всплытие события
    const details = this.closest(".details");
    details.classList.remove("open");

    // Возврат стрелки в исходное состояние
    const toggleButton = details.closest(".advantage").querySelector(".toggle-details");
    const icon = toggleButton.querySelector("i");
    icon.classList.remove("fa-chevron-up");
    icon.classList.add("fa-chevron-down");
});
});
});

// Проверяем, была ли успешная регистрация
if (sessionStorage.getItem('registrationSuccess')) {
    const notification = document.getElementById('notification-reg');

    // Показываем уведомление с анимацией
    notification.classList.add('show');

    // Убираем уведомление через 5 секунд с анимацией
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');

        // Удаляем элемент из DOM после завершения анимации
        setTimeout(() => {
            notification.remove();
        }, 500); // Время анимации исчезновения
    }, 5000); // Уведомление видно 5 секунд

    // Удаляем информацию о успешной регистрации из sessionStorage
    sessionStorage.removeItem('registrationSuccess');
}

if (sessionStorage.getItem('loginSuccess')) {
    const notification = document.getElementById('notification-login');

    // Показываем уведомление с анимацией
    notification.classList.add('show');

    // Убираем уведомление через 5 секунд с анимацией
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');

        // Удаляем элемент из DOM после завершения анимации
        setTimeout(() => {
            notification.remove();
        }, 500); // Время анимации исчезновения
    }, 5000); // Уведомление видно 5 секунд

    // Удаляем информацию о успешной авторизации из sessionStorage
    sessionStorage.removeItem('loginSuccess');
}

// Проверяем авторизацию при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const authData = JSON.parse(sessionStorage.getItem('auth') || '{}');
    const userIcon = document.getElementById('user-icon');
    
    if (authData.isAuthenticated) {
        userIcon.href = 'profile.html';
        // Можно добавить визуальное отображение
        userIcon.innerHTML = '<i class="fas fa-user-check"></i>';
    }
});

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        updateUserIcon();
    }
});