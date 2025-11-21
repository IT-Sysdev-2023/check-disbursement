import AppLayout from '@/layouts/app-layout';
import { retrievedRecords } from '@/routes';
import { Cv, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Typography } from '@mui/material';
import CheckForm from './components/checkForm';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retrieved CV/CRF',
        href: retrievedRecords().url,
    },
    {
        title: 'CV Details',
        href: '#',
    },
];

export default function CvDetails({ cv }: { cv: {data:Cv} }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV Details" />
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Check Voucher Details
            </Typography>
            <CheckForm
                cv= {cv.data}
            />
        </AppLayout>
    );
}
