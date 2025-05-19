import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { feedbackService } from "../../services/feedback/feedbackService";
import { FeedbackRating } from "../../types/feedback";
import { showToast } from "../../utils/toast";
import styles from "./feedback-modal.module.css";
import CircularProgress from "@mui/material/CircularProgress";

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  isPositive: boolean;
  sessionId: string;
  messageId: string;
  messageContent: string;
  messageRole: string;
  previousMessageId?: string;
  previousMessageContent?: string;
  onAfterSubmit?: (isPositive: boolean) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  onClose,
  isPositive,
  sessionId,
  messageId,
  messageContent,
  messageRole,
  previousMessageId,
  previousMessageContent,
  onAfterSubmit,
}) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const rating: FeedbackRating = isPositive ? "positive" : "negative";

      const response = await feedbackService.submitFeedback({
        sessionId,
        messageId,
        rating,
        comment: comment.trim() || undefined,
        targetMessage: {
          id: messageId,
          content: messageContent,
          role: messageRole,
        },
      });

      if (response.success) {
        showToast.success("Geribildiriminiz için teşekkürler!");
        if (onAfterSubmit) {
          onAfterSubmit(isPositive);
        } else {
          handleClose();
        }
      } else {
        showToast.error("Geribildirim gönderilemedi. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Feedback error:", error);
      showToast.error("Geribildirim gönderilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setComment("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Görüşlerinizi paylaşın (isteğe bağlı)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.textField}
            disabled={isSubmitting}
          />
        </Box>
      </DialogContent>
      <DialogActions className={styles.actions}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={isSubmitting}
        >
          İptal
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <CircularProgress size={20} sx={{ mr: 1.5, color: "#fff" }} />
              <Typography
                variant="body2"
                sx={{ color: "#fff", fontWeight: 500 }}
              >
                Gönderiliyor...
              </Typography>
            </Box>
          ) : (
            "Gönder"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackModal;
