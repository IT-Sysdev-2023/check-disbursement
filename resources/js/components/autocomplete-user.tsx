import { Option } from '@/types';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import axios from 'axios';
import { SyntheticEvent, useEffect, useState } from 'react';

interface Employee {
    employee_id: string;
    employee_name: string;
}

export default function AutocompleteUser({
    handleTextChange,
}: {
    handleTextChange: (_: SyntheticEvent, item: Option) => void;
}) {
    const [options, setOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (!inputValue) {
            setOptions([]);
            return;
        }

        const controller = new AbortController();
        const debounce = setTimeout(async () => {
            try {
                setLoading(true);
                const baseURL = import.meta.env.VITE_HRMS_API;
                const response = await axios.get(baseURL, {
                    params: { q: inputValue }, // use one param only
                    signal: controller.signal,
                });

                const employees = response.data?.data?.employee ?? [];
                const formatted = employees.map((item: Employee) => ({
                    id: item.employee_id,
                    label: item.employee_name,
                }));

                setOptions(formatted);
            } catch (error: any) {
                if (error.name !== 'CanceledError') {
                    console.error(error);
                }
            } finally {
                setLoading(false);
            }
        }, 400); // debounce time

        return () => {
            controller.abort(); // cancel previous request
            clearTimeout(debounce);
        };
    }, [inputValue]);

    return (
        <Autocomplete
            freeSolo
            disableClearable
            sx={{ width: 300 }}
            options={options}
            loading={loading}
            filterOptions={(x) => x}
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : (option?.label ?? '')
            }
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            // onInputChange={(_, value) => setInputValue(value)}
            onInputChange={(event, value, reason) => {
                if (reason === 'input') {
                    setInputValue(value);

                    handleTextChange(event as SyntheticEvent, {
                        id: value,
                        label: value,
                    });
                }
            }}
            onChange={(event, value) => {
                if (!value) return;

                const option =
                    typeof value === 'string'
                        ? { id: value, label: value }
                        : value;

                handleTextChange(event, option);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Users"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading && <CircularProgress size={20} />}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}
