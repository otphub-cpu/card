<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $url = $_POST['apk_url'] ?? '';

    if (!empty($url)) {
        $data = ['download_url' => $url];
        if (file_put_contents('config.json', json_encode($data, JSON_PRETTY_PRINT))) {
            echo json_encode(['success' => true, 'message' => 'Link updated successfully!']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to write to config.json. Please check file permissions.']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'URL cannot be empty.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
}
?>
