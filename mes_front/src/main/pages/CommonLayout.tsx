// src/main/pages/CommonLayout.tsx
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
} from "@mui/material";
import {
  Menu as MenuIcon,
  Layers,
} from "@mui/icons-material";

import OrderInViewPage from "../../orders/inbound/pages/OrderInViewPage";
import OrderOutViewPage from "../../orders/outbound/pages/OrderOutViewPage";
import RawInViewPage from "../../rawMaterials/inbound/pages/RawInViewPage";
import RawOutViewPage from "../../rawMaterials/outbound/pages/RawOutViewPage";
import OrderViewPage from "../../masterData/items/pages/OrderViewPage";
import RawViewPage from "../../masterData/items/pages/RawViewPage";
import RoutingLookupPage from "../../masterData/routings/pages/RoutingViewPage";
// import BusinessPartner from "../../masterData/companies/pages/BusinessPartnerViewPage";

const drawerWidth = 260;

const mainMenus = [
  {
    text: "수주 대상 관리",
    icon: <Layers />,
    subs: [
      { text: "입고"},
      { text: "출고"},
    ]
  },
  {
    text: "원자재 관리",
    icon: <Layers />,
    subs: [
      { text: "입고"},
      { text: "출고"},
      { text: "재고현황"},
    ]
  },
  {
    text: "기준 정보 관리",
    icon: <Layers />,
    subs: [
      { text: "수주 대상 품목 관리" },
      { text: "원자재 품목 관리" },
      { text: "라우팅 관리" },
      { text: "업체 관리" },
    ]
  },
  // 필요하면 다른 메뉴 추가
];

export default function CommonLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMain, setActiveMain] = useState(mainMenus[0].text);
  const [activeSub, setActiveSub] = useState(mainMenus[0].subs[0].text);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const currentPath = `${activeMain} > ${activeSub}`;
//   const currentPath = `${activeMain} > ${activeSub} > ${activeThird}`;

  // ================= 페이지 매핑 =================
  const pageMap: Record<string, React.ReactNode> = {
    "수주 대상 관리 > 입고": <OrderInViewPage />,
    "수주 대상 관리 > 출고": <OrderOutViewPage />,
    "원자재 관리 > 입고": <RawInViewPage />,
    "원자재 관리 > 출고": <RawOutViewPage />,
    "기준 정보 관리 > 수주 대상 품목 관리": <OrderViewPage />,
    "기준 정보 관리 > 원자재 품목 관리": <RawViewPage />,
    "기준 정보 관리 > 라우팅 관리": <RoutingLookupPage />,
    // "기준 정보 관리 > 업체 관리": <BusinessPartner />,
  };

  const renderPage = () => pageMap[`${activeMain} > ${activeSub}`] || (
    <Typography>페이지를 선택하세요.</Typography>
  );

  // ================= Drawer 내용 =================
  const drawerContent = (
    <Box>
      <Toolbar><Typography variant="h6">MES System</Typography></Toolbar>
      <Divider />
      <List>
        {mainMenus.map(main => (
            <React.Fragment key={main.text}>
            <ListItem disablePadding>
                <ListItemButton
                selected={activeMain === main.text}
                onClick={() => {
                    setActiveMain(main.text);
                    setActiveSub(main.subs[0].text);
                }}
                >
                <ListItemIcon>{main.icon}</ListItemIcon>
                <ListItemText primary={main.text} />
                </ListItemButton>
            </ListItem>

            {activeMain === main.text && (
                <List sx={{ pl: 2 }}>
                {main.subs.map(sub => (
                    <ListItem disablePadding key={sub.text}>
                    <ListItemButton
                        selected={activeSub === sub.text}
                        onClick={() => setActiveSub(sub.text)}
                    >
                        <ListItemText primary={`- ${sub.text}`} />
                    </ListItemButton>
                    </ListItem>
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
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography>{currentPath}</Typography>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: "block", sm: "none" }, "& .MuiDrawer-paper": { width: drawerWidth } }}>
          {drawerContent}
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { width: drawerWidth } }} open>
          {drawerContent}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 2, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: "100vh" }}>
        <Toolbar />
        {renderPage()}
      </Box>
    </Box>
  );
}
