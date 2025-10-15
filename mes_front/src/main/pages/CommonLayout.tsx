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
import { Menu as MenuIcon, Layers } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import OrderInViewPage from "../../orders/inbound/pages/OrderInViewPage";
import OrderOutViewPage from "../../orders/outbound/pages/OrderOutViewPage";
import RawInViewPage from "../../rawMaterials/inbound/pages/RawInViewPage";
import RawOutViewPage from "../../rawMaterials/outbound/pages/RawOutViewPage";
import OrderViewPage from "../../masterData/items/pages/OrderViewPage";
import RawViewPage from "../../masterData/items/pages/RawViewPage";
import RoutingViewPage from "../../masterData/routings/pages/RoutingViewPage";
import BusinessPartnerViewPage from "../../masterData/companies/pages/BusinessPartnerViewPage";
import InboundHistoryPage from "../../orders/inbound/pages/InboundHistoryPage";
import RawMaterialInventoryStatus from "../../rawMaterials/inventory/RawMaterialInventoryStatus";

const drawerWidth = 260;

// 서브메뉴 타입 정의
interface SubMenu {
  text: string;
  subs?: { text: string }[]; // 3계층을 위한 선택적 하위 메뉴
}

interface MainMenu {
  text: string;
  icon: React.ReactNode;
  subs: SubMenu[];
}

const mainMenus: MainMenu[] = [
  {
    text: "수주 대상 관리",
    icon: <Layers />,
    subs: [
      {
        text: "수주 입고",
        subs: [{ text: "수주 대상 품목 입고" }, { text: "수주 이력 조회" }],
      },
      { text: "수주 출고" },
    ],
  },
  {
    text: "원자재 관리",
    icon: <Layers />,
    subs: [
      { text: "원자재 입고" },
      { text: "원자재 출고" },
      { text: "재고현황" },
    ],
  },
  {
    text: "기준 정보 관리",
    icon: <Layers />,
    subs: [
      { text: "수주 대상 품목 관리" },
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
  const [activeThird, setActiveThird] = useState<string | null>(
    mainMenus[0].subs[0].subs ? mainMenus[0].subs[0].subs[0].text : null
  );

  // 메뉴별 열림 상태 관리
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    [mainMenus[0].text]: true, // 처음엔 첫 메뉴 열림 상태로 시작
  });

  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // 1계층 메뉴 토글 함수
  const toggleMainMenu = (mainText: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [mainText]: !prev[mainText], // 같은 메뉴 클릭 시 토글
    }));

    setActiveMain(mainText);
    const firstSub = mainMenus.find((m) => m.text === mainText)?.subs[0];
    setActiveSub(firstSub?.text || "");
    setActiveThird(firstSub?.subs ? firstSub.subs[0].text : null);
  };

  // 현재 경로 생성
  const currentPath = activeThird
    ? `${activeMain} > ${activeSub} > ${activeThird}`
    : `${activeMain} > ${activeSub}`;

  // ================= 페이지 매핑 =================
  const pageMap: Record<string, React.ReactNode> = {
    // 3계층
    "수주 대상 관리 > 수주 입고 > 수주 대상 품목 입고": <OrderInViewPage />,
    "수주 대상 관리 > 수주 입고 > 수주 이력 조회": <InboundHistoryPage />,

    // 2계층
    "수주 대상 관리 > 수주 출고": <OrderOutViewPage />,
    "원자재 관리 > 원자재 입고": <RawInViewPage />,
    "원자재 관리 > 원자재 출고": <RawOutViewPage />,
    "원자재 관리 > 재고현황": <RawMaterialInventoryStatus />,
    "기준 정보 관리 > 수주 대상 품목 관리": <OrderViewPage />,
    "기준 정보 관리 > 원자재 품목 관리": <RawViewPage />,
    "기준 정보 관리 > 라우팅 관리": <RoutingViewPage />,
    "기준 정보 관리 > 업체 관리": <BusinessPartnerViewPage />,
  };

  const renderPage = () =>
    pageMap[currentPath] || <Typography>페이지를 선택하세요.</Typography>;

  // 2계층 메뉴 클릭 핸들러
  const handleSubClick = (
    mainText: string,
    subText: string,
    hasSubs: boolean
  ) => {
    setActiveMain(mainText);
    setActiveSub(subText);

    const mainMenu = mainMenus.find((m) => m.text === mainText);
    const subMenu = mainMenu?.subs.find((s) => s.text === subText);

    if (hasSubs && subMenu?.subs && subMenu.subs.length > 0) {
      // 3계층이 있는 경우 → 첫 번째 3계층 자동 선택
      const firstThird = subMenu.subs[0].text;
      setActiveThird(firstThird);
    } else {
      // 3계층이 없는 경우 → 바로 페이지 렌더링
      setActiveThird(null);
    }
    if (mainText === "기준 정보 관리" && subText === "라우팅 관리") {
      navigate("/routing");
    }
  };

  // ================= Drawer 내용 =================
  const drawerContent = (
    <Box>
      <Toolbar>
        <Typography variant="h6">MES System</Typography>
      </Toolbar>
      <Divider />
      <List>
        {mainMenus.map((main) => (
          <React.Fragment key={main.text}>
            {/* 1계층 메뉴 */}
            <ListItem disablePadding>
              <ListItemButton
                selected={activeMain === main.text}
                onClick={() => toggleMainMenu(main.text)}
              >
                <ListItemIcon>{main.icon}</ListItemIcon>
                <ListItemText primary={main.text} />
              </ListItemButton>
            </ListItem>

            {/* 2계층 메뉴 - openMenus 상태에 따라 열림 */}
            {openMenus[main.text] && (
              <List sx={{ pl: 2 }}>
                {main.subs.map((sub) => (
                  <React.Fragment key={sub.text}>
                    <ListItem disablePadding>
                      <ListItemButton
                        selected={activeSub === sub.text && !sub.subs}
                        onClick={() =>
                          handleSubClick(main.text, sub.text, !!sub.subs)
                        }
                      >
                        <ListItemText primary={`- ${sub.text}`} />
                      </ListItemButton>
                    </ListItem>

                    {/* 3계층 메뉴 */}
                    {sub.subs && activeSub === sub.text && (
                      <List sx={{ pl: 2 }}>
                        {sub.subs.map((third) => (
                          <ListItem disablePadding key={third.text}>
                            <ListItemButton
                              selected={activeThird === third.text}
                              onClick={() => setActiveThird(third.text)}
                            >
                              <ListItemText
                                primary={`• ${third.text}`}
                                primaryTypographyProps={{ fontSize: "0.9rem" }}
                              />
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
