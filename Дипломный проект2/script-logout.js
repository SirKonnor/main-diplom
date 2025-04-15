document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Очищаем все хранилища
        sessionStorage.clear();
        localStorage.clear();
        
        // Отправляем запрос на сервер для очистки токена (если нужно)
        fetch('api/logout.php', {
            method: 'POST',
            credentials: 'same-origin'
        }).then(() => {
            window.location.href = 'index.html';
        });
    });
});

