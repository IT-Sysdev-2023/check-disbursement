import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Step from '@mui/material/Step';
import { StepIconProps } from '@mui/material/StepIcon';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';


const ICON_SIZE = 40;

function CustomStepIcon({ active, completed, icon }: StepIconProps) {
    return (
        <Box
            sx={{
                width: ICON_SIZE,
                height: ICON_SIZE,
                borderRadius: '50%',
                fontSize: 16,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: completed
                    ? 'success.light'
                    : active
                      ? 'primary.main'
                      : 'grey.300',
                color:
                    active || completed
                        ? 'primary.contrastText'
                        : 'text.secondary',
            }}
        >
            {completed ? (
                <CheckIcon />
            ) : active ? (
                <CircularProgress
                    size={20}
                    thickness={5}
                    sx={{ color: 'inherit' }}
                />
            ) : (
                icon
            )}
        </Box>
    );
}

export default function HorizontalLinearAlternativeLabelStepper({
    step,
    steps
}: {
        step: number;
    steps: string[]
}) {
    return (
        <Box sx={{ width: '100%' }}>
            <Stepper
                activeStep={step}
                alternativeLabel
                sx={{
                    '& .MuiStepConnector-alternativeLabel': {
                        top: ICON_SIZE / 2 - 1,
                        left: `calc(-50% + ${ICON_SIZE / 2 + 8}px)`,
                        right: `calc(50% + ${ICON_SIZE / 2 + 8}px)`,
                    },
                }}
            >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={CustomStepIcon}>
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
}
