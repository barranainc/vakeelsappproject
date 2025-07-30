import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Paper,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  styled,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  CardMedia,
  Tooltip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import moment from "moment";
import Colors from "../../assets/styles";
import ChatServices from "../../apis/chat";
import { baseUrl } from "../../config/axios";
import { socketConfig } from "../../config/axios/socket";
import LaunchIcon from "@mui/icons-material/Launch";
import { io } from "socket.io-client";
import Images from "../../assets/images";
import { useLocation, useNavigate } from "react-router-dom";


const theme = createTheme({
  palette: {
    primary: {
      main: "#075E54",
    },
    secondary: {
      main: "#128C7E",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
  },
});

const WhatsAppClone = () => {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedToggle, setSelectedToggle] = useState("client_matter");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [chatLoading, setchatLoading] = useState(false);
  const [lastChat, setLastChat] = useState(null);
  const [count, setCount] = useState(0);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);

  const chatEndRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const chatStartRef = useRef(null);
  const { state } = useLocation();
  const RoomID = state;
  const navigate = useNavigate();
  const socket = io("https://vakeelserver.barrana.io");
  const [isScrolling, setIsScrolling] = useState(false);
  const [messageSent, setMessageSent] = useState(false); 

  const MessageBubble = styled(Paper)(({ theme, sender }) => ({
    padding: "5px 15px",
    maxWidth: "60%",
    borderRadius:
      sender?.sender_id == selectedChat?.requester_id
        ? "20px 20px 0 20px"
        : "20px 20px 20px 0",
    backgroundColor:
      sender?.sender_id == selectedChat?.requester_id
        ? Colors.primary
        : "rgb(101 158 211)",
    alignSelf:
      sender?.sender_id == selectedChat?.requester_id
        ? "flex-end"
        : "flex-start",
    marginBottom: theme.spacing(1),
    wordBreak: "break-word",
    overflowWrap: "break-word",
  }));

  const handleToggleChange = async (event, newValue) => {
    if (newValue !== null) {
      setSelectedToggle(newValue);

      setLoading(true);
      try {
        const result = await ChatServices.getAllChat(newValue);
        if (result.responseCode === 200) {
          setChats(result?.data?.chats);
          setSelectedChat(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };
 
  useEffect(() => {
    if (RoomID?.type != "") {
      setSelectedToggle(
        RoomID?.type == "client_request" ? "client_request" : "client_matter"
      );
    }
  }, [RoomID]);
  console.log(selectedToggle, "selectedTogoke");

 

  const getRoomDetail = async () => {
    try {
      const result = await ChatServices.getRoomDetail(RoomID?.room_id);
      if (result.responseCode === 200) {
        setSelectedToggle(
          result?.data?.details?.requestDetails._id
            ? "client_request"
            : "client_matter"
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  console.log(messages, "DataData");

  const groupMessagesByDate = (messages) => {
    return messages.reduce((acc, message) => {
      const date = moment(message.created_at).format("DD-MM-YYYY");
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});
  };
  const groupedMessages = groupMessagesByDate(messages);

 

  const chatContainerRef = useRef(null);

  let timeoutId = null;

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const element = chatContainerRef.current;
      const scrollTop = element.scrollTop;

      // Prevent setting isScrolling to true if it's a new chat or initial load
      if (scrollTop <= 5 && !isInitialLoad && !isNewChatOpen) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }

      if (scrollTop <= 5) {
        timeoutId = setTimeout(() => {
          if (!chatLoading) {
            setPage((prevPage) => {
              const maxPages = Math.ceil(count / 10);
              if (prevPage < maxPages) {
                return prevPage + 1;
              }
              return prevPage;
            });
          }
        }, 500);
      }
    }
  };
  const openNewChat = (chat) => {
    setIsNewChatOpen(true);
    setIsScrolling(false);
    setTimeout(() => {
      setIsNewChatOpen(false);
    }, 300);
  };

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    console.log(isScrolling, "isScroll");
    if (!isScrolling) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedChat]);

  useEffect(() => {
    getRoomDetail();
  }, [RoomID]);

 
  

  useEffect(() => {
    if (selectedChat!= null || RoomID != null) {
      socket.emit(
        "joinRoom",
        selectedChat?.room_details?._id || RoomID?.room_id
      );
    }
  
    // Socket listener for receiveMessage
    const handleReceiveMessage = (messageData) => {
      console.log(messageData, "DataData");
      const parsedData = JSON.parse(messageData);
      console.log(parsedData, "DataData");
        setLastChat(parsedData);
      setMessages((prevMessages) => [...prevMessages, parsedData]);
      console.log("messages ==>> ", messages);
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
      socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [selectedChat]); 

  const handleSendMessage = () => {
    let newMessage = document.getElementById("input").value;
    if (newMessage == "") {
      return;
    } else if (newMessage.trim()) {
      const messageData = {
        room_id: selectedChat?.room_details?._id
          ? selectedChat?.room_details?._id
          : RoomID?.room_id,
        sender_id: selectedChat?.requester_id,
        receiver_id: selectedChat?.client_id,
        message: newMessage,
        type: selectedChat?.type == "client_matter" ? "Matter" : "Request",
        type_name:
          selectedToggle == "client_matter"
            ? selectedChat?.client_matter_details[0]?.title
            : selectedChat?.client_request_details[0]?.title,
      };

      console.log(messageData ,"messageData232")

      socket.emit("sendMessage", messageData);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      // setNewMessage("");
      document.getElementById("input").value = "";
    }
  };
  
  console.log("selectedChat ==>>>>", selectedChat);
  const getChatWithRoomId = async (selectedChat) => {
    setchatLoading(true);

    try {
      const roomId = selectedChat?.room_details?._id || RoomID?.room_id;

      if (!roomId) {
        console.error("No valid room ID found");
        return;
      }

      const result = await ChatServices.getChatWithRoomId(roomId, page, 10);

      if (result.responseCode === 200) {
        setCount(result?.data?.count);

        const newMessages = result?.data?.users?.slice().reverse();
        setMessages((prevMessages) => [...newMessages, ...prevMessages]);

        if (roomId && result?.data?.count == 0 && selectedChat) {
          console.log(result?.data?.count, "messageData44");

          const messageData = {
            room_id: roomId,
            sender_id: selectedChat?.requester_id,
            receiver_id: selectedChat?.client_id,
            message: selectedToggle === "client_matter" ? "Hello! Thank you for submitting your case.I've reviewed the details you've provided and I'm here to help.Please feel free to share any additional information or documents.Looking forward to assisting  you further!":  "Thank you for the request, please share more documents.", 
            type: selectedChat?.type === "client_matter" ? "Matter" : "Request",
            type_name:
              selectedToggle === "client_matter"
                ? selectedChat?.client_matter_details[0]?.title
                : selectedChat?.client_request_details[0]?.title,
          };
          socket.emit("sendMessage", messageData);
          chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }
    } catch (error) {
      console.error("Error in getChatWithRoomId:", error);
    } finally {
      setchatLoading(false);
    }
  };
  
  console.log(page , "page");
  
  useEffect(() => {
    if (selectedChat !=null) {
      getChatWithRoomId(selectedChat);
    }
  }, [page]); 
  
  const getAllChats = async () => {
    try {
      const result = await ChatServices.getAllChat(selectedToggle);
      if (result.responseCode === 200) {
        const allChats = result?.data?.chats;
        setChats(allChats);
        if (RoomID?.room_id && !selectedChat) {
          const matchingChat = allChats.find(
            (chat) => chat.room_details?._id === RoomID.room_id
          );

          if (matchingChat) {
            getChatWithRoomId(matchingChat)
            setSelectedChat(matchingChat);            
          } else {
           
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  // useEffect(() => {
  //   getAllChats();
  // }, [selectedToggle ,RoomID ,lastChat]);
  useEffect(() => {
    getAllChats();
      const timer = setInterval(() => {
      getAllChats();
    }, 10000);
      return () => clearInterval(timer);
  }, [selectedToggle, RoomID, lastChat]);
  

  return (
    <ThemeProvider theme={theme} sx={{ padding: "0px 24px !important" }}>
      <Box sx={{ height: "80vh", display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 1, borderBottom: 1, borderColor: "divider" }}>
          <ToggleButtonGroup
            value={selectedToggle}
            exclusive
            onChange={handleToggleChange}
            aria-label="Chat Type"
            sx={{ width: "100%", display: "flex", justifyContent: "end" }}
          >
            <ToggleButton
              sx={{
                borderTopLeftRadius: "20px ",
                borderBottomLeftRadius: "20px ",
                "&.Mui-selected": {
                  backgroundColor: Colors.primary,
                  color: "white",
                },
                fontFamily: "Poppins",
              }}
              value="client_matter"
              aria-label="Client Matter"
            >
              Client Matter
            </ToggleButton>
            <ToggleButton
              sx={{
                borderTopRightRadius: "20px ",
                borderBottomRightRadius: "20px ",
                "&.Mui-selected": {
                  backgroundColor: Colors.primary,
                  color: "white",
                },
                fontFamily: "Poppins",
              }}
              value="client_request"
              aria-label="Client Request"
            >
              Client Request
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {loading ? (
          <>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </Box>
          </>
        ) : chats?.length > 0 ? (
          <>
            <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
              <Box
                sx={{
                  width: { xs: "100%", sm: "350px" },
                  borderRight: 1,
                  borderColor: "divider",
                }}
              >
                <AppBar position="static" color="default" elevation={0}>
                  <Toolbar
                    sx={{
                      background: Colors.primary,
                      borderTopLeftRadius: "10px",
                      borderBottomLeftRadius: "10px",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        flexGrow: 1,
                        color: Colors.white,
                        fontFamily: "Poppins",
                      }}
                    >
                      Chats
                    </Typography>
                  </Toolbar>
                </AppBar>

                <List
                  sx={{
                    overflow: "auto",
                    height: "460px",
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  {chats.map((chat) => {
                    console.log(chat?._id === selectedChat?._id ," ==>>> chat")
                    return(

                    <React.Fragment key={chat._id}>
                      <ListItem
                        button
                        style={{ backgroundColor:chat?._id === selectedChat?._id ? 'rgb(86 86 86 / 17%)' : "" }}
                        sx={{
                          cursor: "pointer",
                          backgroundColor:
                            chat?._id === selectedChat?._id
                              ? "rgb(86 86 86 / 17%)"
                              : "",
                        }}
                        onClick={() => {
                          if (selectedChat?._id == chat?._id) {
                            setSelectedChat(chat);
                            getChatWithRoomId(chat)
                          } else {
                            setSelectedChat(chat);
                            getChatWithRoomId(chat)
                            setMessages([]);
                            openNewChat();
                          }
                          setPage(1);
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={baseUrl + "/" + chat?.client_details?.picture}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontFamily: "Poppins",
                              }}
                            >
                              <Box sx={{ fontFamily: "Poppins" }}>
                                {/* Client Name */}
                                <Box>
                                  {chat?.client_details?.first_name +
                                    " " +
                                    chat?.client_details?.last_name}
                                </Box>

                                <Tooltip
                                  title={
                                    chat?.client_matter_details?.[0]?.title ||
                                    chat?.client_request_details?.[0]?.title
                                  }
                                >
                                  <Box
                                    sx={{
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      width: "100px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {chat?.client_matter_details?.[0]?.title ||
                                      chat?.client_request_details?.[0]?.title}
                                  </Box>
                                </Tooltip>
                              </Box>
                             
                              {console.log(lastChat, "messageData2")}

                              {chat?.last_chat && (
                                <Box
                                  sx={{
                                    fontSize: "13px",
                                    fontFamily: "Poppins",
                                  }}
                                >
                                  {lastChat?.sender_id ===
                                    chat?.last_chat?.sender_id &&
                                  lastChat?.receiver_id ===
                                    chat?.last_chat?.receiver_id
                                    ? moment(lastChat?.created_at).format(
                                        "hh:mm a"
                                      )
                                    : moment(chat?.last_chat?.sent_at).format(
                                        "hh:mm a"
                                      )}
                                </Box>
                              )}
                            </Box>
                          }
                          secondary={
                            <>
                              {chat?.last_chat &&
                                (chat?.last_chat?.is_seen ? (
                                  <DoneAllIcon
                                    sx={{
                                      color: "rgb(101 158 211)",
                                      fontSize: "1rem",
                                      verticalAlign: "middle",
                                      marginRight: "4px",
                                    }}
                                  />
                                ) : (
                                  <DoneAllIcon
                                    sx={{
                                      color: "gray",
                                      fontSize: "1rem",
                                      verticalAlign: "middle",
                                      marginRight: "4px",
                                    }}
                                  />
                                ))}

                              {lastChat &&
                              lastChat?.sender_id ===
                                chat?.last_chat?.sender_id &&
                              lastChat?.receiver_id ===
                                chat?.last_chat?.receiver_id
                                ? lastChat?.message
                                : chat?.last_chat
                                ? chat?.last_chat?.message
                                : "No New Messaages"}
                            </>
                          }
                          secondaryTypographyProps={{ noWrap: true }}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                    )
})}
                </List>
              </Box>

              <Box
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                {selectedChat ? (
                  <>
                    <AppBar position="static" color="default" elevation={1}>
                      <Toolbar
                        sx={{
                          background: Colors.primary,
                          display: "flex",
                          justifyContent: "space-between",
                          borderTopRightRadius: "10px",
                          borderBottomRightRadius: "10px",
                        }}
                      >
                        {selectedChat && (
                          <>
                            <Typography
                              variant="h6"
                              sx={{
                                flexGrow: 1,
                                color: Colors.white,
                                fontFamily: "Poppins",
                              }}
                            >
                              {selectedChat?.client_details?.first_name +
                                " " +
                                selectedChat?.client_details?.last_name}{" "}
                              -{" "}
                              {selectedToggle == "client_matter"
                                ? selectedChat?.client_matter_details[0]?.title
                                : selectedChat?.client_request_details[0]
                                    ?.title}
                            </Typography>
                            <IconButton
                              onClick={() =>
                                navigate(
                                  selectedToggle === "client_matter"
                                    ? `/client-matter-detail/${selectedChat?.type_id}`
                                    : `/client-request-detail/${selectedChat?.type_id}`
                                )
                              }
                            >
                              <LaunchIcon sx={{ color: Colors.white }} />
                            </IconButton>
                          </>
                        )}
                      </Toolbar>
                    </AppBar>
                    <Box
                      sx={{
                        flex: 1,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        p: "0px ",
                        backgroundColor: Colors.white,
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          flex: 1,
                          overflow: "auto",
                          p: "0px",

                          backgroundColor: "transparent",
                          backgroundColor: "transparent",

                          "&::-webkit-scrollbar": {
                            display: "none",
                          },
                        }}
                      >
                        <List>
                          <div ref={chatContainerRef}></div>

                          <Box
                            onScroll={handleScroll}
                            sx={{
                              overflowY: "auto",
                              maxHeight: "830px",

                              "&::-webkit-scrollbar": {
                                display: "none !important",
                              },
                            }}
                            ref={chatContainerRef}
                          >
                            {chatLoading && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: "10px",
                                }}
                              >
                                <CircularProgress
                                  size={40}
                                  sx={{ color: Colors.primary }}
                                />
                              </div>
                            )}

                            <div ref={chatStartRef}></div>

                            {Object.entries(groupedMessages).map(
                              ([date, messages]) => (
                                <div key={date}>
                                  <Typography
                                    sx={{
                                      color: Colors.primary,
                                      fontWeight: "bold",
                                      textAlign: "center",
                                      fontSize: "15px",
                                    }}
                                  >
                                    {date}
                                  </Typography>
                                  {messages.map((message, index) => (
                                    <ListItem
                                      key={message._id}
                                      sx={{
                                        display: "flex",
                                        justifyContent:
                                          message.sender_id ===
                                          selectedChat?.requester_id
                                            ? "flex-end"
                                            : "flex-start",
                                      }}
                                      ref={
                                        index === messages.length - 1
                                          ? chatEndRef
                                          : null
                                      }
                                    >
                                      <MessageBubble sender={message}>
                                        <ListItemText
                                          primary={message.message}
                                          secondary={moment(
                                            message.created_at
                                          ).format("hh:mm a")}
                                          sx={{
                                            "& .MuiListItemText-primary": {
                                              color: "#FFFFFF",
                                              fontFamily: "Poppins",
                                            },
                                            "& .MuiListItemText-secondary": {
                                              color: "#ffffff",
                                              display: "flex",
                                              justifyContent: "end",
                                              fontSize: "12px",
                                              fontFamily: "Poppins",
                                            },
                                          }}
                                        />
                                      </MessageBubble>
                                    </ListItem>
                                  ))}
                                </div>
                              )
                            )}
                          </Box>

                          {/* <div ref={chatEndRef}></div> */}
                        </List>
                      </Paper>
                    </Box>
                    <Paper
                      elevation={3}
                      sx={{ p: 1, display: "flex", alignItems: "center" }}
                    >
                      <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Type a message"
                        id={"input"}
                        // onChange={(e) => console.log(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage();
                          }
                        }}
                        InputProps={{
                          disableUnderline: true,
                        }}
                        sx={{ mx: 1, fontFamily: "Poppins" }}
                      />

                      {true && (
                        <IconButton
                          id="sendIcon"
                          sx={{ color: Colors.primary }}
                          onClick={handleSendMessage}
                        >
                          <SendIcon />
                        </IconButton>
                      )}
                    </Paper>
                  </>
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="100vh"
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: 300, height: "auto" }}
                      image={Images.logo}
                      alt="Chat Icon"
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Poppins",
              }}
            >
              No Chat Found
            </Box>
          </>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default WhatsAppClone;
