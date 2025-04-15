<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $firstName = trim($data['firstName']);
    $lastName = trim($data['lastName']);
    $middleName = trim($data['middleName']);
    $email = trim($data['email']);
    $password = $data['password'];
    
    // Валидация данных
    if (empty($firstName) || empty($lastName) || empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Все обязательные поля должны быть заполнены']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Некорректный email']);
        exit;
    }
    
    // Проверка, существует ли email
    try {
        $stmt = $pdo->prepare("SELECT id FROM user WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(['error' => 'Пользователь с таким email уже существует']);
            exit;
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка базы данных']);
        exit;
    }
    
    // Хеширование пароля
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // После хеширования пароля
    $role = 'user'; // По умолчанию все новые пользователи - обычные
    
    // Добавление пользователя в БД
    try {
    $stmt = $pdo->prepare("INSERT INTO user (firstName, lastName, middleName, email, password, role) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$firstName, $lastName, $middleName, $email, $hashedPassword, $role]);
        
        http_response_code(201);
        echo json_encode(['success' => 'Пользователь успешно зарегистрирован']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка при регистрации пользователя: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не разрешен']);
}

// Включим логирование ошибок
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Логируем полученные данные
    error_log(print_r($data, true));
    
    $firstName = trim($data['firstName']);
    $lastName = trim($data['lastName']);
    $middleName = trim($data['middleName']);
    $email = trim($data['email']);
    $password = $data['password'];
    
    // После выполнения запроса к БД
    error_log("Пользователь зарегистрирован: " . $email);
    
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не разрешен']);
}
?>