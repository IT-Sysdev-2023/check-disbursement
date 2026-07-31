import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

export interface ChequeVoucherData {
  voucherNo: string;
  voucherDate: string;
  bankName: string;
  chequeNo: string;
  chequeDate: string;
  payeeName: string;
  accountNo: string;
  amount: string;
  remarks: string;
  chequeImage: string | null;
}

export interface ScanChequeVoucherModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: ChequeVoucherData) => void;
}

const emptyData: ChequeVoucherData = {
  voucherNo: "CV-00124",
  voucherDate: new Date().toISOString().slice(0, 10),
  bankName: "",
  chequeNo: "",
  chequeDate: "",
  payeeName: "",
  accountNo: "",
  amount: "",
  remarks: "",
  chequeImage: null,
};

export default function ScanChequeModal({
  open,
  onClose,
  onSave,
}: ScanChequeVoucherModalProps) {
  const [data, setData] = useState<ChequeVoucherData>(emptyData);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange =
    (field: keyof ChequeVoucherData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleFileSelect = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setData((prev) => ({ ...prev, chequeImage: reader.result as string }));
      simulateScan();
    };
    reader.readAsDataURL(file);
  };

  // Simulates an OCR scan pass filling in the extracted fields.
  const simulateScan = () => {
    setScanning(true);
    setScanned(false);
    setTimeout(() => {
      setData((prev) => ({
        ...prev,
        bankName: prev.bankName || "State Bank of India",
        chequeNo: prev.chequeNo || "003452",
        chequeDate: prev.chequeDate || new Date().toISOString().slice(0, 10),
        payeeName: prev.payeeName || "Ravi Enterprises",
        accountNo: prev.accountNo || "XXXXXX7842",
        amount: prev.amount || "45,000.00",
      }));
      setScanning(false);
      setScanned(true);
    }, 1400);
  };

  const handleRemoveImage = () => {
    setData((prev) => ({ ...prev, chequeImage: null }));
    setScanned(false);
  };

  const handleSave = () => {
    onSave?.(data);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                borderRadius: 2,
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DocumentScannerIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600} lineHeight={1.2}>
                Scan Cheque Voucher
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Capture or upload a cheque to auto-fill voucher details
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          {/* Left: scan / preview area */}
          <Grid item xs={12} md={5}>
            <Box
              sx={{
                border: "2px dashed",
                borderColor: data.chequeImage ? "success.main" : "divider",
                borderRadius: 2,
                bgcolor: "grey.50",
                minHeight: 260,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                p: 2,
              }}
            >
              {data.chequeImage ? (
                <>
                  <Box
                    component="img"
                    src={data.chequeImage}
                    alt="Scanned cheque preview"
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 1,
                      boxShadow: 1,
                    }}
                  />
                  {scanning && (
                    <Chip
                      label="Scanning…"
                      size="small"
                      color="warning"
                      sx={{ mt: 1.5 }}
                    />
                  )}
                  {scanned && !scanning && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="Details extracted"
                      size="small"
                      color="success"
                      sx={{ mt: 1.5 }}
                    />
                  )}
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={handleRemoveImage}
                    sx={{ mt: 1 }}
                  >
                    Remove
                  </Button>
                </>
              ) : (
                <>
                  <DocumentScannerIcon
                    sx={{ fontSize: 56, color: "text.disabled", mb: 1 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mb: 2, maxWidth: 220 }}
                  >
                    Place the cheque within frame and scan, or upload an image
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CameraAltIcon />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Scan Cheque
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<UploadFileIcon />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload
                    </Button>
                  </Stack>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    hidden
                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                  />
                </>
              )}
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1 }}
            >
              Supported formats: JPG, PNG · Max size 10MB
            </Typography>
          </Grid>

          {/* Right: voucher form */}
          <Grid item xs={12} md={7}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Voucher No."
                  size="small"
                  fullWidth
                  value={data.voucherNo}
                  onChange={handleChange("voucherNo")}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Voucher Date"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={data.voucherDate}
                  onChange={handleChange("voucherDate")}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider textAlign="left">
                  <Typography variant="caption" color="text.secondary">
                    Cheque Details
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Bank Name"
                  size="small"
                  fullWidth
                  placeholder="Auto-filled after scan"
                  value={data.bankName}
                  onChange={handleChange("bankName")}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Cheque No."
                  size="small"
                  fullWidth
                  placeholder="Auto-filled after scan"
                  value={data.chequeNo}
                  onChange={handleChange("chequeNo")}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Cheque Date"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={data.chequeDate}
                  onChange={handleChange("chequeDate")}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Amount"
                  size="small"
                  fullWidth
                  placeholder="0.00"
                  value={data.amount}
                  onChange={handleChange("amount")}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyRupeeIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Payee Name"
                  size="small"
                  fullWidth
                  placeholder="Auto-filled after scan"
                  value={data.payeeName}
                  onChange={handleChange("payeeName")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Account No."
                  size="small"
                  fullWidth
                  placeholder="Auto-filled after scan"
                  value={data.accountNo}
                  onChange={handleChange("accountNo")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Remarks"
                  size="small"
                  fullWidth
                  multiline
                  minRows={2}
                  value={data.remarks}
                  onChange={handleChange("remarks")}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!data.chequeImage}
        >
          Save Voucher
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/*
Usage example:

import { useState } from "react";
import ScanChequeVoucherModal, { ChequeVoucherData } from "./ScanChequeVoucherModal";

function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Scan Cheque Voucher
      </Button>
      <ScanChequeVoucherModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(data: ChequeVoucherData) => console.log("Saved voucher:", data)}
      />
    </>
  );
}

Dependencies required in your project:
  npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
*/