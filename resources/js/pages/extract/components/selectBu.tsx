import { SelectionType } from '@/types';
import CheckIcon from '@mui/icons-material/Check';
import SearchIcon from '@mui/icons-material/Search';
import {
    InputAdornment,
    ListItemText,
    ListSubheader,
    MenuItem,
    TextField,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Theme, useTheme } from '@mui/material/styles';
import { useMemo, useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    autoFocus: false, // keeps focus on the search field instead of the first item
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight: personName.includes(name)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

export default function SelectBu({
    selectedPermission,
    handleChange,
    permissions,
    label,
    placeholder,
    isAllSelected = false,
    isDisabled = false,
}: {
    isDisabled?: boolean;
    isAllSelected?: boolean;
    placeholder?: string;
    label: string;
    permissions: SelectionType[];
    selectedPermission: string[];
    handleChange: (event: SelectChangeEvent<string[]>) => void;
}) {
    const theme = useTheme();
    const [searchText, setSearchText] = useState('');

    const filteredPermissions = useMemo(() => {
        const query = searchText.trim().toLowerCase();
        if (!query) return permissions;
        return permissions.filter((item) =>
            item.label.toLowerCase().includes(query),
        );
    }, [permissions, searchText]);

    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
                <Select
                    disabled={isDisabled}
                    displayEmpty
                    multiple
                    value={selectedPermission}
                    onChange={handleChange}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                        if (selected.length === 0) {
                            return <em>{placeholder}</em>;
                        }

                        return selected.join(', ');
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ 'aria-label': 'Without label' }}
                    onClose={() => setSearchText('')} // reset search when menu closes
                >
                    {/* Sticky search box */}
                    <ListSubheader sx={{ p: 1, lineHeight: 'normal' }}>
                        <TextField
                            size="small"
                            autoFocus
                            fullWidth
                            placeholder="Search..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                            // Stop the Select from hijacking keystrokes (type-ahead, arrow keys)
                            onKeyDown={(e) => {
                                if (e.key !== 'Escape') {
                                    e.stopPropagation();
                                }
                            }}
                        />
                    </ListSubheader>

                    <MenuItem disabled value="">
                        <em>{placeholder}</em>
                    </MenuItem>

                    {filteredPermissions.length === 0 && (
                        <MenuItem disabled>
                            <em>No results found</em>
                        </MenuItem>
                    )}

                    {filteredPermissions.map((item) => {
                        const isSelected =
                            selectedPermission.indexOf(item.label) > -1;
                        return (
                            <MenuItem
                                key={item.value}
                                value={item.label}
                                disabled={isAllSelected && item.label !== 'All'}
                                style={getStyles(
                                    item.label,
                                    selectedPermission,
                                    theme,
                                )}
                            >
                                <ListItemText primary={item.label} />
                                {isSelected && (
                                    <CheckIcon sx={{ fontSize: 16 }} />
                                )}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        </div>
    );
}