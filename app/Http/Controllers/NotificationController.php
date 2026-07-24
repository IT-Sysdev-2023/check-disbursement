<?php

namespace App\Http\Controllers;

use App\Models\BusinessUnit;
use App\Models\Cv;
use App\Notifications\NavitionNotification;
use App\Services\GenerateCvService;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->select('id', 'data', 'read_at', 'created_at')
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'data' => $notification->data,
                    'read' => !is_null($notification->read_at),
                    'created_at' => $notification->created_at->diffForHumans(),
                ];
            });
        return Inertia::render('notificationPage', ['records' => $notifications]);
    }
    public function read(Request $request)
    {
        if ($request->markAll) {
            $request->user()->unreadNotifications()->update(['read_at' => now()]);
            return;
        }

        $notification = $request->user()
            ->unreadNotifications()
            ->findOrFail($request->id);

        $notification->markAsRead();
    }
}
