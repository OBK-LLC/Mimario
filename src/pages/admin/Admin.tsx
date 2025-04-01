import React from "react";
import { Typography, Container, Paper } from "@mui/material";
import {
  People as PeopleIcon,
  Folder as FolderIcon,
  Feedback as FeedbackIcon,
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
    <Container maxWidth="xl" className={styles.container}>
      <Paper className={styles.header}>
        <Typography variant="h4" component="h1">
          Yönetici Paneli
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Kullanıcıları, dosyaları ve geri bildirimleri yönetin
        </Typography>
      </Paper>

      <Paper className={styles.content}>
        <TabPanel items={tabItems} />
      </Paper>
    </Container>
  );
};

export default Admin;
