import React, { useState, ReactElement } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import styles from "./tab-panel.module.css";

interface TabItem {
  icon?: ReactElement;
  label: string;
  content: React.ReactNode;
}

interface TabPanelProps {
  items: TabItem[];
  defaultTab?: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ items, defaultTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div className={styles.tabPanel}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="tab panel"
          variant="fullWidth"
        >
          {items.map((item, index) => (
            <Tab
              key={index}
              icon={item.icon}
              label={item.label}
              id={`tab-${index}`}
              aria-controls={`tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {items.map((item, index) => (
        <div
          key={index}
          role="tabpanel"
          hidden={activeTab !== index}
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
          className={styles.tabContent}
        >
          {activeTab === index && (
            <Box sx={{ height: "100%" }}>{item.content}</Box>
          )}
        </div>
      ))}
    </div>
  );
};

export default TabPanel;
