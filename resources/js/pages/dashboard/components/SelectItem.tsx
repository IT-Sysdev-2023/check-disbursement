import { SelectionType } from '@/types';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface SelectItemProps {
    title: string;
    items: SelectionType[];
    handleChange: (e: SelectChangeEvent) => void;
    value: string;
    size?: 'medium' | 'small';
    isDisabled?: boolean;
}

export default function SelectItem({
    title,
    items,
    handleChange,
    value,
    isDisabled = false,
    size = 'medium',
}: SelectItemProps) {
    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size={size}>
                <InputLabel id={`${title}-label`}>{title}</InputLabel>
                <Select
                    size={size}
                    disabled={isDisabled}
                    labelId={`${title}-label`}
                    id={`${title}-select`}
                    value={value}
                    label={title}
                    onChange={handleChange}
                >
                    {items.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
