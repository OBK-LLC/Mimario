import React, { useState } from "react";
import {
  Typography,
  Button,
  IconButton,
  Paper,
  Tooltip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  InsertDriveFile as DocumentIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import styles from "./file-manager.module.css";

interface FileData {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploadedBy: string;
  downloads: number;
}

const mockFiles = [
  {
    id: 1,
    name: "Proje Raporu.pdf",
    type: "pdf",
    size: "2.5 MB",
    uploadDate: "2024-01-20",
    uploadedBy: "Ahmet Yılmaz",
    downloads: 15,
  },
  {
    id: 2,
    name: "Görsel.jpg",
    type: "image",
    size: "1.8 MB",
    uploadDate: "2024-01-19",
    uploadedBy: "Ayşe Kaya",
    downloads: 5,
  },
  {
    id: 3,
    name: "Rapor.docx",
    type: "document",
    size: "500 KB",
    uploadDate: "2024-01-18",
    uploadedBy: "Mehmet Demir",
    downloads: 2,
  },
];

const ITEMS_PER_PAGE = 10;

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>(mockFiles);
  const [page, setPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<number | null>(null);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileData: FileData = {
        id: Date.now(),
        name: file.name,
        type: file.type.split("/")[1] || "document",
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        uploadDate: new Date().toISOString().split("T")[0],
        uploadedBy: "Aktif Kullanıcı",
        downloads: 0,
      };
      setFiles((prevFiles) => [...prevFiles, fileData]);
    }
  };

  const handleDeleteClick = (fileId: number) => {
    setFileToDelete(fileId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (fileToDelete === null) return;

    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.id !== fileToDelete)
    );
    setDeleteDialogOpen(false);
    setFileToDelete(null);
  };

  const handleFileDownload = (fileId: number) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === fileId ? { ...file, downloads: file.downloads + 1 } : file
      )
    );
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <PdfIcon fontSize="small" />;
      case "image":
        return <ImageIcon fontSize="small" />;
      default:
        return <DocumentIcon fontSize="small" />;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className={styles.error}>
        {error}
      </Alert>
    );
  }

  return (
    <Box className={styles.container}>
      <Paper elevation={0} className={styles.tableContainer}>
        <Box className={styles.toolbar}>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            component="label"
            sx={{
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Dosya Yükle
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>
          {selectedFile && (
            <Typography variant="body2" color="text.secondary">
              Seçilen dosya: {selectedFile.name}
            </Typography>
          )}
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Dosya
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Boyut
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Yükleyen
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Tarih
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    İşlemler
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => (
                <TableRow
                  key={file.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {getFileIcon(file.type)}
                      <Typography variant="body2">{file.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{file.size}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{file.uploadedBy}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(file.uploadDate).toLocaleDateString("tr-TR")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <div className={styles.actions}>
                      <IconButton
                        size="small"
                        onClick={() => handleFileDownload(file.id)}
                        color="primary"
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(file.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className={styles.pagination}>
          <Pagination
            count={Math.ceil(files.length / ITEMS_PER_PAGE)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            shape="rounded"
          />
        </div>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 2,
            p: 1,
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Dosyayı Sil
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bu dosyayı silmek istediğinizden emin misiniz?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ textTransform: "none" }}
          >
            İptal
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileManager;
