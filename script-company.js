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