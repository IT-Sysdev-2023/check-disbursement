import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface SelectItemProps {
    title: string;
    items: { label: string; value: string | number }[];
    handleChange: (e: SelectChangeEvent) => void;
    value: string;
}

export default function SelectItem({
    title,
    items,
    handleChange,
    value,
}: SelectItemProps) {
    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id={`${title}-label`}>{title}</InputLabel>
                <Select
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
