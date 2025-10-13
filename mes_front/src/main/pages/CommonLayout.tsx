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
  Typography
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

// 메뉴 데이터 (기존과 동일)
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
  // ✅ 1. 모바일 사이드바 열림/닫힘 상태 추가
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMain, setActiveMain] = useState(mainMenus[0].text);
  const [activeSub, setActiveSub] = useState(mainMenus[0].subs[0].text);
  const [activeThird, setActiveThird] = useState(mainMenus[0].subs[0].subMenus[0]);

  // ✅ 2. 모바일 사이드바 토글 핸들러 추가
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  // ✅ 사이드바 UI를 별도 컴포넌트로 분리 (재사용을 위해)
  const drawerContent = (
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
              <List sx={{ pl: 2, bgcolor: "#fafafa" }}>
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
                      <List sx={{ pl: 3, bgcolor: "#f5f5f5" }}>
                        {sub.subMenus.map((third) => (
                          <ListItem disablePadding key={third}>
                            <ListItemButton
                              selected={activeThird === third}
                              onClick={() => {
                                setActiveThird(third);
                                // ✅ 모바일에서 메뉴 선택 시 사이드바 닫기
                                if(mobileOpen) handleDrawerToggle();
                              }}
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
          {/* ✅ 3. 메뉴 아이콘(햄버거 버튼)에 토글 핸들러 연결 */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }} // sm 사이즈 이상에서는 안보임
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {currentPath}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ✅ 4. 반응형 사이드바를 위해 Box로 감싸기 */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* 모바일용 Drawer (Temporary) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" }, // xs 사이즈에서만 보임
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* 데스크탑용 Drawer (Permanent) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" }, // sm 사이즈 이상에서만 보임
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
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
          backgroundColor: "#f7f9fb",
          minHeight: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        {/* 이전 답변에서 안내드린 것처럼, 페이지 전체에 minWidth를 주는 대신
          테이블처럼 넓이가 필요한 특정 컴포넌트에 minWidth를 주는 것이 좋습니다.
          여기서는 Box의 minWidth를 제거합니다.
        */}
        <Box>
          {renderPage()}
        </Box>
      </Box>
    </Box>
  );
}