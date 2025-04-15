<?php
header("Content-Type: application/json");
require_once 'config.php';

session_start();

// Проверка прав администратора через sessionStorage (переданные в заголовках)
$authData = json_decode(file_get_contents('php://input'), true);

if (!$authData || !isset($authData['isAuthenticated']) || !$authData['isAuthenticated'] || $authData['user']['role'] !== 'admin') {
    http_response_code(403);
    die(json_encode(['success' => false, 'error' => 'Доступ запрещен']));
}

try {
    $stmt = $pdo->prepare("SELECT 
    id,
    firstName,
    lastName,
    middleName,
    email,
    role,
    avatar_path,
    DATE_FORMAT(date_registration, '%d.%m.%Y') as formatted_date
    FROM user 
    ORDER BY 
    CASE WHEN role = 'admin' THEN 0 ELSE 1 END,
    date_registration DESC");  // Сортировка по дате регистрации
    
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'users' => $users
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}
?>