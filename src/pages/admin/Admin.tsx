import React from "react";
import { Typography, Container, Paper, Box, Button } from "@mui/material";
import {
  People as PeopleIcon,
  Folder as FolderIcon,
  Feedback as FeedbackIcon,
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import TabPanel from "../../components/admin-tab-panel/TabPanel";
import UsersList from "../../components/admin-users/UsersList";
import FileManager from "../../components/admin-files/FileManager";
import FeedbackList from "../../components/admin-feedback/FeedbackList";
import styles from "./admin.module.css";

const Admin: React.FC = () => {
  const tabItems = [
    {
      icon: <PeopleIcon />,
      label: "Kullanıcılar",
      content: <UsersList />,
    },
    {
      icon: <FolderIcon />,
      label: "Dosyalar",
      content: <FileManager />,
    },
    {
      icon: <FeedbackIcon />,
      label: "Geri Bildirimler",
      content: <FeedbackList />,
    },
  ];

  return (
    <Box className={styles.container}>
      <Paper elevation={0} className={styles.header}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            px: 2,
            py: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AdminIcon sx={{ mr: 2 }} />
            <Typography variant="h5" component="h1">
              Yönetici Paneli
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            startIcon={<HomeIcon />}
            sx={{
              position: "absolute",
              right: 16,
              textTransform: "none",
              "&:hover": {
                transform: "scale(1.05)",
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Ana Sayfa
          </Button>
        </Box>
        <Typography
          variant="body1"
          color="inherit"
          sx={{
            opacity: 0.9,
            mt: 1,
            fontSize: "1.1rem",
          }}
        >
          Kullanıcıları, dosyaları ve geri bildirimleri yönetin
        </Typography>
      </Paper>

      <Paper
        elevation={0}
        className={styles.content}
        sx={{
          overflow: "hidden",
        }}
      >
        <TabPanel items={tabItems} />
      </Paper>
    </Box>
  );
};

export default Admin;
