import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Chip,
  Box,
  Alert,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Badge as BadgeIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { feedbackService } from "../../services/feedback/feedbackService";
import { AdminFeedback } from "../../types/feedback";
import { formatDate } from "../../utils/date";
import styles from "./feedback-list.module.css";
import { showToast } from "../../utils/toast";

const ITEMS_PER_PAGE = 10;

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFeedback, setSelectedFeedback] =
    useState<AdminFeedback | null>(null);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await feedbackService.getFeedbackList(
        page,
        ITEMS_PER_PAGE
      );

      if (response?.feedbacks) {
        // Kullanıcı bilgilerini içeren geri bildirimleri set et
        const feedbacksWithUsers = response.feedbacks.map((feedback) => ({
          ...feedback,
          user: feedback.user, // undefined olarak bırak eğer yoksa
        }));

        setFeedbacks(feedbacksWithUsers);
        setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
      } else {
        setFeedbacks([]);
        setTotalPages(1);
      }
      setError(null);
    } catch (err) {
      console.error("Feedback fetch error:", err);
      setError("Geri bildirimler yüklenirken bir hata oluştu");
      setFeedbacks([]);
      setTotalPages(1);
      showToast.error(
        "Geri bildirimler yüklenirken bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [page]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "positive":
        return "success";
      case "negative":
        return "error";
      default:
        return "default";
    }
  };

  const getRatingText = (rating: string) => {
    switch (rating) {
      case "positive":
        return "Olumlu";
      case "negative":
        return "Olumsuz";
      default:
        return "Nötr";
    }
  };

  const handleCloseDialog = () => {
    setSelectedFeedback(null);
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Değerlendirme
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Mesaj
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Yorum
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
            {feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <TableRow
                  key={feedback.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <TableCell>
                    <Chip
                      label={getRatingText(feedback.rating)}
                      color={getRatingColor(feedback.rating) as any}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        "&:hover": {
                          opacity: 0.9,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className={styles.messageContent}>
                      <Typography variant="body2">
                        {feedback.targetMessage?.content || (
                          <Typography variant="caption" color="textSecondary">
                            Mesaj bulunamadı
                          </Typography>
                        )}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {feedback.comment || (
                        <Typography variant="caption" color="textSecondary">
                          -
                        </Typography>
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(feedback.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <div className={styles.actions}>
                      <IconButton
                        size="small"
                        onClick={() => setSelectedFeedback(feedback)}
                        color="primary"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="textSecondary">
                    Henüz geri bildirim bulunmuyor
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className={styles.pagination}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </div>
      </Paper>

      <Dialog
        open={!!selectedFeedback}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <InfoIcon />
            Geri Bildirim Detayları
          </Box>
        </DialogTitle>
        <DialogContent>
          <div className={styles.dialogContent}>
            <div className={styles.infoSection}>
              <div className={styles.infoHeader}>
                <BadgeIcon />
                <Typography variant="subtitle1">Oturum Bilgileri</Typography>
              </div>
              <div className={styles.infoContent}>
                <Typography variant="body2">
                  Session ID: {selectedFeedback?.sessionId}
                </Typography>
                <Typography variant="body2">
                  Message ID: {selectedFeedback?.messageId}
                </Typography>
              </div>
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoHeader}>
                <EmailIcon />
                <Typography variant="subtitle1">Kullanıcı Bilgileri</Typography>
              </div>
              <div className={styles.infoContent}>
                <Typography variant="body2" className={styles.userDetailRow}>
                  <span className={styles.userDetailLabel}>Kullanıcı ID:</span>
                  <span className={styles.userDetailValue}>
                    {selectedFeedback?.userId ||
                      "2121d76d-6554-4876-9200-a16a160feec4"}
                  </span>
                </Typography>
                <Typography variant="body2" className={styles.userDetailRow}>
                  <span className={styles.userDetailLabel}>E-posta:</span>
                  <span className={styles.userDetailValue}>
                    {selectedFeedback?.user?.email || "-"}
                  </span>
                </Typography>
              </div>
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoHeader}>
                <MessageIcon />
                <Typography variant="subtitle1">Geri Bildirim</Typography>
              </div>
              <div className={styles.infoContent}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="body2">Değerlendirme:</Typography>
                  <Chip
                    label={getRatingText(selectedFeedback?.rating || "")}
                    color={
                      getRatingColor(selectedFeedback?.rating || "") as any
                    }
                    size="small"
                  />
                </Box>
                <Typography variant="body2">
                  Yorum: {selectedFeedback?.comment || "-"}
                </Typography>
              </div>
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoHeader}>
                <MessageIcon />
                <Typography variant="subtitle1">Mesaj İçeriği</Typography>
              </div>
              <div className={styles.infoContent}>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {selectedFeedback?.targetMessage?.content || "-"}
                </Typography>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Kapat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeedbackList;
