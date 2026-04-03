<?php
// Configuration for Database Connection

$host = 'MYSQL5045.site4now.net';
$db = 'db_ac78f8_fknews';
$user = 'ac78f8_fknews'; // Change if needed
$pass = 'Mmnnbb112233@';     // Change if needed
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
     PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
     PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
     PDO::ATTR_EMULATE_PREPARES => false,
];

try {
     $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     throw new \PDOException($e->getMessage(), (int) $e->getCode());
}
