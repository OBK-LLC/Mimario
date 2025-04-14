import React from "react";
import { Typography, Container, Paper, Box } from "@mui/material";
import {
  People as PeopleIcon,
  Folder as FolderIcon,
  Feedback as FeedbackIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
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
        <AdminIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            letterSpacing: -0.5,
          }}
        >
          Yönetici Paneli
        </Typography>
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
