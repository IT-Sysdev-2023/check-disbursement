import SelectItem from '@/pages/dashboard/components/SelectItem';
import { BuType, SelectionType } from '@/types';
import { router } from '@inertiajs/react';

import {
    SelectChangeEvent,
    Stack,
} from '@mui/material';
import Box from '@mui/material/Box';
import {  useState } from 'react';
import CalendarLegend from './calendarLegend';
import Months from './months';

const Calendar = ({
    userId,
    data,
    onChangeTab,
    company,
}: {
    userId: number;
    onChangeTab: () => void;
    data: BuType[];
    company: SelectionType[];
}) => {
    const [selectedCompany, setSelectedCompany] = useState<string>('all');

    const handleChange = async (event: SelectChangeEvent) => {
        const val = event.target.value;
        setSelectedCompany(val);

        router.reload({
            data: {
                company: val,
            },
        });
    };
    return (
        <Box sx={{ mt: 2 }}>
            {/* LEGENDS */}
            <Stack
                direction="row"
                spacing={2}
                justifyContent="space-between"
                sx={{ width: '100%', mb: 2 }}
            >
                <Box sx={{ flex: 1 }}>
                    <SelectItem
                        handleChange={handleChange}
                        value={selectedCompany}
                        title="Filter Company"
                        items={company}
                    />
                </Box>

                <Stack direction="row" spacing={1}>
                    <CalendarLegend color="blue" label="With Records" />
                    <CalendarLegend color="darkRed" label="No Records" />
                    <CalendarLegend color="darkGreen" label="Weekend" />
                    <CalendarLegend color="green" label="Total CRF" />
                    <CalendarLegend color="orange" label="Total CV" />
                </Stack>
            </Stack>

            {/* CALENDAR */}
            {data.length === 0 ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        minHeight: 200,
                    }}
                >
                    NO DATA{' '}
                </Box>
            ) : (
                data.map((buMonths, index) => (
                    <Box
                        key={`${buMonths.business_unit}-${index}`}
                        sx={{ mb: 6 }}
                    >
                        <Box
                            component="span"
                            sx={{
                                 fontSize: '3rem',
                                fontWeight: 'bold',
                            }}
                        >
                            {buMonths.business_unit}
                        </Box>
                        <Months userId={userId} months={buMonths.months} onChangeTab={onChangeTab} />
                    </Box>
                    // <div key={bu.business_unit}>
                    //     <h3>{bu.business_unit}</h3>

                    //     {bu.months.map((m) => (
                    //         <div key={m.month}>{m.month}</div>
                    //     ))}
                    // </div>
                ))
            )}
        </Box>
    );
};

export default Calendar;
