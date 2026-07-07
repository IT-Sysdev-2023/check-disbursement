<?php

namespace App\Events;

use App\Helpers\NumberHelper;
use App\Models\ScannedRecords;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ScannedRecordEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    protected $percentage;
    /**
     * Create a new event instance.
     */
    public function __construct(public ScannedRecords $data, protected int $id) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('scanned-records.' . $this->id),
        ];
    }

    public function broadcastAs()
    {
        return 'scanned-records-event';
    }

    public function broadcastWith()
    {
        return [
            'records' => $this->data,
        ];
    }
}
