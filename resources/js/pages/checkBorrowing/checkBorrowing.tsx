import PageContainer from '@/components/pageContainer';
import TableFilter from '@/components/tableFilter';
import AppLayout from '@/layouts/app-layout';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import { checkBorrowing } from '@/routes';
import {
    Crf,
    Cv,
    FilterType,
    InertiaPagination,
    SelectionType,
    type BreadcrumbItem,
} from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Box, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { HandCoins } from 'lucide-react';
import { useState } from 'react';
import TableDataGrid from '../dashboard/components/TableDataGrid';
import BorrowCheckModal from './components/borrowCheckModal';
import { createBorrowingChequeColumns } from './components/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Check Borrowing',
        href: '#',
    },
];
type FormData = {
    checks: (string | number)[];
    type: 'include' | 'exclude';
};

export default function CheckBorrowing({
    cheques,
    company,
    filter,
    businessUnits,
}: {
    cheques: InertiaPagination<Cv | Crf>;
    filter: FilterType;
    company: SelectionType[];
    businessUnits: SelectionType[];

}) {
    const [alignment, setAlignment] = useState(filter.tab);
    const [borrowModal, setBorrowModal] = useState(false);
    const { data, setData, put } = useForm<FormData>({
        type: 'include',
        checks: [],
    });
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setAlignment(newAlignment);

        router.reload({
            data: {
                tab: newAlignment,
            },
        });
    };
    const handleSelectionChange = (model: GridRowSelectionModel) => {
        const id = Array.from(model.ids);

        setData({
            checks: id,
            type: model.type,
        });
    };
    const column = createBorrowingChequeColumns();
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CV" />
            <PageContainer title="Check Borrowing">
                <Box display="flex" mt={3}>
                    <ToggleButtonGroup
                        color="primary"
                        value={alignment}
                        exclusive
                        onChange={handleChange}
                        aria-label="Platform"
                    >
                        <ToggleButton value="checks">
                            Checks/ Documents
                        </ToggleButton>
                        <ToggleButton value="borrowed">
                            Borrowed Checks/ Documents
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <TableFilter
                    company={company}
                    filters={filter}
                    handleChangeCheck={() => null}
                    businessUnits={businessUnits}
                    resetFilterRouter={checkBorrowing()}
                />

                <TableDataGrid
                    hasSelection
                    rowId={(row) => row.borrowedCheckId}
                    data={cheques}
                    filter={filter.search}
                    pagination={handlePagination}
                    handleSearchFilter={handleSearch}
                    handleSortFilter={handleSort}
                    handleSelectionChange={handleSelectionChange}
                    columns={column}
                />

                <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                    <Button
                        disabled={
                            data.checks.length === 0 && data.type === 'include'
                        }
                        variant="outlined"
                        startIcon={<HandCoins />}
                        onClick={() => setBorrowModal(true)}
                    >
                        Borrow
                    </Button>
                </Box>

                <BorrowCheckModal
                    cheque={data.checks}
                    type={data.type}
                    open={borrowModal}
                    handleClose={() => setBorrowModal(false)}
                />
            </PageContainer>
        </AppLayout>
    );
}
