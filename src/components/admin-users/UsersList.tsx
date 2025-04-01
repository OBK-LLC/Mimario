import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Pagination,
} from "@mui/material";
import { Email as EmailIcon, Phone as PhoneIcon } from "@mui/icons-material";
import styles from "./users-list.module.css";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  joinDate: string;
}

const mockUsers = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    email: "ahmet@example.com",
    phone: "+90 555 123 4567",
    status: "active",
    joinDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Mehmet Demir",
    email: "mehmet@example.com",
    phone: "+90 555 234 5678",
    status: "inactive",
    joinDate: "2024-01-10",
  },
  {
    id: 3,
    name: "Ayşe Kaya",
    email: "ayse@example.com",
    phone: "+90 555 345 6789",
    status: "active",
    joinDate: "2024-01-05",
  },
];
const ITEMS_PER_PAGE = 10;

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [page, setPage] = useState(1);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleStatusChange = (userId: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
  };

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  return (
    <div className={styles.container}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>İsim</TableCell>
              <TableCell>E-posta</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Katılım Tarihi</TableCell>
              <TableCell>Durum</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.slice(startIndex, endIndex).map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Typography variant="subtitle2">{user.name}</Typography>
                </TableCell>
                <TableCell>
                  <div className={styles.infoItem}>
                    <EmailIcon fontSize="small" />
                    <span>{user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={styles.infoItem}>
                    <PhoneIcon fontSize="small" />
                    <span>{user.phone}</span>
                  </div>
                </TableCell>
                <TableCell>{user.joinDate}</TableCell>
                <TableCell>
                  <Chip
                    label={user.status === "active" ? "Aktif" : "Pasif"}
                    color={user.status === "active" ? "success" : "default"}
                    size="small"
                    onClick={() => handleStatusChange(user.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={styles.pagination}>
        <Pagination
          count={Math.ceil(users.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </div>
    </div>
  );
};

export default UsersList;
