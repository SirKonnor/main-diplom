<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';

    try {
        $query = "SELECT 
            id,
            firstName,
            lastName,
            middleName,
            email,
            phone,
            address,
            role,
            date_registration,
            avatar_path,
            whatsapp_user,
            vk_user,
            telegram_user
        FROM user WHERE email = ?";


        $stmt = $pdo->prepare($query);
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'firstName' => $user['firstName'],
                    'lastName' => $user['lastName'],
                    'middleName' => $user['middleName'] ?? null, // Добавляем null по умолчанию
                    'email' => $user['email'],
                    'phone' => $user['phone'],
                    'address' => $user['address'],
                    'role' => $user['role'],
                    'date_registration' => $user['date_registration'],
                    'avatar_path' => $user['avatar_path'],
                    'whatsapp_user' => $user['whatsapp_user'] ?? null,
                    'vk_user' => $user['vk_user'] ?? null,
                    'telegram_user' => $user['telegram_user'] ?? null
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'error' => 'User not found']);
        }
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false, 
            'error' => 'Database error: ' . $e->getMessage()
        ]);
    }
}
?>