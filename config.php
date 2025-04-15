<?php
$host = 'localhost'; // обычно 'localhost'
$dbname = 'dizelsiti'; // имя вашей БД
$username = 'root'; // обычно 'root'
$password = ''; // ваш пароль от MySQL
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Ошибка подключения к базе данных: " . $e->getMessage());
}
?>