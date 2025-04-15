<?php
session_start();
require 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Получаем данные из формы
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';

        // Базовая валидация
        if (empty($email) || empty($password)) {
            throw new Exception('Заполните все поля');
        }

        // Ищем пользователя в БД
        $stmt = $pdo->prepare("SELECT * FROM user WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user) {
            throw new Exception('Пользователь не найден');
        }

        // Проверяем пароль
        if (!password_verify($password, $user['password'])) {
            throw new Exception('Неверный пароль');
        }

        // Формируем ответ
        $response = [
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'firstName' => $user['firstName'],
                'lastName' => $user['lastName'],
                'middleName' => $user['middleName'],
                'role' => $user['role'],
                'date_registration' => $user['date_registration'],
                'avatar_path' => $user['avatar_path'],
                'phone' => $user['phone'],
                'address' => $user['address']
            ]
        ];

        // Сохраняем в PHP сессию
        $_SESSION['user_id'] = $user['id'];

        echo json_encode($response);

    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage()
        ]);
    }
}
?>