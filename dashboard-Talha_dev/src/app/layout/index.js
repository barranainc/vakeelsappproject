import { Fragment, useState, useEffect } from "react";
import {
  Box,
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  Collapse,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CardMedia,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Breadcrumb Icon
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Colors from "../assets/styles";
import Images from "../assets/images";
import { dashboardNav, paralegalNav } from "./Navigation";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { DropdownIcon } from "../assets/icons";
import "@fontsource/open-sans";
import useAuth from "../hooks/useAuth";
import { baseUrl } from "../config/axios";
import NotificationServices from "../apis/notifications/index";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 300;

function Layout() {
  const [expanded, setExpanded] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [count, setCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false); // New state for mobile drawer

  const open = Boolean(isMenuOpen);
  const { userLogout, image, role } = useAuth();
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const menuOptions = [
    { label: "Account Setting", icon: <AccountCircleIcon fontSize="medium" /> },
    { label: "Sign Out", icon: <ExitToAppIcon fontSize="medium" /> },
  ];

  const handleMenu = (event) => {
    setIsMenuOpen(event.currentTarget);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const location = useLocation();
  const navigate = useNavigate();

  const handleExpandClick = (index) => {
    setExpanded((prevExpanded) => (prevExpanded === index ? null : index));
  };

  const handleLogout = (opt) => {
    if (opt === "Sign Out") {
      userLogout();
      navigate("/login");
    } else if (opt == "Account Setting") {
      console.log("first")
      navigate("/account-setting");
      handleMenuClose();
    }
  };

  const getNotificationCount = async () => {
    try {
      const result = await NotificationServices.getNotificationCount();
      setCount(result?.data?.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotificationCount();
  }, [location]);

  const drawerContent = (
    <Box sx={{ overflow: "auto" }}>
      <Toolbar sx={{ py: "50px" }} />
      <List
        sx={{
          px: 3,
          py: "28px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {role === "admin" &&
          dashboardNav.map((item, index) => (
            <Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{ gap: 1, display: "flex", alignItems: "center" }}
                  onClick={() => {
                    if (item.subMenu) {
                      handleExpandClick(index);
                      handleDrawerToggle();
                    } else {
                      navigate(item.path);
                      handleExpandClick(null);
                      handleDrawerToggle();
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "30px",
                      color:
                        location.pathname.includes(item.path) ||
                        (item.subMenu && expanded === index)
                          ? Colors.primary
                          : Colors.black + "B3",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{
                      ".MuiTypography-root": {
                        fontFamily: "Poppins",
                        fontSize: "16px",
                        fontWeight: 500,
                        color: location.pathname.includes(item.path)
                          ? Colors.primary
                          : Colors.black + "B3",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {item.subMenu &&
                item.subMenu.map((subItem, subIndex) => (
                  <Collapse
                    in={expanded === index}
                    timeout="auto"
                    unmountOnExit
                    key={subIndex}
                  >
                    <List sx={{ py: 0, gap: "8px" }}>
                      <ListItem disablePadding sx={{ py: 0 }}>
                        <ListItemButton
                          onClick={() => {
                            navigate(subItem.path);
                            handleDrawerToggle();
                          }}
                          sx={{ gap: 1 }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: "30px",
                              color: location.pathname.includes(subItem.path)
                                ? Colors.primary
                                : Colors.black + "B3",
                            }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={subItem.name}
                            sx={{
                              ".MuiTypography-root": {
                                fontFamily: "Poppins",
                                fontSize: "16px",
                                fontWeight: 500,
                                color: location.pathname.includes(subItem.path)
                                  ? Colors.primary
                                  : Colors.black + "B3",
                              },
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </Collapse>
                ))}
            </Fragment>
          ))}

        {role === "paralegal" &&
          paralegalNav.map((item, index) => (
            <Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{ gap: 1, display: "flex", alignItems: "center" }}
                  onClick={() => {
                    if (item.subMenu) {
                      handleExpandClick(index);
                      handleDrawerToggle();
                    } else {
                      navigate(item.path);
                      handleExpandClick(null);
                      handleDrawerToggle();
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: "30px",
                      color:
                        location.pathname.includes(item.path) ||
                        (item.subMenu && expanded === index)
                          ? Colors.primary
                          : Colors.black + "B3",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{
                      ".MuiTypography-root": {
                        fontFamily: "Poppins",
                        fontSize: "16px",
                        fontWeight: 500,
                        color: location.pathname.includes(item.path)
                          ? Colors.primary
                          : Colors.black + "B3",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {item.subMenu &&
                item.subMenu.map((subItem, subIndex) => (
                  <Collapse
                    in={expanded === index}
                    timeout="auto"
                    unmountOnExit
                    key={subIndex}
                  >
                    <List sx={{ py: 0, gap: "8px" }}>
                      <ListItem disablePadding sx={{ py: 0 }}>
                        <ListItemButton
                          onClick={() => {
                            navigate(subItem.path);
                            handleDrawerToggle();
                          }}
                          sx={{ gap: 1 }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: "30px",
                              color: location.pathname.includes(subItem.path)
                                ? Colors.primary
                                : Colors.black + "B3",
                            }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={subItem.name}
                            sx={{
                              ".MuiTypography-root": {
                                fontFamily: "Poppins",
                                fontSize: "16px",
                                fontWeight: 500,
                                color: location.pathname.includes(subItem.path)
                                  ? Colors.primary
                                  : Colors.black + "B3",
                              },
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </Collapse>
                ))}
            </Fragment>
          ))}
        {/* Add Paralegal Nav similarly if required */}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100%" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: Colors.body,
          py: "4px",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isSmallScreen && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon sx={{ color: Colors.black }} />
              </IconButton>
            )}
            <CardMedia
              component="img"
              src={Images.logo}
              sx={{
                width: { lg: "100%", md: "100%", sm: "100%", xs: "70%" },
                height: "70px",
                objectFit: "contain",
              }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Badge
              sx={{ mr: 2 }}
              badgeContent={count === 0 ? "0" : count}
              color="primary"
            >
              <NotificationsIcon
                onClick={() => navigate("/notification")}
                sx={{
                  color: Colors.primary,
                  fontSize: "35px",
                  cursor: "pointer",
                }}
              />
            </Badge>
            <Box
              sx={{ display: "flex", cursor: "pointer" }}
              onClick={handleMenu}
            >
              <Avatar
                alt="Profile Image"
                sx={{
                  width: { lg: "50px", md: "50px", sm: "50px", xs: "40px" },
                  height: { lg: "50px", md: "50px", sm: "50px", xs: "40px" },
                }}
                src={baseUrl + image}
              />
              <IconButton>
                <DropdownIcon />
              </IconButton>
            </Box>
            <Menu
              sx={{
                "& .MuiMenuItem-root": {
                  fontFamily: "'Poppins', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  p: "10px 20px",
                  color: "#000000B3",
                },
              }}
              open={open}
              anchorEl={isMenuOpen}
              onClose={handleMenuClose}
            >
              {menuOptions.map((option, index) => (
                <MenuItem
                  key={index}
                  onClick={() => handleLogout(option.label)}
                >
                  {option.icon}
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isSmallScreen ? "temporary" : "permanent"}
        open={isSmallScreen ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: Colors.body,
            borderRight: `1px solid ${Colors.white}1A`,
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 3px 8px",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, width: "60%" }}>
        <Toolbar sx={{ py: "50px" }} />
        <Box sx={{ p: 3, height: "calc(100% - 100px)" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
