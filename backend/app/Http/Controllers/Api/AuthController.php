<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    // Hardcoded admin credentials for CMS
    private $adminEmail = 'admin@dksi.co.id';
    private $adminPassword = 'admin123';
    
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Simple token-based auth (no database)
        if ($request->email === $this->adminEmail && $request->password === $this->adminPassword) {
            return response()->json([
                'status' => 'success',
                'token' => 'dksi-admin-token-' . bin2hex(random_bytes(16)),
                'user' => [
                    'name' => 'DKSI Admin',
                    'email' => $this->adminEmail,
                    'role' => 'admin'
                ]
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Email atau password salah'
        ], 401);
    }

    public function user(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'user' => [
                'name' => 'DKSI Admin',
                'email' => $this->adminEmail,
                'role' => 'admin'
            ]
        ]);
    }
}
