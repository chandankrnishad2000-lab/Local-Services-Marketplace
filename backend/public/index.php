<?php

require __DIR__ . '/../src/bootstrap.php';

session_name('localpulse_session');
session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = getenv('FRONTEND_ORIGIN') ?: 'http://localhost:3000';
if ($origin === $allowedOrigin) {
    header("Access-Control-Allow-Origin: {$origin}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if (str_starts_with($path, '/api/auth/register') && $method === 'POST') {
    $payload = get_json_body();
    if (empty($payload['name']) || empty($payload['email']) || empty($payload['password'])) {
        json_response(['error' => 'Invalid input.'], 400);
    }

    $role = $payload['role'] ?? 'CUSTOMER';
    if (!in_array($role, ['CUSTOMER', 'LOCAL_PRO'], true)) {
        $role = 'CUSTOMER';
    }

    $stmt = db()->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$payload['email']]);
    if ($stmt->fetch()) {
        json_response(['error' => 'Email already registered.'], 409);
    }

    $hash = password_hash($payload['password'], PASSWORD_BCRYPT);
    $stmt = db()->prepare('INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$payload['name'], $payload['email'], $hash, $role, now()]);
    $userId = db()->lastInsertId();

    if ($role === 'LOCAL_PRO') {
        $stmt = db()->prepare('INSERT INTO local_pro_profiles (user_id, display_name, created_at) VALUES (?, ?, ?)');
        $stmt->execute([$userId, $payload['name'], now()]);
    }

    $_SESSION['user_id'] = (int)$userId;
    json_response(['id' => (int)$userId, 'role' => $role]);
}

if (str_starts_with($path, '/api/auth/login') && $method === 'POST') {
    $payload = get_json_body();
    if (empty($payload['email']) || empty($payload['password'])) {
        json_response(['error' => 'Invalid input.'], 400);
    }

    $stmt = db()->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$payload['email']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($payload['password'], $user['password_hash'])) {
        json_response(['error' => 'Invalid credentials.'], 401);
    }

    $_SESSION['user_id'] = (int)$user['id'];
    json_response(['id' => (int)$user['id'], 'role' => $user['role']]);
}

if (str_starts_with($path, '/api/auth/logout') && $method === 'POST') {
    session_destroy();
    json_response(['ok' => true]);
}

if (str_starts_with($path, '/api/auth/me') && $method === 'GET') {
    if (!isset($_SESSION['user_id'])) {
        json_response(['user' => null]);
    }

    $stmt = db()->prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    json_response(['user' => $user]);
}

if (str_starts_with($path, '/api/auth/otp/request') && $method === 'POST') {
    $payload = get_json_body();
    $email = $payload['email'] ?? '';
    if (!$email) {
        json_response(['error' => 'Email required.'], 400);
    }

    $code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $expires = (new DateTime('+10 minutes'))->format('c');

    $stmt = db()->prepare('INSERT INTO otp_codes (email, code, expires_at, verified, created_at) VALUES (?, ?, ?, 0, ?)');
    $stmt->execute([$email, $code, $expires, now()]);

    json_response([
        'message' => 'OTP sent (dummy).',
        'expiresAt' => $expires,
        'code' => $code
    ]);
}

if (str_starts_with($path, '/api/auth/otp/verify') && $method === 'POST') {
    $payload = get_json_body();
    $email = $payload['email'] ?? '';
    $code = $payload['code'] ?? '';
    if (!$email || !$code) {
        json_response(['error' => 'Invalid input.'], 400);
    }

    $stmt = db()->prepare('SELECT * FROM otp_codes WHERE email = ? AND code = ? AND verified = 0 ORDER BY id DESC LIMIT 1');
    $stmt->execute([$email, $code]);
    $otp = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$otp) {
        json_response(['error' => 'Invalid OTP.'], 400);
    }

    if (strtotime($otp['expires_at']) < time()) {
        json_response(['error' => 'OTP expired.'], 400);
    }

    $stmt = db()->prepare('UPDATE otp_codes SET verified = 1 WHERE id = ?');
    $stmt->execute([$otp['id']]);

    $stmt = db()->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user) {
        $stmt = db()->prepare('INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute(['OTP User', $email, password_hash(bin2hex(random_bytes(8)), PASSWORD_BCRYPT), 'CUSTOMER', now()]);
        $userId = db()->lastInsertId();
        $user = [
            'id' => (int)$userId,
            'role' => 'CUSTOMER'
        ];
    }

    $_SESSION['user_id'] = (int)$user['id'];
    json_response(['id' => (int)$user['id'], 'role' => $user['role']]);
}

if ($path === '/api/listings' && $method === 'GET') {
    $q = $_GET['q'] ?? '';
    $category = $_GET['category'] ?? '';
    $location = $_GET['location'] ?? '';
    $minPrice = $_GET['minPrice'] ?? '';
    $maxPrice = $_GET['maxPrice'] ?? '';

    $conditions = ['l.status = "ACTIVE"'];
    $params = [];

    if ($category) {
        $conditions[] = 'l.category = ?';
        $params[] = $category;
    }
    if ($location) {
        $conditions[] = 'l.location LIKE ?';
        $params[] = '%' . $location . '%';
    }
    if ($q) {
        $conditions[] = '(l.title LIKE ? OR l.description LIKE ?)';
        $params[] = '%' . $q . '%';
        $params[] = '%' . $q . '%';
    }
    if ($minPrice !== '') {
        $conditions[] = 'l.price_cents >= ?';
        $params[] = (int)$minPrice;
    }
    if ($maxPrice !== '') {
        $conditions[] = 'l.price_cents <= ?';
        $params[] = (int)$maxPrice;
    }

    $where = implode(' AND ', $conditions);

    $stmt = db()->prepare(
        'SELECT l.*, u.name as localProName, AVG(r.rating) as avgRating, COUNT(r.id) as reviewCount
         FROM service_listings l
         JOIN users u ON l.local_pro_id = u.id
         LEFT JOIN reviews r ON r.listing_id = l.id
         WHERE ' . $where . '
         GROUP BY l.id
         ORDER BY l.created_at DESC
         LIMIT 24'
    );
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $listings = array_map(function ($row) {
        $row['highlights'] = $row['highlights'] ? json_decode($row['highlights'], true) : [];
        $row['requirements'] = $row['requirements'] ? json_decode($row['requirements'], true) : [];
        $row['rating'] = $row['avgRating'] ? (float)$row['avgRating'] : null;
        $row['reviewCount'] = (int)$row['reviewCount'];
        return $row;
    }, $rows);

    json_response(['listings' => $listings]);
}

if ($path === '/api/listings' && $method === 'POST') {
    $user = require_role('LOCAL_PRO');
    $payload = get_json_body();

    $required = ['title', 'description', 'category', 'location', 'priceCents'];
    foreach ($required as $field) {
        if (empty($payload[$field])) {
            json_response(['error' => 'Invalid input.'], 400);
        }
    }

    $stmt = db()->prepare('INSERT INTO service_listings (local_pro_id, title, description, category, duration_minutes, price_cents, currency, location, service_area, highlights, requirements, image_url, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, "ACTIVE", ?)');
    $stmt->execute([
        $user['id'],
        $payload['title'],
        $payload['description'],
        $payload['category'],
        (int)($payload['durationMinutes'] ?? 60),
        (int)$payload['priceCents'],
        $payload['currency'] ?? 'inr',
        $payload['location'],
        $payload['serviceArea'] ?? null,
        json_encode(array_filter(array_map('trim', preg_split('/[\n,]/', (string)($payload['highlights'] ?? ''))))),
        json_encode(array_filter(array_map('trim', preg_split('/[\n,]/', (string)($payload['requirements'] ?? ''))))),
        $payload['imageUrl'] ?? null,
        now()
    ]);

    json_response(['id' => (int)db()->lastInsertId()]);
}

if (preg_match('#^/api/listings/(\d+)$#', $path, $matches)) {
    $listingId = (int)$matches[1];

    if ($method === 'GET') {
        $stmt = db()->prepare('SELECT l.*, u.name as localProName, AVG(r.rating) as avgRating, COUNT(r.id) as reviewCount FROM service_listings l JOIN users u ON l.local_pro_id = u.id LEFT JOIN reviews r ON r.listing_id = l.id WHERE l.id = ? GROUP BY l.id');
        $stmt->execute([$listingId]);
        $listing = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$listing) {
            json_response(['error' => 'Not found.'], 404);
        }
        $listing['highlights'] = $listing['highlights'] ? json_decode($listing['highlights'], true) : [];
        $listing['requirements'] = $listing['requirements'] ? json_decode($listing['requirements'], true) : [];
        $listing['rating'] = $listing['avgRating'] ? (float)$listing['avgRating'] : null;
        $listing['reviewCount'] = (int)$listing['reviewCount'];
        json_response(['listing' => $listing]);
    }

    if (in_array($method, ['PUT', 'PATCH'], true)) {
        $user = require_role('LOCAL_PRO');
        $payload = get_json_body();
        $stmt = db()->prepare('SELECT * FROM service_listings WHERE id = ?');
        $stmt->execute([$listingId]);
        $listing = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$listing || (int)$listing['local_pro_id'] !== (int)$user['id']) {
            json_response(['error' => 'Forbidden.'], 403);
        }

        $stmt = db()->prepare('UPDATE service_listings SET title = ?, description = ?, category = ?, duration_minutes = ?, price_cents = ?, currency = ?, location = ?, service_area = ?, highlights = ?, requirements = ?, image_url = ? WHERE id = ?');
        $stmt->execute([
            $payload['title'] ?? $listing['title'],
            $payload['description'] ?? $listing['description'],
            $payload['category'] ?? $listing['category'],
            $payload['durationMinutes'] ?? $listing['duration_minutes'],
            $payload['priceCents'] ?? $listing['price_cents'],
            $payload['currency'] ?? $listing['currency'],
            $payload['location'] ?? $listing['location'],
            $payload['serviceArea'] ?? $listing['service_area'],
            json_encode($payload['highlights'] ?? json_decode($listing['highlights'], true) ?? []),
            json_encode($payload['requirements'] ?? json_decode($listing['requirements'], true) ?? []),
            $payload['imageUrl'] ?? $listing['image_url'],
            $listingId
        ]);
        json_response(['ok' => true]);
    }

    if ($method === 'DELETE') {
        $user = require_role('LOCAL_PRO');
        $stmt = db()->prepare('SELECT * FROM service_listings WHERE id = ?');
        $stmt->execute([$listingId]);
        $listing = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$listing || (int)$listing['local_pro_id'] !== (int)$user['id']) {
            json_response(['error' => 'Forbidden.'], 403);
        }
        db()->prepare('DELETE FROM service_listings WHERE id = ?')->execute([$listingId]);
        json_response(['ok' => true]);
    }
}

if ($path === '/api/bookings' && $method === 'GET') {
    $user = require_auth();
    $stmt = db()->prepare('SELECT b.*, l.title as listingTitle, l.currency as listingCurrency, p.status as paymentStatus FROM bookings b JOIN service_listings l ON b.listing_id = l.id LEFT JOIN payments p ON b.id = p.booking_id WHERE b.customer_id = ? OR b.local_pro_id = ? ORDER BY b.created_at DESC');
    $stmt->execute([$user['id'], $user['id']]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    json_response(['bookings' => $rows]);
}

if ($path === '/api/bookings' && $method === 'POST') {
    $user = require_role('CUSTOMER');
    $payload = get_json_body();

    if (empty($payload['listingId']) || empty($payload['startAt']) || empty($payload['endAt'])) {
        json_response(['error' => 'Invalid input.'], 400);
    }

    $stmt = db()->prepare('SELECT * FROM service_listings WHERE id = ?');
    $stmt->execute([(int)$payload['listingId']]);
    $listing = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$listing || $listing['status'] !== 'ACTIVE') {
        json_response(['error' => 'Listing not available.'], 404);
    }

    $tipCents = isset($payload['tipCents']) ? (int)$payload['tipCents'] : 0;

    $stmt = db()->prepare('INSERT INTO bookings (listing_id, customer_id, local_pro_id, status, start_at, end_at, total_cents, tip_cents, notes, created_at) VALUES (?, ?, ?, "PENDING", ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $listing['id'],
        $user['id'],
        $listing['local_pro_id'],
        $payload['startAt'],
        $payload['endAt'],
        $listing['price_cents'],
        $tipCents,
        $payload['notes'] ?? null,
        now()
    ]);

    $bookingId = (int)db()->lastInsertId();

    $stmt = db()->prepare('INSERT INTO payments (booking_id, status, amount_cents, currency, platform_fee_cents, tip_cents, created_at) VALUES (?, "REQUIRES_PAYMENT", ?, ?, 0, ?, ?)');
    $stmt->execute([$bookingId, $listing['price_cents'] + $tipCents, $listing['currency'], $tipCents, now()]);

    $stmt = db()->prepare('INSERT INTO message_threads (booking_id, created_at) VALUES (?, ?)');
    $stmt->execute([$bookingId, now()]);

    json_response(['bookingId' => $bookingId]);
}

if (preg_match('#^/api/bookings/(\d+)$#', $path, $matches)) {
    $bookingId = (int)$matches[1];

    if ($method === 'GET') {
        $user = require_auth();
        $stmt = db()->prepare('SELECT b.*, l.title as listingTitle, l.currency as listingCurrency, p.status as paymentStatus, u.name as customerName, lp.name as localProName FROM bookings b JOIN service_listings l ON b.listing_id = l.id LEFT JOIN payments p ON b.id = p.booking_id JOIN users u ON b.customer_id = u.id JOIN users lp ON b.local_pro_id = lp.id WHERE b.id = ?');
        $stmt->execute([$bookingId]);
        $booking = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$booking) {
            json_response(['error' => 'Not found.'], 404);
        }
        if ((int)$booking['customer_id'] !== (int)$user['id'] && (int)$booking['local_pro_id'] !== (int)$user['id'] && $user['role'] !== 'ADMIN') {
            json_response(['error' => 'Forbidden.'], 403);
        }
        json_response(['booking' => $booking]);
    }

    if ($method === 'PATCH') {
        $user = require_role(['LOCAL_PRO', 'ADMIN']);
        $payload = get_json_body();
        $status = $payload['status'] ?? null;
        if (!$status) {
            json_response(['error' => 'Missing status.'], 400);
        }
        $stmt = db()->prepare('SELECT * FROM bookings WHERE id = ?');
        $stmt->execute([$bookingId]);
        $booking = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$booking) {
            json_response(['error' => 'Not found.'], 404);
        }
        if ($user['role'] === 'LOCAL_PRO' && (int)$booking['local_pro_id'] !== (int)$user['id']) {
            json_response(['error' => 'Forbidden.'], 403);
        }
        $stmt = db()->prepare('UPDATE bookings SET status = ? WHERE id = ?');
        $stmt->execute([$status, $bookingId]);
        json_response(['ok' => true]);
    }
}

if ($path === '/api/stripe/checkout' && $method === 'POST') {
    $user = require_role('CUSTOMER');
    $payload = get_json_body();
    $bookingId = $payload['bookingId'] ?? null;
    if (!$bookingId) {
        json_response(['error' => 'Missing bookingId.'], 400);
    }

    $stmt = db()->prepare('SELECT * FROM payments WHERE booking_id = ?');
    $stmt->execute([(int)$bookingId]);
    $payment = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($payment) {
        $stmt = db()->prepare('UPDATE payments SET status = "PAID" WHERE booking_id = ?');
        $stmt->execute([(int)$bookingId]);
    }

    json_response(['url' => null, 'message' => 'Dummy checkout complete']);
}

if ($path === '/api/stripe/connect' && $method === 'POST') {
    $user = require_role('LOCAL_PRO');
    $dummyAccount = 'acct_dummy_' . $user['id'];
    $stmt = db()->prepare('UPDATE local_pro_profiles SET stripe_account_id = ? WHERE user_id = ?');
    $stmt->execute([$dummyAccount, $user['id']]);
    json_response(['ok' => true, 'accountId' => $dummyAccount]);
}

if ($path === '/api/stripe/webhook' && $method === 'POST') {
    json_response(['received' => true]);
}

if ($path === '/api/reviews' && $method === 'POST') {
    $user = require_role('CUSTOMER');
    $payload = get_json_body();
    if (empty($payload['bookingId']) || empty($payload['rating'])) {
        json_response(['error' => 'Invalid input.'], 400);
    }

    $stmt = db()->prepare('SELECT * FROM bookings WHERE id = ?');
    $stmt->execute([(int)$payload['bookingId']]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$booking || (int)$booking['customer_id'] !== (int)$user['id']) {
        json_response(['error' => 'Booking not found.'], 404);
    }

    $stmt = db()->prepare('INSERT INTO reviews (booking_id, listing_id, customer_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $booking['id'],
        $booking['listing_id'],
        $user['id'],
        (int)$payload['rating'],
        $payload['comment'] ?? null,
        now()
    ]);

    json_response(['ok' => true]);
}

if ($path === '/api/messages' && $method === 'GET') {
    $user = require_auth();
    $threadId = $_GET['threadId'] ?? null;
    if (!$threadId) {
        json_response(['error' => 'Missing threadId'], 400);
    }

    $stmt = db()->prepare('SELECT m.*, u.name as senderName FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.thread_id = ? ORDER BY m.created_at ASC');
    $stmt->execute([(int)$threadId]);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    json_response(['messages' => $messages]);
}

if ($path === '/api/messages' && $method === 'POST') {
    $user = require_auth();
    $payload = get_json_body();
    if (empty($payload['threadId']) || empty($payload['body'])) {
        json_response(['error' => 'Invalid input.'], 400);
    }

    $stmt = db()->prepare('INSERT INTO messages (thread_id, sender_id, body, created_at) VALUES (?, ?, ?, ?)');
    $stmt->execute([(int)$payload['threadId'], $user['id'], $payload['body'], now()]);
    json_response(['ok' => true]);
}

if ($path === '/api/reports' && $method === 'GET') {
    $user = require_role('ADMIN');
    $stmt = db()->query('SELECT r.*, l.title as listingTitle, u.name as reporterName FROM reports r JOIN service_listings l ON r.listing_id = l.id JOIN users u ON r.reporter_id = u.id ORDER BY r.created_at DESC LIMIT 10');
    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);
    json_response(['reports' => $reports]);
}

json_response(['error' => 'Not found.'], 404);
