// Примеры данных пользователей
let users = [
    {
        id: 1,
        firstName: "Артем",
        lastName: "Волков",
        age: 25,
        email: "artem.volkov@example.com",
        photo: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
        id: 2,
        firstName: "София",
        lastName: "Зайцева",
        age: 32,
        email: "sofiya.zaytseva@example.com",
        photo: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
        id: 3,
        firstName: "Максим",
        lastName: "Козлов",
        age: 19,
        email: "maksim.kozlov@example.com",
        photo: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
        id: 4,
        firstName: "Анна",
        lastName: "Лебедева",
        age: 28,
        email: "anna.lebedeva@example.com",
        photo: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
        id: 5,
        firstName: "Денис",
        lastName: "Морозов",
        age: 22,
        email: "denis.morozov@example.com",
        photo: "https://randomuser.me/api/portraits/men/5.jpg"
    },
    {
        id: 6,
        firstName: "Виктория",
        lastName: "Новикова",
        age: 35,
        email: "viktoriya.novikova@example.com",
        photo: "https://randomuser.me/api/portraits/women/6.jpg"
    },
    {
        id: 7,
        firstName: "Кирилл",
        lastName: "Павлов",
        age: 17,
        email: "kirill.pavlov@example.com",
        photo: "https://randomuser.me/api/portraits/men/7.jpg"
    },
    {
        id: 8,
        firstName: "Екатерина",
        lastName: "Романова",
        age: 29,
        email: "ekaterina.romanova@example.com",
        photo: "https://randomuser.me/api/portraits/women/8.jpg"
    },
    {
        id: 9,
        firstName: "Александр",
        lastName: "Соколов",
        age: 31,
        email: "alexandr.sokolov@example.com",
        photo: "https://randomuser.me/api/portraits/men/9.jpg"
    },
    {
        id: 10,
        firstName: "Полина",
        lastName: "Тихонова",
        age: 24,
        email: "polina.tikhonova@example.com",
        photo: "https://randomuser.me/api/portraits/women/10.jpg"
    },
    {
        id: 11,
        firstName: "Никита",
        lastName: "Федоров",
        age: 27,
        email: "nikita.fedorov@example.com",
        photo: "https://randomuser.me/api/portraits/men/11.jpg"
    },
    {
        id: 12,
        firstName: "Алиса",
        lastName: "Яковлева",
        age: 20,
        email: "alisa.yakovleva@example.com",
        photo: "https://randomuser.me/api/portraits/women/12.jpg"
    }
];

// Переменные для управления модальным окном
let currentUserId = null;
const modal = document.getElementById('photoModal');
const closeBtn = document.querySelector('.close');

// Загрузка данных из localStorage при наличии
document.addEventListener('DOMContentLoaded', function() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    renderUsers();

    // Обработчики событий для фильтра и сортировки
    document.getElementById('ageFilter').addEventListener('input', function() {
        document.querySelector('.age-filter-value').textContent = this.value;
        renderUsers();
    });

    document.getElementById('sortBy').addEventListener('change', renderUsers);

    // Обработчики для модального окна
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Обработчики для вкладок модального окна
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Обработчики для кнопок модального окна
    document.getElementById('uploadFileBtn').addEventListener('click', handleFileUpload);
    document.getElementById('applyUrlBtn').addEventListener('click', handleUrlApply);
});

// Функция для отображения пользователей
function renderUsers() {
    const usersContainer = document.getElementById('usersContainer');
    const ageFilterValue = parseInt(document.getElementById('ageFilter').value);
    const sortBy = document.getElementById('sortBy').value;

    // Фильтрация пользователей по возрасту
    let filteredUsers = users.filter(user => user.age >= ageFilterValue);

    // Сортировка пользователей
    switch (sortBy) {
        case 'name-asc':
            filteredUsers.sort((a, b) => a.firstName.localeCompare(b.firstName));
            break;
        case 'name-desc':
            filteredUsers.sort((a, b) => b.firstName.localeCompare(a.firstName));
            break;
        case 'age-asc':
            filteredUsers.sort((a, b) => a.age - b.age);
            break;
        case 'age-desc':
            filteredUsers.sort((a, b) => b.age - a.age);
            break;
        default:
            // По умолчанию сортируем по имени по возрастанию
            filteredUsers.sort((a, b) => a.firstName.localeCompare(b.firstName));
    }

    // Очистка контейнера
    usersContainer.innerHTML = '';

    // Добавление пользователей в контейнер
    filteredUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';

        userCard.innerHTML = `
            <div class="user-photo-container">
                <img src="${user.photo}" alt="${user.firstName} ${user.lastName}" class="user-photo" onerror="this.src='https://via.placeholder.com/300x200?text=Фото+не+найдено'">
                <div class="photo-upload" data-user-id="${user.id}">
                    Изменить фото
                </div>
            </div>
            <div class="user-info">
                <h2 class="user-name">${user.firstName} ${user.lastName}</h2>
                <span class="user-age">${user.age} лет</span>
                <p class="user-email">${user.email}</p>
            </div>
        `;

        usersContainer.appendChild(userCard);

        // Обработчик для кнопки изменения фото
        const photoUploadBtn = userCard.querySelector('.photo-upload');
        photoUploadBtn.addEventListener('click', function() {
            openModal(user.id);
        });
    });
}

// Функция для открытия модального окна
function openModal(userId) {
    currentUserId = userId;
    modal.style.display = 'block';
    document.getElementById('photoUrl').value = '';
    document.getElementById('fileUpload').value = '';
    switchTab('upload');
}

// Функция для закрытия модального окна
function closeModal() {
    modal.style.display = 'none';
    currentUserId = null;
}

// Функция для переключения вкладок в модальном окне
function switchTab(tabId) {
    // Убираем активный класс со всех кнопок и контента
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Добавляем активный класс выбранной вкладке
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(`${tabId}Tab`).classList.add('active');
}

// Функция для обработки загрузки файла
function handleFileUpload() {
    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];

    if (!file) {
        alert('Пожалуйста, выберите файл для загрузки');
        return;
    }

    if (!file.type.match('image.*')) {
        alert('Пожалуйста, выберите файл изображения');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        updateUserPhoto(e.target.result);
        closeModal();
    };

    reader.readAsDataURL(file);
}

// Функция для обработки URL изображения
function handleUrlApply() {
    const urlInput = document.getElementById('photoUrl');
    const url = urlInput.value.trim();

    if (!url) {
        alert('Пожалуйста, введите URL изображения');
        return;
    }

    // Проверка, является ли введенный текст валидным URL
    try {
        new URL(url);
        updateUserPhoto(url);
        closeModal();
    } catch (e) {
        alert('Пожалуйста, введите корректный URL');
    }
}

// Функция для обновления фото пользователя
function updateUserPhoto(photoData) {
    if (currentUserId === null) return;

    const userIndex = users.findIndex(user => user.id === currentUserId);
    if (userIndex !== -1) {
        users[userIndex].photo = photoData;

        // Сохранение в localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Перерисовка пользователей
        renderUsers();
    }
}