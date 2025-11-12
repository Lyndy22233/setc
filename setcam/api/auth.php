<?php
require_once '../config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['action'])) {
        if ($data['action'] === 'login') {
            $email = $data['email'];
            $password = $data['password'];
            
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && $user['password'] === $password) {
                $_SESSION['user'] = $user;
                echo json_encode(['success' => true, 'user' => $user]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
            }
        }
        elseif ($data['action'] === 'signup') {
            $fullName = $data['fullName'];
            $email = $data['email'];
            $password = $data['password'];
            
            // Check if user already exists
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => false, 'message' => 'User with this email already exists']);
            } else {
                $stmt = $pdo->prepare("INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)");
                $stmt->execute([$fullName, $email, $password]);
                
                // Add activity
                $stmt = $pdo->prepare("INSERT INTO activities (time, description) VALUES (?, ?)");
                $time = date('h:i A');
                $description = "New user registration: $fullName";
                $stmt->execute([$time, $description]);
                
                echo json_encode(['success' => true]);
            }
        }
        elseif ($data['action'] === 'logout') {
            session_destroy();
            echo json_encode(['success' => true]);
        }
    }
}
?>