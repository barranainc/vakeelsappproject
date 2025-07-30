import React, { Fragment, useEffect, useState, useRef, useCallback } from "react";
import {
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  ListItemSecondaryAction,
  CircularProgress,
} from "@mui/material";
import NotificationServices from "../../apis/notifications";
import Colors from "../../assets/styles";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]); 
  const [page, setPage] = useState(1); 
  const [limit] = useState(10); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate()
 
  const [hasMore, setHasMore] = useState(true); 

  const observer = useRef(); 

  
  const getNotifications = async (page, limit) => {
    setLoading(true); 
    try {
      const result = await NotificationServices.getNotifications(page, limit);
      if (result.responseCode === 200) {
        const newNotifications = result?.data?.notifications || [];
        setNotifications((prev) => [...prev, ...newNotifications]); 
        setHasMore(newNotifications.length === limit); 
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    getNotifications(page, limit); 
  }, [page, limit]);

  
  const lastNotificationRef = useCallback(
    (node) => {
      if (loading) return; 
      if (observer.current) observer.current.disconnect(); 
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1); 
        }
      });
      if (node) observer.current.observe(node); 
    },
    [loading, hasMore]
  );

  return (
    <Box>
      <Container maxWidth="lg">
        <Typography
          sx={{
            fontSize: "30px",
            color: Colors.primary,
            fontWeight: "bold",
            fontFamily: "Poppins",
          }}
        >
          Notifications
        </Typography>
        <List sx={{ mt: 1 }}>
  {loading && notifications.length === 0 ? (
    <Box
      sx={{
        height: "400px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  ) : notifications.length > 0 ? (
    <>
      {notifications.map((notification, index) => (
        <Fragment key={notification.id}>
          <ListItem
            ref={index === notifications.length - 1 ? lastNotificationRef : null}
            sx={{cursor:'pointer'}}
            // onClick={()=> navigate("/all-chat",{state:JSON.parse(notification?.data?.room_id)})}
            onClick={()=>{
              navigate("/all-chat", { 
                state: { 
                  room_id: JSON.parse(notification?.data || "{}")?.room_id, 
                  // type: "client_matter"
                 }
              });
            }}
            
          >
            <ListItemText
              primary={
                <>
                  <Typography
                    component="div"
                    fontWeight="bold"
                    sx={{ fontFamily: "Poppins", fontSize: "18px" }}
                  >
                    {notification.title}
                  </Typography>
                  <Typography
                    component="div"
                    sx={{ fontFamily: "Poppins", fontSize: "15px" }}
                  >
                    {notification.content}
                  </Typography>
                </>
              }
            />
            <ListItemSecondaryAction>
              <Typography variant="body2" color="textSecondary">
                {moment(notification.created_at).format(
                  "DD-MM-YYYY hh:mm A"
                )}
              </Typography>
            </ListItemSecondaryAction>
          </ListItem>

          <Divider
            variant="inset"
            component="li"
            sx={{ width: "100%", ml: "0px !important" }}
          />
        </Fragment>
      ))}
      {loading && (
        // Show loader at the bottom during infinite scrolling
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  ) : (
    !loading && (
      <Box
        sx={{
          height: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        No New Notifications
      </Box>
    )
  )}
</List>

      </Container>
    </Box>
  );
};

export default NotificationPage;
