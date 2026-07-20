<?php

namespace App\Http\Controllers;

use App\Notifications\NavitionNotification;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Date;
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
    public function notify()
    {
        $user = auth()->user();
        $user->notify(new NavitionNotification());
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
