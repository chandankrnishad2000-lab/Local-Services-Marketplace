<?php

function loadEnv(string $path): void {
    if (!file_exists($path)) {
        return;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);
        $value = trim($value, "\"'");
        if (!getenv($key)) {
            putenv("{$key}={$value}");
        }
    }
}

loadEnv(__DIR__ . '/../.env');

function db(): PDO {
    static $pdo = null;
    if ($pdo) {
        return $pdo;
    }

    $dbPath = getenv('SQLITE_PATH') ?: (__DIR__ . '/../storage/app.db');
    $dir = dirname($dbPath);
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }

    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec('PRAGMA foreign_keys = ON;');

    $pdo->exec('CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT "CUSTOMER",
        created_at TEXT NOT NULL
    );');

    $pdo->exec('CREATE TABLE IF NOT EXISTS local_pro_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL UNIQUE,
        display_name TEXT NOT NULL,
        company_name TEXT,
        bio TEXT,
        phone TEXT,
        location TEXT,
        service_area TEXT,
        years_experience INTEGER,
        stripe_account_id TEXT,
        verified_at TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );');

    $pdo->exec('CREATE TABLE IF NOT EXISTS service_listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        local_pro_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL DEFAULT 60,
        price_cents INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT "inr",
        location TEXT NOT NULL,
        service_area TEXT,
        highlights TEXT,
        requirements TEXT,
        image_url TEXT,
        status TEXT NOT NULL DEFAULT "ACTIVE",
        created_at TEXT NOT NULL,
        FOREIGN KEY(local_pro_id) REFERENCES users(id) ON DELETE CASCADE
    );');

    $pdo->exec('CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listing_id INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        local_pro_id INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT "PENDING",
        start_at TEXT NOT NULL,
        end_at TEXT NOT NULL,
        total_cents INTEGER NOT NULL,
        tip_cents INTEGER NOT NULL DEFAULT 0,
        notes TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(listing_id) REFERENCES service_listings(id) ON DELETE CASCADE,
        FOREIGN KEY(customer_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY(local_pro_id) REFERENCES users(id) ON DELETE CASCADE
    );');

    $pdo->exec('CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER NOT NULL UNIQUE,
        status TEXT NOT NULL DEFAULT "REQUIRES_PAYMENT",
        amount_cents INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT "inr",
        platform_fee_cents INTEGER NOT NULL DEFAULT 0,
        tip_cents INTEGER NOT NULL DEFAULT 0,
        stripe_checkout_session_id TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    );');

    $pdo->exec('CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER NOT NULL UNIQUE,
        listing_id INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    );');

    $pdo->exec('CREATE TABLE IF NOT EXISTS message_threads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE
    );');

    $pdo->exec('CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        thread_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        body TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(thread_id) REFERENCES message_threads(id) ON DELETE CASCADE
    );');

    $pdo->exec('CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reporter_id INTEGER NOT NULL,
        listing_id INTEGER NOT NULL,
        reason TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT "OPEN",
        created_at TEXT NOT NULL
    );');

    $pdo->exec('CREATE TABLE IF NOT EXISTS otp_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        verified INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
    );');

    return $pdo;
}

function json_response(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function get_json_body(): array {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function now(): string {
    return gmdate('c');
}

function require_auth(): array {
    if (!isset($_SESSION['user_id'])) {
        json_response(['error' => 'Unauthorized.'], 401);
    }
    $stmt = db()->prepare('SELECT * FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user) {
        json_response(['error' => 'Unauthorized.'], 401);
    }
    return $user;
}

function require_role($roles): array {
    $user = require_auth();
    $allowed = is_array($roles) ? $roles : [$roles];
    if (!in_array($user['role'], $allowed, true)) {
        json_response(['error' => 'Forbidden.'], 403);
    }
    return $user;
}
