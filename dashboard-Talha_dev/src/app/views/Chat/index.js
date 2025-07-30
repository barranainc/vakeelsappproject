
import { useState } from "react"
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
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import Colors from "../../assets/styles"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
})



const initialMessages = [
  { id: 1, text: "Hello! How can I help you today?", sender: "bot" },
  { id: 2, text: "Hi! I have a question about your services.", sender: "user" },
]

const ChatApp  = () => {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const name = "John Doe" // You can replace this with any name you want

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const userMessage = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
      }
      setMessages([...messages, userMessage])
      setNewMessage("")

      // Simulate bot response
      setTimeout(() => {
        const botMessage = {
          id: messages.length + 2,
          text: "Thank you for your message. How else can I assist you?",
          sender: "bot",
        }
        setMessages((prevMessages) => [...prevMessages, botMessage])
      }, 1000)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <AppBar position="static">
          <Toolbar sx={{background:Colors.primary }}>
            <Avatar sx={{ mr: 2 }}>{name[0].toUpperCase()}</Avatar>
            <Typography variant="h6">{name}</Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <Paper elevation={3} sx={{ flex: 1, overflow: "auto", p: 2, mb: 2 }}>
            <List>
              {messages.map((message) => (
                <ListItem
                  key={message.id}
                  sx={{ justifyContent: message.sender === "user" ? "flex-end" : "flex-start" }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: "70%",
                      bgcolor: message.sender === "user" ? Colors.primary : "rgb(101 158 211)",
                      borderRadius: message.sender === "user" ? "20px 20px 0 20px" : "20px 20px 20px 0",
                    }}
                  >
                    <ListItemText
                      primary={message.text}
                      sx={{
                        "& .MuiListItemText-primary": {
                          color: message.sender === "user" ? "primary.contrastText" : "secondary.contrastText",
                        },
                      }}
                    />
                  </Paper>
                </ListItem>
              ))}
            </List>
          </Paper>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ display: "flex" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage()
                  }
                }}
              />
              <Button
                variant="contained"
               
                endIcon={<SendIcon />}
                onClick={handleSendMessage}
                sx={{ ml: 1  ,background:Colors.primary}}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default ChatApp

