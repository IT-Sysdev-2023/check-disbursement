<?php

namespace App\Events;

use App\Helpers\NumberHelper;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CvProgress implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    protected $percentage;
    /**
     * Create a new event instance.
     */
    public function __construct(protected string $message, protected int $currentRow, protected int $totalRows, protected int $userId)
    {
        //
        $this->percentage = NumberHelper::percentage($currentRow, $totalRows);
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('cv-progress.' . $this->userId),
        ];
    }

    public function broadcastWith() 
    {
        return [
            'message' => $this->message,
            'percentage' => $this->percentage,
            'currentRow' => $this->currentRow,
            'totalRows' => $this->totalRows,
        ];
    }
}
