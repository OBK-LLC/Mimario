import React, { useState } from "react";
import {
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Rating,
  Chip,
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
  Button,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
} from "@mui/icons-material";
import styles from "./feedback-list.module.css";

interface FeedbackData {
  id: number;
  rating: number;
  comment: string;
  date: string;
  user: string;
  isPositive: boolean;
}

const mockFeedback = [
  {
    id: 1,
    rating: 1,
    comment: "Uygulama açılışında yavaşlık var, bazen yanıt vermiyor",
    user: "Ahmet Yılmaz",
    date: "2024-01-20",
    isPositive: false,
  },
  {
    id: 2,
    rating: 5,
    comment:
      "Harika bir uygulama! Özellikle chat kısmı çok kullanışlı. Yapay zeka asistanı gerçekten yardımcı oluyor.",
    user: "Ayşe Kaya",
    date: "2024-01-19",
    isPositive: true,
  },
  {
    id: 3,
    rating: 2,
    comment: "Arayüz karışık ve kullanımı zor. Daha basit olabilir.",
    user: "Mehmet Demir",
    date: "2024-01-18",
    isPositive: false,
  },
] as FeedbackData[];

const ITEMS_PER_PAGE = 10;

const FeedbackList: React.FC = () => {
  const [feedback, setFeedback] = useState<FeedbackData[]>(mockFeedback);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<number | null>(null);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleDeleteClick = (feedbackId: number) => {
    setFeedbackToDelete(feedbackId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (feedbackToDelete === null) return;

    setFeedback((prevFeedback) =>
      prevFeedback.filter((item) => item.id !== feedbackToDelete)
    );
    setDeleteDialogOpen(false);
    setFeedbackToDelete(null);
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Geri Bildirim
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Kullanıcı
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Değerlendirme
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
              {feedback.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <TableCell>
                    <Box className={styles.feedbackContent}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Chip
                          icon={
                            item.isPositive ? (
                              <ThumbUpIcon />
                            ) : (
                              <ThumbDownIcon />
                            )
                          }
                          label={item.isPositive ? "Olumlu" : "Olumsuz"}
                          color={item.isPositive ? "success" : "error"}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                      <Typography variant="body2">{item.comment}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{item.user}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Rating value={item.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        ({item.rating}/5)
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(item.date).toLocaleDateString("tr-TR")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <div className={styles.actions}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(item.id)}
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
            count={Math.ceil(feedback.length / ITEMS_PER_PAGE)}
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
            Geri Bildirimi Sil
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bu geri bildirimi silmek istediğinizden emin misiniz?
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

export default FeedbackList;
