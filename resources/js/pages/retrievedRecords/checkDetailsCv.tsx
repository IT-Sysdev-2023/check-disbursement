import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Cv } from '@/types';
import { Head } from '@inertiajs/react';
import CvDetails from './components/cvDetails';
import { retrievedRecords } from '@/routes';

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

export default function CheckDetailsCv({ cv }: { cv: { data: Cv } }) {
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV Details" />
            <PageContainer title="CV Details">
                <CvDetails details={cv.data} />
            </PageContainer>
        </AppLayout>
    );
}
