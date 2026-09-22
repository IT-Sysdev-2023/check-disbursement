import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { documentImages } from '@/routes';
import {
    ChequeStatus,
    DateFilterType,
    InertiaPagination,
    type BreadcrumbItem,
} from '@/types';
import { Head } from '@inertiajs/react';
import {
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    ImageList,
    ImageListItem,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { ShieldCloseIcon } from 'lucide-react';
import { useState } from 'react';
import { scannedDocumentsColumn } from './closing/components/columns';
import TableDataGrid from './dashboard/components/TableDataGrid';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Cheques',
        href: '#',
    },
];
export default function ScannedCheques({
    cheques,
    filter,
}: {
    cheques: InertiaPagination<ChequeStatus>;
    filter: {
        selectedCompany: string;
        selectedBu: string;
        search: string;
        date: DateFilterType;
    };
}) {
    const [open, setOpen] = useState(false); // Temporary images for testing
    const [images, setImages] = useState<string[]>([]);

    const handleAction = async (id: number, chequeNumber: string) => {
        const { data } = await axios.get(documentImages().url, {
            params: {
                id: id,
                chequeNumber: chequeNumber,
            },
        });
        setImages(data.images.map((file: { url: string }) => file.url));
        setOpen(true);
    };
    const columns = scannedDocumentsColumn(handleAction);
    const handleClose = () => {
        setOpen(false);
        setImages([]);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Cheques w/ Documents">
                <TableDataGrid
                    data={cheques}
                    filter={filter.search}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    columns={columns}
                />
            </PageContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>
                    Scanned Documents
                    <IconButton
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <ShieldCloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {images.length > 0 ? (
                        <ImageList variant="masonry" cols={3} gap={16}>
                            {images.map((image, index) => (
                                <ImageListItem key={image}>
                                    <Box
                                        component="img"
                                        src={image}
                                        alt={`Document ${index + 1}`}
                                        sx={{
                                            width: '100%',
                                            display: 'block',
                                            borderRadius: 1,
                                            cursor: 'pointer',
                                            transition: '0.2s',
                                            '&:hover': {
                                                opacity: 0.8,
                                                transform: 'scale(1.01)',
                                            },
                                        }}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    ) : (
                        <Box
                            sx={{
                                minHeight: 300,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography color="text.secondary">
                                No Documents
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
