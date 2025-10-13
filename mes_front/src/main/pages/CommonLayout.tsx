import React, { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Paper,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Inventory,
  Layers,
  Settings,
} from "@mui/icons-material";
import RegisterPage from "../../rawMaterials/inbound/pages/RegisterPage";
import ViewPage from "../../rawMaterials/inbound/pages/ViewPage";

const drawerWidth = 260;

type SubMenuType = {
  text: string;
  subMenus: string[];
};

const mainMenus = [
  {
    text: "수주 대상 관리",
    icon: <Inventory />,
    subs: [
      { text: "입고", subMenus: ["등록", "조회"] },
      { text: "출고", subMenus: ["등록", "조회"] },
    ],
  },
  {
    text: "원자재 품목 관리",
    icon: <Layers />,
    subs: [
      { text: "입고", subMenus: ["등록", "조회"] },
      { text: "출고", subMenus: ["등록", "조회"] },
    ],
  },
  {
    text: "시스템 설정",
    icon: <Settings />,
    subs: [{ text: "권한 관리", subMenus: ["등록", "조회"] }],
  },
];

export default function CommonLayout() {
  const [activeMain, setActiveMain] = useState(mainMenus[0].text);
  const [activeSub, setActiveSub] = useState(mainMenus[0].subs[0].text);
  const [activeThird, setActiveThird] = useState(mainMenus[0].subs[0].subMenus[0]);

  const handleMainClick = (main: string, subList: SubMenuType[]) => {
    setActiveMain(main);
    setActiveSub(subList[0].text);
    setActiveThird(subList[0].subMenus[0]);
  };

  const handleSubClick = (sub: string, thirdList: string[]) => {
    setActiveSub(sub);
    setActiveThird(thirdList[0]);
  };

  const currentPath = `${activeMain} > ${activeSub} > ${activeThird}`;

  const renderPage = () => {
    if (activeThird === "조회") return <ViewPage />;
    if (activeThird === "등록") return <RegisterPage />;
    return <Typography>페이지를 선택하세요.</Typography>;
  };

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          MES System
        </Typography>
      </Toolbar>
      <Divider />

      <List>
        {mainMenus.map((main) => (
          <React.Fragment key={main.text}>
            <ListItem disablePadding>
              <ListItemButton
                selected={activeMain === main.text}
                onClick={() => handleMainClick(main.text, main.subs)}
              >
                <ListItemIcon>{main.icon}</ListItemIcon>
                <ListItemText primary={main.text} />
              </ListItemButton>
            </ListItem>

            {activeMain === main.text && (
              <List sx={{ pl: 3, bgcolor: "#fafafa" }}>
                {main.subs.map((sub) => (
                  <React.Fragment key={sub.text}>
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={activeSub === sub.text}
                        onClick={() => handleSubClick(sub.text, sub.subMenus)}
                      >
                        <ListItemText primary={`- ${sub.text}`} />
                      </ListItemButton>
                    </ListItem>

                    {activeSub === sub.text && (
                      <List sx={{ pl: 4, bgcolor: "#f5f5f5" }}>
                        {sub.subMenus.map((third) => (
                          <ListItem disablePadding key={third}>
                            <ListItemButton
                              selected={activeThird === third}
                              onClick={() => setActiveThird(third)}
                            >
                              <ListItemText primary={third} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </React.Fragment>
                ))}
              </List>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "white",
          color: "black",
          boxShadow: 0,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {currentPath}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "#f7f9fb",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Paper sx={{ p: 4, minHeight: "80vh", width:"100%" }}>{renderPage()}</Paper>
      </Box>
    </Box>
  );
}
