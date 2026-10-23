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
        title: 'Check Details',
        href: '#',
    },
];

export default function CheckDetailsCvSignature({ cheque }: { cheque: any }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Cheque Details" />
            <PageContainer title="Cheque Details">
                <CvDetailsSignature details={cheque.data.checkable} />
            </PageContainer>
        </AppLayout>
    );
}
