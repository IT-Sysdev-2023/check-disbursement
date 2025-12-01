import AppLayout from '@/layouts/app-layout';
import { Crf, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Typography } from '@mui/material';
import CrfFields from './components/crfFields';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retrieved CV/CRF',
        href: '#',
        // href: retrievedRecords().url,
    },
    {
        title: 'CV Details',
        href: '#',
    },
];

export default function CrfDetails({ crf }: { crf: { data: Crf } }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV Details" />
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Check Request Form Details
            </Typography>
            <CrfFields crf={crf.data} />
        </AppLayout>
    );
}
