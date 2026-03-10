import { SelectionType } from '@/types';
import CheckIcon from '@mui/icons-material/Check';
import { ListItemText, MenuItem } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Theme, useTheme } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
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
                >
                    <MenuItem disabled value="">
                        <em>{placeholder}</em>
                    </MenuItem>
                    {permissions.map((item) => {
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
