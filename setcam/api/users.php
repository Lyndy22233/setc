<?php
require_once '../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action']) && $_GET['action'] === 'getStats' && isset($_SESSION['user']) && $_SESSION['user']['role'] === 'admin') {
        // Get total tests today
        $today = date('Y-m-d');
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM appointments WHERE DATE(createdAt) = ? AND status = 'completed'");
        $stmt->execute([$today]);
        $totalTestsToday = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Get registered users
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM users WHERE role = 'user'");
        $stmt->execute();
        $registeredUsers = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Get pending tests
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM appointments WHERE status = 'pending'");
        $stmt->execute();
        $pendingTests = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        echo json_encode([
            'totalTestsToday' => $totalTestsToday,
            'registeredUsers' => $registeredUsers,
            'pendingTests' => $pendingTests
        ]);
    }
}
?>