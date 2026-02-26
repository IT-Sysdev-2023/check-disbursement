import { Chip } from '@mui/material';

interface Props {
  status?: CheckStatus | string;
}

export default function CheckStatusChip({ status }: Props) {
  if (!status) return null;

  return (
    <Chip
      label={status}
      color={checkStatusColorMap[status as CheckStatus] ?? 'default'}
      size="small"
    />
  );
}

type CheckStatus =
  | 'released'
  | 'forwarded'
  | 'deposited'
  | 'staled'
  | 'cancelled';

const checkStatusColorMap: Record<
  CheckStatus,
  'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
> = {
  released: 'success',
  forwarded: 'info',
  deposited: 'primary',
  staled: 'warning',
  cancelled: 'error',
};