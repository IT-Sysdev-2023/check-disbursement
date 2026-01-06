import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Cv } from '@/types';
import { Head } from '@inertiajs/react';
import { retrievedRecords } from '@/routes';
import CvDetailsSignature from './components/cvDetailsSignature';

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

export default function CheckDetailsCvSignature({ cv }: { cv: { data: Cv } }) {
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV Details" />
            <PageContainer title="CV Details">
                <CvDetailsSignature details={cv.data} />
            </PageContainer>
        </AppLayout>
    );
}
