import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Rating,
  Typography,
} from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import styles from "./feedback-modal.module.css";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  isPositive: boolean;
  onSubmit: (feedback: { rating: number; comment: string }) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  onClose,
  isPositive,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating) {
      onSubmit({ rating, comment });
      onClose();
      setRating(null);
      setComment("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <Box className={styles.titleContainer}>
          {isPositive ? (
            <ThumbUp color="primary" />
          ) : (
            <ThumbDown color="error" />
          )}
          <Typography variant="h6">
            {isPositive ? "Yanıtı Beğendiniz" : "Yanıtı Beğenmediniz"}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box className={styles.contentBox}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Lütfen yanıtı değerlendirin
          </Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
            className={styles.rating}
          />
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Görüşlerinizi paylaşın (isteğe bağlı)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.textField}
          />
        </Box>
      </DialogContent>
      <DialogActions className={styles.actions}>
        <Button onClick={onClose} variant="outlined">
          İptal
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!rating}>
          Gönder
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackModal;
