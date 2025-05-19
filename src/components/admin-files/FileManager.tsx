import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  CircularProgress,
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
import { FileService, FileResponse } from "../../services/file/fileService";
import { showToast } from "../../utils/toast";

interface FileData extends FileResponse {
  downloads: number;
}

const ITEMS_PER_PAGE = 10;

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const documents = await FileService.getDocuments();
      setFiles(
        documents.map((doc) => ({
          ...doc,
          downloads: 0,
          size: doc.size || 0,
        }))
      );
      setError(null);
    } catch (err) {
      console.error("File fetch error:", err);
      setError("Dosyalar yüklenirken bir hata oluştu");
      showToast.error(
        "Dosyalar yüklenirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files?.length) return;

    try {
      setLoading(true);
      await FileService.uploadFiles(Array.from(files));
      await fetchDocuments();
      showToast.success("Dosya başarıyla yüklendi!");
    } catch (error) {
      showToast.error(
        error instanceof Error
          ? error.message
          : "Dosya yüklenirken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileDownload = (fileId: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === fileId ? { ...file, downloads: file.downloads + 1 } : file
      )
    );
  };

  const handleDeleteClick = (fileId: string) => {
    setFileToDelete(fileId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!fileToDelete) return;

    try {
      setLoading(true);
      await FileService.deleteDocument(fileToDelete);
      setFiles((prevFiles) =>
        prevFiles.filter((file) => file.id !== fileToDelete)
      );
      setDeleteDialogOpen(false);
      setFileToDelete(null);
      showToast.success("Dosya başarıyla silindi!");
    } catch (error) {
      showToast.error(
        error instanceof Error
          ? error.message
          : "Dosya silinirken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const getFileIcon = (fileType: string | undefined) => {
    if (!fileType) return <DocumentIcon fontSize="small" />;

    const type = fileType.toLowerCase();
    switch (type) {
      case "pdf":
        return <PdfIcon fontSize="small" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <ImageIcon fontSize="small" />;
      default:
        return <DocumentIcon fontSize="small" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
  };

  const paginatedFiles = files.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
      </div>
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
            <input
              type="file"
              hidden
              onChange={handleFileUpload}
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
          </Button>
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
                    Tarih
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight={600}>
                    İşlemler
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedFiles.map((file) => (
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
                    <Typography variant="body2">
                      {formatFileSize(file.size)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(file.uploadDate).toLocaleDateString("tr-TR")}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
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

        {files.length > 0 && (
          <div className={styles.pagination}>
            <Pagination
              count={Math.ceil(files.length / ITEMS_PER_PAGE)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </div>
        )}
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          elevation: 0,
          sx: { borderRadius: 2, p: 1 },
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
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileManager;
