import PageContainer from '@/components/pageContainer';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Crf } from '@/types';
import { Head } from '@inertiajs/react';
import CrfDetails from './components/crfDetails';
import { retrievedRecords } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retrieved CV/CRF',
        href: retrievedRecords().url,
    },
    {
        title: 'CRF Details',
        href: '#',
    },
];

export default function CheckDetailsCrf({ crf }: { crf: { data: Crf } }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CRF Details" />
            <PageContainer title="CRF Details">
                <CrfDetails details={crf.data} />
            </PageContainer>
        </AppLayout>
    );
}
