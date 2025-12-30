import AppLayout from '@/layouts/app-layout';
import { checkReleasing, storeReleaseCheck } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    TextField,
    Typography,
} from '@mui/material';
import { CloudUploadIcon } from 'lucide-react';
import { ChangeEvent, FormEvent, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retrieved CV/CRF',
        href: checkReleasing().url,
    },
    {
        title: 'CV Details',
        href: '#',
    },
];

interface MyFormData {
    causedBy: string;
    receiversName: string;
    file: File | null;
    signature: string | null;
}

export default function ReleaseCheck({
    status,
    label,
    check,
    checkId,
}: {
    status: string;
    label: string;
    check: string;
    checkId: number;
}) {
    const { data, setData, post, errors, reset, processing, transform } =
        useForm<MyFormData>({
            receiversName: '',
            causedBy: '',
            file: null,
            signature: null,
        });


    const sigPadRef = useRef<SignatureCanvas>(null);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData('receiversName', e.target.value);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('file', e.target.files[0]);
        }
    };

    const handleClearSignature = () => {
        sigPadRef.current?.clear();
        setData('signature', null);
    };

    const handleSaveSignature = () => {
        if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
            const canvas = sigPadRef.current.getCanvas();
            setData('signature', canvas.toDataURL('image/png'));
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            status: status,
            id: checkId,
            check: check,
        }));

        post(storeReleaseCheck().url, {
            preserveScroll: true,
            preserveState: true,
            onError: (e) => {
                console.log(e);
            },
            onSuccess: () => {
                reset();
            },
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Release Check" />
            <Typography component="h2" variant="h6" sx={{ mb: 2, pl: 3 }}>
                {label}
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 5,
                        gap: 2,
                        width: '100%',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {/* Text Field */}

                        <TextField
                            label="Receivers Name"
                            variant="outlined"
                            value={data.receiversName}
                            onChange={handleTextChange}
                            error={!!errors.receiversName}
                            helperText={errors.receiversName ?? ' '}
                        />
                        <TextField
                            label={label + ' By'}
                            variant="outlined"
                            value={data.causedBy}
                            onChange={handleTextChange}
                            error={!!errors.causedBy}
                            helperText={errors.causedBy ?? ' '}
                        />

                        {/* File Upload */}
                        <FormControl error={!!errors.file}>
                            <Button
                                variant="contained"
                                component="label"
                                color="secondary"
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload Profile Image
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </Button>

                            {/* Show selected file name */}
                            {data.file && (
                                <Typography sx={{ mt: 1 }}>
                                    {data.file.name}
                                </Typography>
                            )}

                            {/* Error message like TextField helperText */}
                            <FormHelperText>
                                {errors.file ?? ' '}
                            </FormHelperText>
                        </FormControl>
                    </Box>

                    {/* Signature Pad */}
                    <FormControl error={!!errors.signature}>
                        <Box
                            sx={{
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                height: 300,
                                width: '100%',
                            }}
                        >
                            <SignatureCanvas
                                ref={sigPadRef}
                                penColor="black"
                                canvasProps={{
                                    height: 300,
                                    style: {
                                        backgroundColor: 'white',
                                        width: '100%',
                                        display: 'block',
                                    },
                                    className: 'sigCanvas',
                                }}
                            />
                        </Box>
                        {/* Error message like TextField helperText */}
                        <FormHelperText>
                            {errors.signature ?? ' '}
                        </FormHelperText>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                onClick={handleClearSignature}
                            >
                                Clear
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSaveSignature}
                            >
                                Save Signature
                            </Button>
                        </Box>
                    </FormControl>
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        loading={processing}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>

           
        </AppLayout>
    );
}
