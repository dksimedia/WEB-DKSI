<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public CMS (published content only)
Route::get('/cms', function (Request $request) {
    $cmsData = file_exists(storage_path('cms.json'))
        ? json_decode(file_get_contents(storage_path('cms.json')), true)
        : require base_path('database/seeders/cms.seed.php');
    
    return response()->json($cmsData);
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'dksi-backend-laravel',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Auth Routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Helper: Validate token (no DB needed)
$validateToken = function (Request $request) {
    $token = str_replace('Bearer ', '', $request->header('Authorization', ''));
    if (strpos($token, 'dksi-admin-token-') !== 0) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }
    return null;
};

// Contact form (public)
Route::post('/contacts', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:20',
        'category' => 'required|string|max:50',
        'message' => 'required|string|max:5000',
        'institution' => 'nullable|string|max:255',
    ]);

    $file = storage_path('contacts.json');
    $contacts = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    
    $contacts[] = array_merge($validated, ['id' => uniqid(), 'created_at' => now()->toIso8601String()]);
    file_put_contents($file, json_encode($contacts, JSON_PRETTY_PRINT));

    return response()->json(['status' => 'ok', 'message' => 'Kontak berhasil disimpan'], 201);
});

// Admin routes (token-based, no Sanctum)
Route::get('/admin/contacts', function (Request $request) use ($validateToken) {
    $error = $validateToken($request);
    if ($error) return $error;
    
    $file = storage_path('contacts.json');
    $contacts = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    return response()->json($contacts);
});

// Draft CMS (admin)
Route::get('/cms/draft', function (Request $request) use ($validateToken) {
    $error = $validateToken($request);
    if ($error) return $error;
    
    $cmsData = file_exists(storage_path('cms.draft.json'))
        ? json_decode(file_get_contents(storage_path('cms.draft.json')), true)
        : require base_path('database/seeders/cms.seed.php');
    return response()->json($cmsData);
});

// Save draft
Route::put('/cms/draft', function (Request $request) use ($validateToken) {
    $error = $validateToken($request);
    if ($error) return $error;
    
    file_put_contents(storage_path('cms.draft.json'), json_encode($request->all(), JSON_PRETTY_PRINT));
    return response()->json(['status' => 'ok', 'message' => 'Draft tersimpan']);
});

// Publish
Route::post('/cms/publish', function (Request $request) use ($validateToken) {
    $error = $validateToken($request);
    if ($error) return $error;
    
    $draft = file_exists(storage_path('cms.draft.json'))
        ? json_decode(file_get_contents(storage_path('cms.draft.json')), true)
        : require base_path('database/seeders/cms.seed.php');
    
    file_put_contents(storage_path('cms.json'), json_encode($draft, JSON_PRETTY_PRINT));
    return response()->json(['status' => 'ok', 'message' => 'Konten dipublikasikan']);
});
