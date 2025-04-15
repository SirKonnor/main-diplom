document.addEventListener('DOMContentLoaded', function() {
document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
        if (this.classList.contains('user-avatar') || this.id === 'avatarPreview') {
            this.src = 'images/default-avatar.png';
        }
    };
});
    const authData = JSON.parse(sessionStorage.getItem('auth')) || {};
    const userInfo = document.getElementById('userInfo');
    const contactInfo = document.getElementById('contactInfo');
    const logoutBtn = document.getElementById('logoutBtn');
    const sidebarBtns = document.querySelectorAll('.sidebar-btn');
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const modal = document.getElementById('editProfileModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const userIcon = document.getElementById('user-icon');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const profileEditForm = document.getElementById('profileEditForm');

    // Функция для форматирования даты
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Не указана';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}.${parts[1]}.${parts[0]}`;
        }
        return dateStr;
    };

    // Функция для обновления интерфейса
    const updateProfileUI = (user) => {
        if (!user) return;
        
        const createSocialLink = (icon, value, baseUrl = '') => {
            if (!value) return `<p><i class="${icon}"></i> Не указано</p>`;
            
            let url = value;
            if (baseUrl) {
                url = baseUrl + (value.startsWith('http') ? '' : value);
            }
            
            return `<p><a href="${url}" target="_blank" rel="noopener noreferrer">
                <i class="${icon}"></i> ${value}
            </a></p>`;
        };
    
        if (userInfo) {
            userInfo.innerHTML = `
                <h2>${user.lastName} ${user.firstName}${user.middleName ? ' ' + user.middleName : ''}</h2>
                <div class="user-role ${user.role}">
                    ${user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                </div>
                <div class="user-social-links">
                    ${createSocialLink('fab fa-whatsapp', user.whatsapp_user, 'https://wa.me/')}
                    ${createSocialLink('fab fa-vk', user.vk_user, 'https://vk.com/')}
                    ${createSocialLink('fab fa-telegram', user.telegram_user, 'https://t.me/')}
                </div>
            `;
        }

    if (contactInfo) {
        contactInfo.innerHTML = `
            <div class="info-item">
                <h4>Телефон</h4>
                <p>${user.phone || 'Не указан'}</p>
            </div>
            <div class="info-item">
                <h4>Email</h4>
                <p>${user.email || 'Не указан'}</p>
            </div>
            <div class="info-item">
                <h4>Адрес</h4>
                <p>${user.address || 'Не указан'}</p>
            </div>
            <div class="info-item">
                <h4>Дата регистрации</h4>
                <p>${user.date_registration ? formatDate(user.date_registration) : 'Не указана'}</p>
            </div>
        `;
    }
    
    // Обновляем аватар
    const avatarImg = document.querySelector('.user-avatar');
    if (avatarImg) {
        avatarImg.src = user.avatar_path || 'images/default-avatar.png';
    }
};

    // Функция для загрузки данных пользователя
    const loadUserData = async () => {
        try {
            if (!authData.user?.email) {
                console.error('Email пользователя не найден');
                return;
            }
    
            const response = await fetch('get-user-data.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: authData.user.email })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Объединяем старые и новые данные
                const mergedUser = {
                    ...authData.user,
                    ...data.user
                };
                
                sessionStorage.setItem('auth', JSON.stringify({
                    isAuthenticated: true,
                    user: mergedUser
                }));
                
                updateProfileUI(mergedUser);
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        }
    };

    // Проверка авторизации
    if (!authData.isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }

    // Показать кнопку администратора только если пользователь - admin
if (authData.user?.role === 'admin') {
    const adminBtn = document.getElementById('adminUsersBtn');
    if (adminBtn) {
        adminBtn.style.display = 'flex'; // или 'block' в зависимости от ваших стилей
        adminBtn.addEventListener('click', () => {
            window.location.href = 'admin-users.html';
        });
    }
}

    // Добавим в обработчики событий после проверки авторизации
if (authData.user?.role === 'admin') {
    const adminUsersBtn = document.getElementById('adminUsersBtn');
    if (adminUsersBtn) {
        adminUsersBtn.addEventListener('click', () => {
            window.location.href = 'admin-users.html';
        });
    }
}

    // Проверяем, есть ли все необходимые данные
if (!authData.user || !authData.user.firstName) {
    loadUserData(); // Загружаем данные если их нет
} else {
    // Проверяем актуальность данных
    fetch('get-user-data.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email: authData.user.email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            sessionStorage.setItem('auth', JSON.stringify({
                isAuthenticated: true,
                user: data.user
            }));
            updateProfileUI(data.user);
        }
    })
    .catch(console.error);
    
    updateProfileUI(authData.user);
}

    // Обработчики событий
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('auth');
            localStorage.removeItem('authEmail');
            window.location.href = 'index.html';
        });
    }

    if (sidebarBtns) {
        sidebarBtns.forEach(btn => {
            if (btn.id !== 'logoutBtn') {
                btn.addEventListener('click', function() {
                    sidebarBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    alert(`Переход в раздел: ${this.title}`);
                });
            }
        });
    }

    if (userIcon) {
        userIcon.href = 'profile.html';
        userIcon.innerHTML = '<i class="fas fa-user-check"></i>';
    }

    // Модальное окно редактирования
    if (editProfileBtn && modal) {
        editProfileBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            document.getElementById('phone').value = authData.user.phone || '';
            document.getElementById('address').value = authData.user.address || '';
            
            // Показываем сохраненный аватар
            const avatarPreview = document.getElementById('avatarPreview');
            if (avatarPreview) {
                avatarPreview.src = authData.user.avatar_path || 'images/default-avatar.png';
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Обработчики для аватара
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', function() {
            document.getElementById('avatarUpload').click();
        });
    }

    if (avatarUpload) {
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

    // Обработчики для паролей
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

    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            const pass1 = document.getElementById('newPassword').value;
            const pass2 = this.value;
            const errorElement = document.getElementById('passwordError');
            
            if (pass1 && pass2 && pass1 !== pass2) {
                if (errorElement) errorElement.textContent = 'Пароли не совпадают!';
            } else if (errorElement) {
                errorElement.textContent = '';
            }
        });
    }

// Замените весь обработчик формы на:
if (profileEditForm) {
    profileEditForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Получаем все элементы формы
        const getElement = (id) => document.getElementById(id);
        
        const elements = {
            phone: getElement('phone'),
            email: getElement('email'),
            address: getElement('address'),
            whatsapp: getElement('whatsapp'),
            vk: getElement('vk'),
            telegram: getElement('telegram'),
            newPassword: getElement('newPassword'),
            confirmPassword: getElement('confirmPassword'),
            avatarPreview: getElement('avatarPreview'),
            submitBtn: this.querySelector('button[type="submit"]')
        };
        
        // Проверка совпадения паролей
        if (elements.newPassword.value && elements.newPassword.value !== elements.confirmPassword.value) {
            alert('Пароли не совпадают!');
            return;
        }
        
        // Сбор данных
        const formData = {
            phone: elements.phone.value,
            address: elements.address.value,
            middleName: elements.middleName.value || null,
            whatsapp: document.getElementById('whatsapp')?.value || null,
            vk: document.getElementById('vk')?.value || null,
            telegram: document.getElementById('telegram')?.value || null,
            avatar: elements.avatarPreview?.src,
            password: elements.newPassword?.value || null
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Ответ сервера:', data);

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

            updateProfileUI(updatedUser);
            alert('Изменения успешно сохранены!');
            modal.style.display = 'none';

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
});