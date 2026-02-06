import { TextField } from '@mui/material';
import { NumericFormat } from 'react-number-format';

function NumberFormatInput(props) {
    const { onChange, ...other } = props;

    return (
        <NumericFormat
            {...other}
            thousandSeparator=","
            decimalScale={2}
            fixedDecimalScale={false}
            allowNegative={false}
            customInput={TextField}
            prefix="₱ "
            onValueChange={(values) => {
                onChange({
                    target: {
                        value: values.floatValue ?? '',
                    },
                });
            }}
        />
    );
}

export default NumberFormatInput;