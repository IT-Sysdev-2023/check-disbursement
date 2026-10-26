import { router } from '@inertiajs/react';
import {
    CloudUpload,
    DeleteOutline,
    InsertDriveFileOutlined,
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILES = 10;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

interface UploadDepositSlipModalProps {
    open: boolean;
    onClose: () => void;
    /** IDs of the selected cheques the slips belong to */
    chequeIds: number[];
    /** Backend endpoint that receives the upload */
    uploadUrl?: string;
    /** Called after a successful upload (e.g. to clear the row selection) */
    onSuccess?: () => void;
}

const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
        ? `${(bytes / 1024).toFixed(1)} KB`
        : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

export default function UploadDepositSlipModal({
    open,
    onClose,
    chequeIds,
    uploadUrl = '/deposit-slips/upload',
    onSuccess,
}: UploadDepositSlipModalProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [dragging, setDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    // Object URLs for image thumbnails
    const previews = useMemo(
        () =>
            files.map((file) =>
                file.type.startsWith('image/')
                    ? URL.createObjectURL(file)
                    : null,
            ),
        [files],
    );

    useEffect(() => {
        return () => {
            previews.forEach((url) => url && URL.revokeObjectURL(url));
        };
    }, [previews]);

    const reset = () => {
        setFiles([]);
        setError(null);
        setProgress(null);
        setProcessing(false);
        setDragging(false);
    };

    const handleClose = () => {
        if (processing) return;
        reset();
        onClose();
    };

    const addFiles = (incoming: FileList | File[]) => {
        const next = [...files];
        const problems: string[] = [];

        Array.from(incoming).forEach((file) => {
            if (!ACCEPTED_TYPES.includes(file.type)) {
                problems.push(`${file.name}: only JPG, PNG or PDF allowed.`);
            } else if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                problems.push(
                    `${file.name}: exceeds ${MAX_FILE_SIZE_MB} MB limit.`,
                );
            } else if (
                next.some((f) => f.name === file.name && f.size === file.size)
            ) {
                problems.push(`${file.name}: already added.`);
            } else if (next.length >= MAX_FILES) {
                problems.push(`Maximum of ${MAX_FILES} files allowed.`);
            } else {
                next.push(file);
            }
        });

        setFiles(next);
        setError(problems.length ? problems.join(' ') : null);
    };

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    };

    const handleSubmit = () => {
        if (!files.length) {
            setError('Please add at least one deposit slip.');
            return;
        }

        router.post(
            uploadUrl,
            {
                cheque_ids: chequeIds,
                deposit_slips: files,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onStart: () => {
                    setProcessing(true);
                    setError(null);
                },
                onProgress: (event) => setProgress(event?.percentage ?? null),
                onSuccess: () => {
                    reset();
                    onSuccess?.();
                    onClose();
                },
                onError: (errors) => {
                    setError(
                        Object.values(errors).join(' ') ||
                            'Upload failed. Please try again.',
                    );
                },
                onFinish: () => {
                    setProcessing(false);
                    setProgress(null);
                },
            },
        );
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="upload-deposit-slip-title"
        >
            <DialogTitle id="upload-deposit-slip-title">
                Upload Deposit Slips
                <Typography variant="body2" color="text.secondary">
                    {chequeIds.length} cheque{chequeIds.length === 1 ? '' : 's'}{' '}
                    selected
                </Typography>
            </DialogTitle>

            <DialogContent dividers>
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        onClose={() => setError(null)}
                    >
                        {error}
                    </Alert>
                )}

                <Box
                    role="button"
                    tabIndex={0}
                    onClick={() => inputRef.current?.click()}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            inputRef.current?.click();
                        }
                    }}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    sx={{
                        border: '2px dashed',
                        borderColor: dragging ? 'primary.main' : 'divider',
                        bgcolor: dragging ? 'action.hover' : 'transparent',
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'action.hover',
                        },
                    }}
                >
                    <CloudUpload
                        sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
                    />
                    <Typography variant="subtitle1">
                        Drag &amp; drop files here, or click to browse
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        JPG, PNG or PDF · up to {MAX_FILE_SIZE_MB} MB each · max{' '}
                        {MAX_FILES} files
                    </Typography>
                    <input
                        ref={inputRef}
                        type="file"
                        hidden
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => {
                            if (e.target.files) addFiles(e.target.files);
                            e.target.value = ''; // allow re-selecting same file
                        }}
                    />
                </Box>

                {files.length > 0 && (
                    <List dense sx={{ mt: 2 }}>
                        {files.map((file, index) => (
                            <ListItem
                                key={`${file.name}-${file.size}`}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label={`Remove ${file.name}`}
                                        onClick={() => removeFile(index)}
                                        disabled={processing}
                                    >
                                        <DeleteOutline />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar
                                        variant="rounded"
                                        src={previews[index] ?? undefined}
                                    >
                                        <InsertDriveFileOutlined />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={file.name}
                                    secondary={formatSize(file.size)}
                                    slotProps={{
                                        primary: { noWrap: true },
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}

                {processing && (
                    <Box sx={{ mt: 2 }}>
                        <LinearProgress
                            variant={
                                progress !== null ? 'determinate' : 'indeterminate'
                            }
                            value={progress ?? 0}
                        />
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={handleClose} disabled={processing}>
                    Cancel
                </Button>
                <Button
                    startIcon={<CloudUpload />}
                    onClick={handleSubmit}
                    disabled={processing || files.length === 0}
                >
                    {processing ? 'Uploading…' : 'Upload'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}