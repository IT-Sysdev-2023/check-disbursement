import { storeReceiverName } from '@/actions/App/Http/Controllers/CheckReleasingController';
import { modalMediumStyle } from '@/lib/modalStyle';
import { storeReleaseCheck } from '@/routes';
import { Option } from '@/types';
import { router, useForm } from '@inertiajs/react';
import { FormControl, FormHelperText, Grid, IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { CloudUploadIcon, Plus, Trash2 } from 'lucide-react';
import {
    ChangeEvent,
    SyntheticEvent,
    useEffect,
    useRef,
    useState,
} from 'react';
import SignatureCanvas from 'react-signature-canvas';
import AutocompleteUser from './autocomplete-user';

interface MyFormData {
    receiversName: string;
    file: File | null;
    signature: string | null;
}

export default function ReleasingModal({
    cheques,
    open,
    handleClose,
    receiverNames,
}: {
    cheques: { id: number; status: string }[];
    open: boolean;
    handleClose: () => void;
    receiverNames: Option[];
}) {
    const { data, setData, post, errors, reset, processing, transform } =
        useForm<MyFormData>({
            receiversName: '',
            file: null,
            signature: null,
        });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
            const canvas = sigPadRef.current.getCanvas();
            setData('signature', canvas.toDataURL('image/png'));

            transform((data) => ({
                ...data,
                cheques: cheques,
                signature: canvas.toDataURL('image/png'),
            }));

            post(storeReleaseCheck().url, {
                preserveScroll: true,
                preserveState: true,
                onError: (e) => {
                    console.log(e);
                },
                onSuccess: () => {
                    handleClose();
                    reset();
                },
            });
        } else {
            alert('Please sign the cheque before submitting.');
        }
    };
    const handleTextChange = (_: SyntheticEvent, name: Option) => {
        setData('receiversName', name.label);
    };

    const sigPadRef = useRef<SignatureCanvas>(null);
    const sigContainerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 600, height: 180 });

    useEffect(() => {
        const updateCanvasSize = () => {
            if (sigContainerRef.current) {
                setCanvasSize({
                    width: sigContainerRef.current.offsetWidth,
                    height: 300,
                });
            }
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => window.removeEventListener('resize', updateCanvasSize);
    }, []);

    const addUser = () => {
        router.post(storeReceiverName(), {
            name: data.receiversName,
        });
    };

    // const handleClearSignature = () => {
    //     sigPadRef.current?.clear();
    //     setData('signature', null);
    // };

    // const handleSaveSignature = () => {
    //     if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
    //         const canvas = sigPadRef.current.getCanvas();
    //         setData('signature', canvas.toDataURL('image/png'));
    //     }
    // };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('file', e.target.files[0]);
        }
    };

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={
                        modalMediumStyle && {
                            ...modalMediumStyle,
                            width: { xs: '95%', sm: '80%', md: 700 },
                            maxWidth: 900,
                        }
                    }
                >
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        Release Cheque
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Grid
                            container
                            spacing={2}
                            sx={{ mb: 2, width: '100%', mt: 3 }}
                            alignItems="center"
                        >
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Box sx={{ flexGrow: 1 }}>
                                        <AutocompleteUser
                                            recentUsers={receiverNames}
                                            sxWidth={'100%'}
                                            label="Receiver Name"
                                            handleTextChange={handleTextChange}
                                        />
                                    </Box>

                                    <IconButton
                                        color="primary"
                                        onClick={addUser}
                                    >
                                        <Plus size={20} />
                                    </IconButton>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <FormControl error={!!errors.file}>
                                    <Button
                                        variant="contained"
                                        component="label"
                                        color="secondary"
                                        startIcon={<CloudUploadIcon />}
                                    >
                                        Image
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleFileChange}
                                        />
                                    </Button>

                                    {/* Show selected file name */}
                                    {data.file && (
                                        <Box
                                            sx={{
                                                mt: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <Typography variant="body2">
                                                {data.file.name}
                                            </Typography>

                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() =>
                                                    setData('file', null)
                                                }
                                            >
                                                <Trash2 fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}

                                    {/* Error message like TextField helperText */}
                                    <FormHelperText>
                                        {errors.file ?? ' '}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 12 }}>
                                <FormControl error={!!errors.signature}>
                                    <Box
                                        ref={sigContainerRef}
                                        sx={{
                                            border: '1px solid #ccc',
                                            borderRadius: 1,
                                            // height: 300,
                                            width: '100%',
                                        }}
                                    >
                                        <Typography>Signature</Typography>
                                        <SignatureCanvas
                                            ref={sigPadRef}
                                            penColor="black"
                                            canvasProps={{
                                                width: canvasSize.width,
                                                height: canvasSize.height,
                                                style: {
                                                    backgroundColor: 'white',
                                                    display: 'block',
                                                },
                                                className: 'sigCanvas',
                                            }}
                                        />
                                    </Box>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Box sx={{ textAlign: 'right', mt: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                loading={processing}
                            >
                                Submit
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </>
    );
}
