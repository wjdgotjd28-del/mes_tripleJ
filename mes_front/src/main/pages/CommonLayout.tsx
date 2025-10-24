// src/main/pages/CommonLayout.tsx
import React, { useState, useEffect } from "react";
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
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 260;

// 서브메뉴 타입 정의
interface SubMenu {
  text: string;
  subs?: { text: string }[];
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
        subs: [
          { text: "수주 대상 품목 입고" },
          { text: "수주 입고 이력 조회" },
        ],
      },
      { text: "수주 출고" },
    ],
  },
  {
    text: "원자재 관리",
    icon: <Layers />,
    subs: [
      {
        text: "원자재 입고",
        subs: [{ text: "원자재 품목 입고" }, { text: "원자재 입고 이력 조회" }],
      },
      { text: "원자재 출고" },
      { text: "재고 현황" },
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
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMain, setActiveMain] = useState(mainMenus[0].text);
  const [activeSub, setActiveSub] = useState(mainMenus[0].subs[0].text);
  const [activeThird, setActiveThird] = useState<string | null>(
    mainMenus[0].subs[0].subs ? mainMenus[0].subs[0].subs[0].text : null
  );

  // 메뉴별 열림 상태 관리
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    [mainMenus[0].text]: true,
  });

  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // 1계층 메뉴 토글 함수
  const toggleMainMenu = (mainText: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [mainText]: !prev[mainText],
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

  // ================= 페이지 라우트 매핑 =================
  const routeMap: Record<string, string> = {
    // 3계층
    "수주 대상 관리 > 수주 입고 > 수주 대상 품목 입고": "/orders/inbound/items",
    "수주 대상 관리 > 수주 입고 > 수주 입고 이력 조회":
      "/orders/inbound/history",
    "원자재 관리 > 원자재 입고 > 원자재 품목 입고":
      "/raw-materials/inbound/items",
    "원자재 관리 > 원자재 입고 > 원자재 입고 이력 조회":
      "/raw-materials/inbound/history",

    // 2계층
    "수주 대상 관리 > 수주 출고": "/orders/outbound",
    "원자재 관리 > 원자재 출고": "/raw-materials/outbound",
    "원자재 관리 > 재고 현황": "/raw-materials/inventory",
    "기준 정보 관리 > 수주 대상 품목 관리": "/items/order/view",
    "기준 정보 관리 > 원자재 품목 관리": "/items/raw/view",
    "기준 정보 관리 > 라우팅 관리": "/routings",
    "기준 정보 관리 > 업체 관리": "/companies",
  };

  // 라우트 -> 메뉴 경로 역매핑
  const pathToMenuMap: Record<
    string,
    { main: string; sub: string; third: string | null }
  > = {
    "/orders/inbound/items": {
      main: "수주 대상 관리",
      sub: "수주 입고",
      third: "수주 대상 품목 입고",
    },
    "/orders/inbound/history": {
      main: "수주 대상 관리",
      sub: "수주 입고",
      third: "수주 입고 이력 조회",
    },
    "/orders/outbound": {
      main: "수주 대상 관리",
      sub: "수주 출고",
      third: null,
    },
    "/raw-materials/inbound/items": {
      main: "원자재 관리",
      sub: "원자재 입고",
      third: "원자재 품목 입고",
    },
    "/raw-materials/inbound/history": {
      main: "원자재 관리",
      sub: "원자재 입고",
      third: "원자재 입고 이력 조회",
    },
    "/raw-materials/outbound": {
      main: "원자재 관리",
      sub: "원자재 출고",
      third: null,
    },
    "/raw-materials/inventory": {
      main: "원자재 관리",
      sub: "재고 현황",
      third: null,
    },
    "/items/order/view": {
      main: "기준 정보 관리",
      sub: "수주 대상 품목 관리",
      third: null,
    },
    "/items/raw/view": {
      main: "기준 정보 관리",
      sub: "원자재 품목 관리",
      third: null,
    },
    "/routings": { main: "기준 정보 관리", sub: "라우팅 관리", third: null },
    "/companies": { main: "기준 정보 관리", sub: "업체 관리", third: null },
  };

  // 새로고침 시 충돌 방지용 state
  const [isInitialSync, setIsInitialSync] = useState(true);

  // URL → 메뉴 상태 동기화
  useEffect(() => {
    const menuState = pathToMenuMap[location.pathname];
    if (menuState) {
      setActiveMain(menuState.main);
      setActiveSub(menuState.sub);
      setActiveThird(menuState.third);

      setOpenMenus((prev) => ({
        ...prev,
        [menuState.main]: true,
      }));
    }
  }, [location.pathname]);

  // mount 후 1회만 navigate 활성화
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialSync(false), 0);
    return () => clearTimeout(timer);
  }, []);

  // 메뉴 상태 → URL 이동
  useEffect(() => {
    const isManual = sessionStorage.getItem("manualNav") === "true";
    if (isManual) {
      sessionStorage.removeItem("manualNav");
      return; // ✅ 수동 이동 직후에는 자동 navigate 비활성화
    }

    if (isInitialSync) return;
    const targetRoute = routeMap[currentPath];
    if (!targetRoute || location.pathname === targetRoute) return;

    navigate(targetRoute, { replace: true });
  }, [currentPath, location.pathname, navigate, isInitialSync]);

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
  };

  const handleThirdClick = (main: string, sub: string, third: string) => {
    setActiveMain(main);
    setActiveSub(sub);
    setActiveThird(third);
    const path = routeMap[`${main} > ${sub} > ${third}`];
    if (path) navigate(path);
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
                        // selected={activeSub === sub.text && !sub.subs}
                        selected={activeSub === sub.text && !sub.subs}
                        onClick={() =>
                          handleSubClick(main.text, sub.text, !!sub.subs)
                        }
                      >
                        <ListItemText primary={`- ${sub.text}`} />
                      </ListItemButton>
                    </ListItem>

                    {/* 3계층 메뉴 */}
                    {/* {sub.subs && activeSub === sub.text && ( */}
                    {sub.subs && (
                      <List sx={{ pl: 2 }}>
                        {sub.subs.map((third) => (
                          <ListItem disablePadding key={third.text}>
                            <ListItemButton
                              selected={activeThird === third.text}
                              onClick={() =>
                                handleThirdClick(
                                  main.text,
                                  sub.text,
                                  third.text
                                )
                              }
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
        <Outlet />
      </Box>
    </Box>
  );
}
