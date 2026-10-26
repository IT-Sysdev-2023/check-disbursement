
import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from 'react';

import {
    Box,
    IconButton,
    Modal,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

type PdfPreviewContextType = {
    openPdf: (url: string) => void;
    closePdf: () => void;
};

const PdfPreviewContext =
    createContext<PdfPreviewContextType | null>(null);

export function PdfPreviewProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const openPdf = (url: string) => setPdfUrl(url);
    const closePdf = () => setPdfUrl(null);

    return (
        <PdfPreviewContext.Provider value={{ openPdf, closePdf }}>
            {children}

            <Modal open={!!pdfUrl} onClose={closePdf}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '70%',
                        height: '85vh',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <IconButton onClick={closePdf}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {pdfUrl && (
                        <iframe
                            key={pdfUrl}
                            src={pdfUrl}
                            title="PDF Preview"
                            style={{
                                width: '100%',
                                flex: 1,
                                border: 0,
                            }}
                        />
                    )}
                </Box>
            </Modal>
        </PdfPreviewContext.Provider>
    );
}

export function usePdfPreview() {
    const context = useContext(PdfPreviewContext);

    if (!context) {
        throw new Error(
            'usePdfPreview must be used within PdfPreviewProvider',
        );
    }

    return context;
}
