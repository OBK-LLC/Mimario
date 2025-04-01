import React, { useState } from "react";
import {
  Typography,
  Button,
  IconButton,
  Paper,
  Tooltip,
  Pagination,
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

const ITEMS_PER_PAGE = 5;

const FileManager: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>(mockFiles);
  const [page, setPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        uploadedBy: "Aktif Kullanıcı", // Bu bilgi auth sisteminden gelecek
        downloads: 0,
      };
      setFiles((prevFiles) => [...prevFiles, fileData]);
    }
  };

  const handleFileDelete = (fileId: number) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  const handleFileDownload = (fileId: number) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === fileId ? { ...file, downloads: file.downloads + 1 } : file
      )
    );
    // Burada gerçek dosya indirme işlemi yapılacak
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <PdfIcon className={styles.fileIcon} />;
      case "image":
        return <ImageIcon className={styles.fileIcon} />;
      default:
        return <DocumentIcon className={styles.fileIcon} />;
    }
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return (
    <div className={styles.container}>
      <div className={styles.fileUpload}>
        <Button
          variant="outlined"
          startIcon={<UploadIcon />}
          component="label"
          className={styles.uploadButton}
        >
          Dosya Yükle
          <input type="file" hidden onChange={handleFileUpload} />
        </Button>
        {selectedFile && (
          <Typography variant="body2" className={styles.selectedFile}>
            Seçilen dosya: {selectedFile.name}
          </Typography>
        )}
      </div>

      <div className={styles.fileList}>
        {files.slice(startIndex, endIndex).map((file) => (
          <Paper key={file.id} className={styles.fileItem}>
            <div className={styles.fileInfo}>
              {getFileIcon(file.type)}
              <div>
                <Typography variant="subtitle2">{file.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {file.size} • Yükleyen: {file.uploadedBy}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Yüklenme: {file.uploadDate} • {file.downloads} İndirme
                </Typography>
              </div>
            </div>
            <div className={styles.fileActions}>
              <Tooltip title="İndir">
                <IconButton
                  size="small"
                  onClick={() => handleFileDownload(file.id)}
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Sil">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleFileDelete(file.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </Paper>
        ))}
      </div>
      <div className={styles.pagination}>
        <Pagination
          count={Math.ceil(files.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default FileManager;
