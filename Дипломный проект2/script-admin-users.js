document.addEventListener('DOMContentLoaded', function() {
    const authData = JSON.parse(sessionStorage.getItem('auth')) || {};
    const usersGrid = document.getElementById('usersGrid');
    const userSearch = document.getElementById('userSearch');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const logoutBtn = document.getElementById('logoutBtn');
    
    let currentPage = 1;
    const usersPerPage = 6;
    let allUsers = [];
    let filteredUsers = [];
    
    // Проверка прав администратора
    if (authData.user?.role !== 'admin') {
        window.location.href = 'profile.html';
        return;
    }
    
    // Загрузка пользователей
    const loadUsers = async (searchTerm = '') => {
        try {
            const response = await fetch('get-all-users.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(authData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                allUsers = data.users;
                filterUsers(searchTerm);
                renderUsers();
            } else {
                console.error('Ошибка загрузки пользователей:', data.error);
                alert('Ошибка загрузки пользователей: ' + data.error);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при загрузке пользователей');
        }
    };
    
    // Фильтрация пользователей
    const filterUsers = (searchTerm = '') => {
        if (!searchTerm) {
            filteredUsers = [...allUsers];
            return;
        }
        
        const term = searchTerm.toLowerCase();
        filteredUsers = allUsers.filter(user => 
            user.id.toString().includes(term) ||
            user.lastName.toLowerCase().includes(term) ||
            user.firstName.toLowerCase().includes(term) ||
            (user.middleName && user.middleName.toLowerCase().includes(term)) ||
            user.email.toLowerCase().includes(term) ||
            user.formatted_date.includes(term)
        );
        
        currentPage = 1; // Сброс на первую страницу при новом поиске
    };
    
    // Отображение пользователей
    const renderUsers = () => {
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        const usersToShow = filteredUsers.slice(startIndex, endIndex);
        
        usersGrid.innerHTML = '';
        
        if (usersToShow.length === 0) {
            usersGrid.innerHTML = '<p style="color: #fff; text-align: center;">Пользователи не найдены</p>';
            return;
        }
        
        usersToShow.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card-admin';
            userCard.innerHTML = `
                <div class="user-avatar-container">
                    <img src="${user.avatar_path || 'images/default-avatar.png'}" alt="Аватар" 
                         class="user-avatar-admin" onerror="this.src='images/default-avatar.png'">
                </div>
                <div class="user-info-admin">
                    <p><strong>ID:</strong> ${user.id}</p>
                    <p><strong>ФИО:</strong> ${user.lastName} ${user.firstName} ${user.middleName || ''}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Дата регистрации:</strong> ${user.formatted_date}</p>
                    <div class="user-role ${user.role}" style="margin-top: 10px;">
                        ${user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                    </div>
                </div>
                <button class="view-profile-btn" data-user-id="${user.id}">
                    Перейти <i class="fas fa-arrow-right"></i>
                </button>
            `;
            usersGrid.appendChild(userCard);
        });
        
        // Обновление информации о странице
        const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
        pageInfo.textContent = `Страница ${currentPage} из ${totalPages || 1}`;
        
        // Блокировка кнопок навигации
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage >= totalPages;
    };
    
    // Обработчики событий
    userSearch.addEventListener('input', (e) => {
        filterUsers(e.target.value);
        renderUsers();
    });
    
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderUsers();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        if (currentPage * usersPerPage < filteredUsers.length) {
            currentPage++;
            renderUsers();
        }
    });
    
    // Делегирование событий для кнопок перехода
    usersGrid.addEventListener('click', (e) => {
        if (e.target.closest('.view-profile-btn')) {
            const userId = e.target.closest('.view-profile-btn').dataset.userId;
            window.location.href = `profile.html?userId=${userId}`;
        }
    });
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('auth');
            window.location.href = 'index.html';
        });
    }
    
    // Загрузка пользователей при старте
    loadUsers();
});