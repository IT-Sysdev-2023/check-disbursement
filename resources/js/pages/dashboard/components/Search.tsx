import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import * as React from 'react';

type SearchProps = {
    value: string;
    onSearch: (value: string) => void;
};

export default function Search({ onSearch, value }: SearchProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(event.target.value);
    };

    return (
        <FormControl
            sx={{ width: { xs: '100%', md: '25ch' } }}
            variant="outlined"
        >
            <OutlinedInput
                size="small"
                id="search"
                placeholder="Search…"
                value={value}
                onChange={handleChange}
                sx={{ flexGrow: 1 }}
                startAdornment={
                    <InputAdornment
                        position="start"
                        sx={{ color: 'text.primary' }}
                    >
                        <SearchRoundedIcon fontSize="small" />
                    </InputAdornment>
                }
                inputProps={{
                    'aria-label': 'search',
                }}
            />
        </FormControl>
    );
}
