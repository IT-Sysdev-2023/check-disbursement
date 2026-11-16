<?php

namespace App\Events;

use App\Enums\ProgressStatus;
use App\Helpers\NumberHelper;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReportProgress implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    protected $percentage;
    /**
     * Create a new event instance.
     */
    public function __construct(
        protected string $key,
        protected int $userId,
        protected string $message,
        protected int $currentRow = 0,
        protected int $totalRows = 0,
           protected ProgressStatus $status,
    ) {
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
            new PrivateChannel('report-progress.' . $this->userId),
        ];
    }

    public function broadcastWith()
    {
        return [
            'key' => $this->key,
            'status' => $this->status,
            'message' => $this->message,
            'percentage' => $this->percentage,
            'currentRow' => $this->currentRow,
            'totalRows' => $this->totalRows,
        ];
    }
}
