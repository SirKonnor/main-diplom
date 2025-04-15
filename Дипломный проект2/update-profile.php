<?php
header("Content-Type: application/json");
require_once 'config.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    die(json_encode(['success' => false, 'error' => 'Unauthorized']));
}

// Получаем ВСЕ данные пользователя перед обновлением
$stmt = $pdo->prepare("SELECT * FROM user WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$current_user = $stmt->fetch(PDO::FETCH_ASSOC);

// Получаем входящие данные
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    die(json_encode(['success' => false, 'error' => 'Invalid input data']));
}

try {
    // Обработка аватара (остаётся без изменений)
    $avatar_path = $current_user['avatar_path'];
    
    if (!empty($input['avatar']) && strpos($input['avatar'], 'data:image') === 0) {
        $upload_dir = 'uploads/avatars/';
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }
        
        $image_data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $input['avatar']));
        $file_name = 'avatar_' . $_SESSION['user_id'] . '_' . time() . '.png';
        $file_path = $upload_dir . $file_name;
        
        if (file_put_contents($file_path, $image_data)) {
            if ($current_user['avatar_path'] && !str_contains($current_user['avatar_path'], 'default-avatar')) {
                @unlink($current_user['avatar_path']);
            }
            $avatar_path = $file_path;
        }
    }

    // Подготовка SQL-запроса с новыми полями
    $sql = "UPDATE user SET 
    phone = :phone,
    email = :email,
    address = :address,
    middleName = :middleName,
    avatar_path = :avatar,
    whatsapp_user = :whatsapp,
    vk_user = :vk,
    telegram_user = :telegram";
    
    if (!empty($input['password'])) {
        $hashed_password = password_hash($input['password'], PASSWORD_BCRYPT);
        $sql .= ", password = :password";
    }
    
    $sql .= " WHERE id = :id";
    
    $stmt = $pdo->prepare($sql);
    $params = [
        ':phone' => $input['phone'] ?? $current_user['phone'],
        ':email' => $input['email'] ?? $current_user['email'],
        ':address' => $input['address'] ?? $current_user['address'],
        ':middleName' => $input['middleName'] ?? $current_user['middleName'],
        ':avatar' => $avatar_path,
        ':whatsapp' => $input['whatsapp'] ?? $current_user['whatsapp_user'],
        ':vk' => $input['vk'] ?? $current_user['vk_user'],
        ':telegram' => $input['telegram'] ?? $current_user['telegram_user'],
        ':id' => $_SESSION['user_id']
    ];
    
    if (!empty($input['password'])) {
        $params[':password'] = $hashed_password;
    }
    
    if (!$stmt->execute($params)) {
        throw new Exception("Failed to update user data");
    }
    
    // Получаем обновлённые данные пользователя
// После успешного выполнения запроса UPDATE добавим:
$stmt = $pdo->prepare("SELECT * FROM user WHERE id = ?");
$stmt->execute([$_SESSION['user_id']]);
$updatedUser = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'user' => [
        'id' => $updatedUser['id'],
        'firstName' => $updatedUser['firstName'],
        'lastName' => $updatedUser['lastName'],
        'middleName' => $updatedUser['middleName'],
        'email' => $updatedUser['email'],
        'phone' => $updatedUser['phone'],
        'address' => $updatedUser['address'],
        'role' => $updatedUser['role'],
        'date_registration' => $updatedUser['date_registration'],
        'avatar_path' => $updatedUser['avatar_path'],
        'whatsapp_user' => $updatedUser['whatsapp_user'],
        'vk_user' => $updatedUser['vk_user'],
        'telegram_user' => $updatedUser['telegram_user']
    ]
]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>