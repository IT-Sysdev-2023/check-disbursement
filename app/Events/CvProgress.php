<?php

namespace App\Events;

use App\Enums\ProgressStatus;
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
    public function __construct(
        protected int $userId,
        protected string $message,
        protected ProgressStatus $status,
        protected string $tableName = '',
        protected int $currentRow = 0,
        protected int $totalRows = 0,
        protected int $duplicates = 0,
        protected string $key = ''
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
            new PrivateChannel('cv-progress.' . $this->userId),
        ];
    }

    public function broadcastWith()
    {
        return [
            'message' => $this->message,
            'bu' => $this->tableName,
            'percentage' => $this->percentage,
            'currentRow' => $this->currentRow,
            'totalRows' => $this->totalRows,
            'status' => $this->status,
            'key' => $this->key,
            'duplicates' => $this->duplicates,
            // 'isFinished' => $this->isFinished,
            // 'hasNoRecord' => $this->hasNoRecord
        ];
    }
}
