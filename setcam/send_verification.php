<?php
// send_verification.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Include PHPMailer files
require 'vendor/phpmailer/phpmailer/src/PHPMailer.php';
require 'vendor/phpmailer/phpmailer/src/SMTP.php';
require 'vendor/phpmailer/phpmailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = $input['email'] ?? '';
    $verificationCode = $input['code'] ?? '';
    $name = $input['name'] ?? 'User';
    
    if (empty($email) || empty($verificationCode)) {
        echo json_encode(['success' => false, 'message' => 'Email and code are required']);
        exit;
    }
    
    // Your Gmail configuration
    $smtpConfig = [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => 'anthonyrealiza1@gmail.com',
        'password' => 'oplmlcopoofxicte',
        'from_email' => 'anthonyrealiza1@gmail.com',
        'from_name' => 'SETCAM Emission Center'
    ];
    
    try {
        $result = sendVerificationEmail($email, $name, $verificationCode, $smtpConfig);
        echo json_encode($result);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to send email: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

function sendVerificationEmail($to, $name, $code, $config) {
    $mail = new PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = $config['host'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $config['username'];
        $mail->Password   = $config['password'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $config['port'];
        
        // Recipients
        $mail->setFrom($config['from_email'], $config['from_name']);
        $mail->addAddress($to, $name);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'SETCAM - Email Verification Code';
        
        $emailBody = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; margin: 0; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { background: #800000; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; margin: -30px -30px 20px -30px; }
                .code { font-size: 32px; font-weight: bold; color: #800000; text-align: center; margin: 20px 0; padding: 15px; background: #fff5f5; border-radius: 8px; letter-spacing: 5px; border: 2px dashed #800000; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; text-align: center; }
                .note { background: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 15px 0; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>SETCAM</h1>
                    <p>Smoke Emission Test Center</p>
                </div>
                <h2>Email Verification</h2>
                <p>Hello <strong>$name</strong>,</p>
                <p>Thank you for registering with SETCAM. Please use this verification code:</p>
                <div class='code'>$code</div>
                <div class='note'><strong>Note:</strong> This code expires in 5 minutes.</div>
                <p>If you didn't request this verification, please ignore this email.</p>
                <div class='footer'>
                    <p><strong>SETCAM Emission Center</strong><br>
                    Mintal Road, Davao City, Philippines 8000<br>
                    Phone: (082) 123-4567</p>
                </div>
            </div>
        </body>
        </html>";
        
        $mail->Body = $emailBody;
        $mail->AltBody = "SETCAM Verification Code: $code\n\nHello $name,\n\nYour verification code is: $code\n\nThis code expires in 5 minutes.";
        
        $mail->send();
        
        return [
            'success' => true, 
            'message' => 'Verification email sent successfully!',
            'local_mode' => false
        ];
        
    } catch (Exception $e) {
        return [
            'success' => true, 
            'message' => 'Email service unavailable. Using local verification.',
            'code' => $code,
            'local_mode' => true,
            'error' => $e->getMessage()
        ];
    }
}
?>