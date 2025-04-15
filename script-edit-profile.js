document.addEventListener('DOMContentLoaded', function() {
    const authData = JSON.parse(sessionStorage.getItem('auth')) || {};
    const logoutBtn = document.getElementById('logoutBtn');
    const profileEditForm = document.getElementById('profileEditForm');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarUpload = document.getElementById('avatarUpload');

    // Загрузка текущих данных пользователя
    const loadUserData = () => {
        if (!authData.user) return;
        
        document.getElementById('phone').value = authData.user.phone || '';
        document.getElementById('email').value = authData.user.email || '';
        document.getElementById('address').value = authData.user.address || '';
        document.getElementById('whatsapp').value = authData.user.whatsapp_user || '';
        document.getElementById('vk').value = authData.user.vk_user || '';
        document.getElementById('telegram').value = authData.user.telegram_user || '';
        
        const avatarPreview = document.getElementById('avatarPreview');
        if (avatarPreview) {
            avatarPreview.src = authData.user.avatar_path || 'images/default-avatar.png';
        }
    };

    // Проверка авторизации
    if (!authData.isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }

    // Загрузка данных при открытии страницы
    loadUserData();

    // Обработчик выхода
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('auth');
            localStorage.removeItem('authEmail');
            window.location.href = 'index.html';
        });
    }

    // Обработчик изменения аватара
    if (changeAvatarBtn && avatarUpload) {
        changeAvatarBtn.addEventListener('click', function() {
            avatarUpload.click();
        });

        avatarUpload.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const avatarPreview = document.getElementById('avatarPreview');
                    if (avatarPreview) {
                        avatarPreview.src = event.target.result;
                    }
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    }

    // Обработчик отправки формы
    if (profileEditForm) {
        profileEditForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const elements = {
                phone: document.getElementById('phone'),
                email: document.getElementById('email'),
                address: document.getElementById('address'),
                whatsapp: document.getElementById('whatsapp'),
                vk: document.getElementById('vk'),
                telegram: document.getElementById('telegram'),
                newPassword: document.getElementById('newPassword'),
                confirmPassword: document.getElementById('confirmPassword'),
                avatarPreview: document.getElementById('avatarPreview'),
                submitBtn: this.querySelector('button[type="submit"]')
            };

            const formattedWhatsApp = formatWhatsApp(elements.whatsapp.value);

            function formatWhatsApp(number) {
                if (!number) return null;
                // Оставляем только цифры
                return number.replace(/\D/g, '');
            }

            document.getElementById('telegram').addEventListener('input', function() {
                this.value = this.value.replace('@', '');
            });
            
            // Проверка паролей
            if (elements.newPassword.value && elements.newPassword.value !== elements.confirmPassword.value) {
                alert('Пароли не совпадают!');
                return;
            }
            
            // Сбор данных
            const formData = {
                phone: elements.phone.value,
                email: elements.email.value,
                address: elements.address.value,
                whatsapp: formattedWhatsApp,
                vk: elements.vk.value,
                telegram: elements.telegram.value,
                avatar: elements.avatarPreview?.src,
                password: elements.newPassword.value || null
            };
            
            try {
                // Блокируем кнопку
                if (elements.submitBtn) {
                    elements.submitBtn.disabled = true;
                    elements.submitBtn.textContent = 'Сохранение...';
                }

                // Отправляем данные
                const response = await fetch('update-profile.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.error || 'Неизвестная ошибка сервера');
                }

                // Обновляем данные в sessionStorage
                const updatedUser = {
                    ...authData.user,
                    ...data.user,
                    phone: formData.phone,
                    email: formData.email,
                    address: formData.address,
                    whatsapp_user: formData.whatsapp,
                    vk_user: formData.vk,
                    telegram_user: formData.telegram
                };

                sessionStorage.setItem('auth', JSON.stringify({
                    isAuthenticated: true,
                    user: updatedUser
                }));

                alert('Изменения успешно сохранены!');
                window.location.href = 'profile.html';

            } catch (error) {
                console.error('Ошибка сохранения:', error);
                alert(`Ошибка: ${error.message}`);
            } finally {
                if (elements.submitBtn) {
                    elements.submitBtn.disabled = false;
                    elements.submitBtn.textContent = 'Сохранить изменения';
                }
            }
        });
    }

    // Переключение видимости пароля
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });
});