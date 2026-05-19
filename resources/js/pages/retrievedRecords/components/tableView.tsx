import BorrowedCheckModal from '@/components/borrowed-check-modal';
import TableFilter from '@/components/tableFilter';
import { handlePagination, handleSearch, handleSort } from '@/lib/utils';
import OnlySelectionModal from '@/pages/dashboard/components/onlySelectionModal';
import TableDataGrid from '@/pages/dashboard/components/TableDataGrid';
import {
    details,
    detailsCrf,
    getLocation,
    retrievedRecords,
    tagLocation,
} from '@/routes';
import {
    ActionHandler,
    ActionType,
    ChequeType,
    FilterType,
    InertiaPagination,
    SelectionType,
} from '@/types';
import { router } from '@inertiajs/react';
import { LocationOnOutlined } from '@mui/icons-material';
import CallMissedOutgoingOutlinedIcon from '@mui/icons-material/CallMissedOutgoingOutlined';
import {
    Badge,
    Box,
    Button,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import axios from 'axios';
import { FormEvent, useState } from 'react';
import AssignCdModal from './assignCdModal';
import AssignCnModal from './assignCnModal';
import { createChequeColumns } from './columns';

export default function TableView({
    cheques,
    company,
    businessUnits,
    counts,
    filter,
}: {
    cheques: InertiaPagination<ChequeType>;
    company: SelectionType[];
    businessUnits: SelectionType[];
    counts: {
        toAssign: string;
        completed: string;
    };
    filter: FilterType;
}) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [openTagModal, setOpenTagModal] = useState(false);
    const [tagLoading, setTagLoading] = useState(false);
    const [chequeData, setChequeData] = useState<ChequeType | null>(null);
    const [openAssignCnModal, setOpenAssignCnModal] = useState(false);
    const [openAssignCdModal, setOpenAssignCdModal] = useState(false);
    const [location, setLocation] = useState<
        { label: string; value: string }[]
    >([]);
    const [selectedRows, setSelectedRows] = useState<
        { chequeId: number; type: string; id: number }[]
    >([]);
    const [alignment, setAlignment] = useState(filter.assignments);

    const handleSelectionChange = (model: GridRowSelectionModel) => {
        const selectedR = cheques.data
            .filter((row) => model.ids.has(row.id))
            .map((row) => ({
                id: row.id,
                chequeId: row.chequeId,
                type: row.type,
            }));

        setSelectedRows(selectedR);
    };

    const enableButton =
        selectedRows.length > 0 &&
        cheques.data
            .filter((row) => selectedRows.some((r) => r.id === row.id))
            .every((row) => row.taggedAt !== null);
    const enableButtonTag =
        selectedRows.length > 0 &&
        cheques.data
            .filter((row) => selectedRows.some((r) => r.id === row.id))
            .every((row) => row.taggedAt === null && row.checkNumber !== null);

    const actionHandlers: Record<string, ActionHandler> = {
        details: (record) => {
            if (!record) return;
            if (record.type === 'cv') router.visit(details(record.chequeId));
            else router.visit(detailsCrf(record.chequeId));
        },
        assignCn: (record) => {
            setChequeData(record || null);
            setOpenAssignCnModal(true);
        },
        assignCd: (record) => {
            setChequeData(record || null);
            setOpenAssignCdModal(true);
        },
        tag: async (record) => {
            setChequeData(record || null);
            setOpenTagModal(true);
            const { data } = await axios.get(getLocation().url);
            setLocation(data);
        },
    };

    const listTagLocation = async () => {
        setOpenTagModal(true);
        const { data } = await axios.get(getLocation().url);
        setLocation(data);
    };

    const handleTagSubmit = (e: FormEvent) => {
        e.preventDefault();

        const data = chequeData
            ? [
                  {
                      id: chequeData.chequeId,
                      type: chequeData.type,
                  },
              ]
            : selectedRows.map((row) => ({
                  id: row.chequeId,
                  type: row.type,
              }));

        router.put(
            tagLocation(),
            {
                cheques: data,
                locationId: selectedLocation,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onBefore: () => setTagLoading(true),
                onSuccess: () => {
                    setTagLoading(false);
                    setSelectedLocation('');
                    setOpenTagModal(false);
                },
            },
        );
    };

    const handleAssignment = (value: 'completed' | 'toAssign') => {
        router.reload({
            onBefore: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            only: ['cheques'],
            data: {
                assignment: value,
            },
        });
    };

    const handleStatusChange = (value: ActionType, data: ChequeType) => {
        const handler = actionHandlers[value];
        if (handler) handler(data);
    };

    const handleAlignment = (
        _: React.MouseEvent<HTMLElement, MouseEvent>,
        newAlignment: 'completed' | 'toAssign',
    ) => {
        if (newAlignment !== null) {
            handleAssignment(newAlignment);
            setAlignment(newAlignment);
        }
    };

    const chequeColumns = createChequeColumns(handleStatusChange);

    return (
        <>
            <TableFilter
                handleChangeCheck={() => null}
                company={company ?? []}
                businessUnits={businessUnits}
                resetFilterRouter={retrievedRecords()}
                filters={filter}
            >
                <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                >
                    <ToggleButton value="toAssign" aria-label="left aligned">
                        <Badge badgeContent={counts.toAssign} color="error">
                            Assignment
                        </Badge>
                    </ToggleButton>
                    <ToggleButton value="completed" aria-label="centered">
                        <Badge badgeContent={counts.completed} color="error">
                            Completed
                        </Badge>
                    </ToggleButton>
                </ToggleButtonGroup>
            </TableFilter>
            <TableDataGrid
                data={cheques}
                filter={filter.search}
                isLoading={isLoading}
                hasSelection
                handleSelectionChange={handleSelectionChange}
                pagination={handlePagination}
                handleSearchFilter={handleSearch}
                handleSortFilter={handleSort}
                columns={chequeColumns}
            />
            <Box display="flex" justifyContent="flex-end" mt={3} gap={2}>
                <Button
                    disabled={!enableButtonTag}
                    variant="outlined"
                    startIcon={<LocationOnOutlined />}
                    onClick={listTagLocation}
                >
                    Tag Location
                </Button>
                <Button
                    disabled={!enableButton}
                    variant="outlined"
                    startIcon={<CallMissedOutgoingOutlinedIcon />}
                    onClick={() => setOpen(true)}
                >
                    Borrow
                </Button>
            </Box>

            <BorrowedCheckModal
                cheque={selectedRows}
                open={open}
                handleClose={() => setOpen(false)}
            />

            <OnlySelectionModal
                title="Tag Location"
                open={openTagModal}
                // onClose={() => setOpenTagModal(false)}
                 onClose={() => {
                    setChequeData(null);
                    setOpenTagModal(false);
                }}
                handleSubmit={handleTagSubmit}
                handleSelectedItem={(event) =>
                    setSelectedLocation(event.target.value)
                }
                selectedItem={selectedLocation}
                item={location}
                loading={tagLoading}
            />

            {chequeData && (
                <AssignCnModal
                    title="Assign Check Number"
                    open={openAssignCnModal}
                    chequeData={chequeData}
                    onClose={() => setOpenAssignCnModal(false)}
                />
            )}

            {chequeData && (
                <AssignCdModal
                    title="Assign Check Date"
                    open={openAssignCdModal}
                    chequeData={chequeData}
                    onClose={() => setOpenAssignCdModal(false)}
                />
            )}
        </>
    );
}
