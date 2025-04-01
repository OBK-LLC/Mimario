import React, { useState } from "react";
import {
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Rating,
  Chip,
  Pagination,
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

const ITEMS_PER_PAGE = 5;

const FeedbackList: React.FC = () => {
  const [feedback, setFeedback] = useState<FeedbackData[]>(mockFeedback);
  const [page, setPage] = useState(1);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleDelete = (feedbackId: number) => {
    setFeedback((prevFeedback) =>
      prevFeedback.filter((item) => item.id !== feedbackId)
    );
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return (
    <div className={styles.container}>
      <div className={styles.feedbackList}>
        {feedback.slice(startIndex, endIndex).map((item) => (
          <Paper key={item.id} className={styles.feedbackItem}>
            <div className={styles.feedbackContent}>
              <div className={styles.feedbackHeader}>
                {item.isPositive ? (
                  <Chip
                    icon={<ThumbUpIcon />}
                    label="Olumlu"
                    color="success"
                    size="small"
                    className={styles.typeChip}
                  />
                ) : (
                  <Chip
                    icon={<ThumbDownIcon />}
                    label="Olumsuz"
                    color="error"
                    size="small"
                    className={styles.typeChip}
                  />
                )}
                <Typography variant="body2" color="textSecondary">
                  {item.date}
                </Typography>
              </div>
              <div className={styles.ratingContainer}>
                <Rating value={item.rating} readOnly size="small" />
                <Typography variant="body2" color="textSecondary">
                  ({item.rating}/5)
                </Typography>
              </div>
              <Typography variant="body1" className={styles.message}>
                {item.comment}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Gönderen: {item.user}
              </Typography>
            </div>
            <div className={styles.feedbackActions}>
              <Tooltip title="Sil">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(item.id)}
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
          count={Math.ceil(feedback.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default FeedbackList;
