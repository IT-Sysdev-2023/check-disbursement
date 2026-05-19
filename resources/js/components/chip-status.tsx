import { Chip } from '@mui/material';

interface Props {
  status?: ChequeStatus | string;
}

export default function ChequeStatusChip({ status }: Props) {
  if (!status) return null;

  return (
    <Chip
      label={status}
      color={chequeStatusColorMap[status as ChequeStatus] ?? 'default'}
      size="small"
    />
  );
}

type ChequeStatus =
  | 'released'
  | 'forwarded'
  | 'deposited'
  | 'staled'
  | 'cancelled';

const chequeStatusColorMap: Record<
  ChequeStatus,
  'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
> = {
  released: 'success',
  forwarded: 'info',
  deposited: 'primary',
  staled: 'warning',
  cancelled: 'error',
};