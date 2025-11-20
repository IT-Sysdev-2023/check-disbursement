import { Permission } from '@/types';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
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

export default function PermissionSelection({
    selectedPermission,
    handleChange,
    permissions,
}: {
    permissions: Permission[];
    selectedPermission: string[];
    handleChange: (event: SelectChangeEvent<string[]>) => void;
}) {
    const theme = useTheme();

    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-chip-label">
                    Permission
                </InputLabel>
                <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={selectedPermission}
                    onChange={handleChange}
                    input={
                        <OutlinedInput id="select-multiple-chip" label="Chip" />
                    }
                    renderValue={(selected) => (
                        <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                        >
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                >
                    {permissions?.map((permission) => (
                        <MenuItem
                            key={permission.id}
                            value={permission.name}
                            style={getStyles(
                                permission.name,
                                selectedPermission,
                                theme,
                            )}
                        >
                            {permission.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}
