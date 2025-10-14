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
import { Menu as MenuIcon, Layers, Inventory } from "@mui/icons-material";

import RoutingViewPage from "../../masterData/routings/pages/RoutingViewPage";
import InboundHistoryPage from "../../orders/inbound/pages/InboundHistoryPage";
import OrderInViewPage from "../../orders/inbound/pages/OrderInViewPage";
import OrderOutViewPage from "../../orders/outbound/pages/OrderOutViewPage";
import RawInViewPage from "../../rawMaterials/inbound/pages/RawInViewPage";
import RawOutViewPage from "../../rawMaterials/outbound/pages/RawOutViewPage";
import OrderViewPage from "../../masterData/items/pages/OrderViewPage";
import RawViewPage from "../../masterData/items/pages/RawViewPage";
import BusinessPartnerViewPage from "../../masterData/companies/pages/BusinessPartnerViewPage";

const drawerWidth = 260;

type SubMenuType = {
  text: string;
  subMenus?: string[];
};

const mainMenus: {
  text: string;
  icon: React.ReactNode;
  subs: SubMenuType[];
}[] = [
  {
    text: "수주 대상 관리",
    icon: <Inventory />,
    subs: [
      { text: "입고", subMenus: ["입고 품목 조회/등록", "입고된 수주 이력"] },
      { text: "출고", subMenus: ["등록", "조회"] },
    ],
  },
  {
    text: "원자재 품목 관리",
    icon: <Layers />,
    subs: [{ text: "입고" }, { text: "출고" }],
  },
  {
    text: "원자재 관리",
    icon: <Layers />,
    subs: [{ text: "입고" }, { text: "출고" }, { text: "재고현황" }],
  },
  {
    text: "기준 정보 관리",
    icon: <Layers />,
    subs: [
      { text: "수주대상 품목 관리" },
      { text: "원자재 품목 관리" },
      { text: "라우팅 관리" },
      { text: "업체 관리" },
    ],
  },
];

export default function CommonLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMain, setActiveMain] = useState(mainMenus[0].text);
  const [activeSub, setActiveSub] = useState(mainMenus[0].subs[0].text);
  const [activeThird, setActiveThird] = useState(
    mainMenus[0].subs[0].subMenus?.[0] || ""
  );

  const currentPath = `${activeMain} > ${activeSub} > ${activeThird}`;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMainClick = (main: string, subList: SubMenuType[]) => {
    setActiveMain(main);
    setActiveSub(subList[0].text);
    setActiveThird(subList[0].subMenus?.[0] || "");
  };

  const handleSubClick = (sub: string, thirdList?: string[]) => {
    setActiveSub(sub);
    setActiveThird(thirdList?.[0] || "");
  };

  const renderPage = () => {
    if (activeThird === "입고 품목 조회/등록") return <OrderInViewPage />;
    if (activeThird === "입고된 수주 이력") return <InboundHistoryPage />;
    // if (activeSub === "입고") return <OrderInViewPage />;
    if (activeSub === "출고") return <OrderOutViewPage />;
    if (activeSub === "입고" && activeMain === "원자재 관리")
      return <RawInViewPage />;
    if (activeSub === "출고" && activeMain === "원자재 관리")
      return <RawOutViewPage />;
    if (activeSub === "수주대상 품목 관리") return <OrderViewPage />;
    if (activeSub === "원자재 품목 관리") return <RawViewPage />;
    if (activeSub === "라우팅 관리") return <RoutingViewPage />;
    if (activeSub === "업체 관리") return <BusinessPartnerViewPage />;
    return <Typography>페이지를 선택하세요.</Typography>;
  };

  const drawerContent = (
    <Box>
      <Toolbar>
        <Typography variant="h6">MES System</Typography>
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
              <List sx={{ pl: 2 }}>
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

                    {/* ✅ 하위 메뉴 표시 */}
                    {activeSub === sub.text && sub.subMenus && (
                      <List sx={{ pl: 4 }}>
                        {sub.subMenus.map((third) => (
                          <ListItem disablePadding key={third}>
                            <ListItemButton
                              selected={activeThird === third}
                              onClick={() => setActiveThird(third)}
                            >
                              <ListItemText primary={`-- ${third}`} />
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
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography>{currentPath}</Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {renderPage()}
      </Box>
    </Box>
  );
}
