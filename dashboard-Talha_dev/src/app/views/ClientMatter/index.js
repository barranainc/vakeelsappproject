import React, { Fragment, useState, useEffect } from "react";
import {
  Box,
  Grid2,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Paper,
  Tooltip,
  Pagination,
  CircularProgress,
  Button,
  PaginationItem,
  styled,
  TextField
} from "@mui/material";
import ClientServices from "../../apis/client/ClientServices";
import Colors from "../../assets/styles";
import { useNavigate } from "react-router-dom";
import TelegramIcon from "@mui/icons-material/Telegram";
import ChatServices from "../../apis/chat";
import { ErrorToaster, SuccessToaster } from "../../components/toaster";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

const Grid = (props) => <Grid2 {...props} />;

function ClientMatter() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    
  };

  const tableHeaders = [
    { key: "clientName", label: "Client Name" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "subCategory", label: "Sub-Category" },
    { key: "description", label: "Description" },
    { key: "action", label: "Action" },
  ];
  useEffect(() => {
    
    const delaySearch = setTimeout(() => {
      getClientMatter(searchText, page, limit);
    }, 500); 

    return () => clearTimeout(delaySearch);
  
  }, [searchText, page, limit]);

  const StyledPagination = styled(Pagination)(({ theme }) => ({
    "& .MuiPaginationItem-root": {
      margin: theme.spacing(0, 0.5),
      borderRadius: "50%",
      color: "rgb(15 81 137)",
      border: `2px solid rgb(15 81 137)`,
      "&.Mui-selected": {
        backgroundColor: "rgb(15 81 137)",
        color: theme.palette.primary.contrastText,
        fontWeight: "bold",
      },
      "&:hover": {
        backgroundColor: "rgb(15 81 137)",
        color: "white",
      },
      transition: "all 0.3s ease-in-out",
    },
  }));
  

  const getClientMatter = async (searchText, page, limit) => {
    setLoading(true);

    try {
      const result = await ClientServices.clientMatter(
        searchText || "",
        page || 1,
        limit || 10
      );
      if (result.responseCode === 200) {
        setRows(result?.data?.matters || []);
        setCount(result?.data?.count || 0);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    getClientMatter(searchText, page, limit);
  }, [page, limit]);
  
  const handleSendRespond = async (data) => {
    // navigate("/chat")
    const obj = {
      client_id: data?.client_id,
      type: "client_matter",
      type_id: data?._id,
      type_name: data?.title,
    };
    try {
      const result = await ChatServices.sendRequest(obj);
      if (result.responseCode === 200) {
        setResponse(result);
        SuccessToaster(result.message);
        navigate("/all-chat", { 
          state: { 
            room_id: result?.data?.room_id, 
            type: "client_matter"
           }
        });
      }
    } catch (error) {
      ErrorToaster(error?.message);
      navigate("/all-chat",{state : {
        room_id : error?.error?.room_id,
         type: "client_matter"
      
      }});

    }
  };

  return (
    <Fragment>
      <Grid container rowGap={3}>
        <Grid size={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap:"wrap"
            }}
          >
            <Typography
              sx={{
                fontSize: "28px",
                fontWeight: "bold",
                fontFamily: "Open Sans",
                color: Colors.primary,
                fontFamily:"Poppins"
              }}
            >
              Client Matter
            </Typography>
            <TextField
          placeholder="Search"
          variant="outlined"
          value={searchText}
          onChange={handleSearchChange}
          sx={{ width: "300px" }}
        />
          </Box>
        </Grid>
        <Grid size={12}>
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
              borderRadius: "15px",
              overflow: "hidden",
              mt: 1,
              height: "400px",
              overflow: "auto",
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="custom styled table">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: Colors.primary,
                    position: "sticky",
                    top: 0,
                    zIndex:1

                  }}
                >
                  {tableHeaders.map((header) => (
                    <TableCell
                      key={header.key}
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",fontFamily:"Poppins",
                        color: Colors.white,
                        fontFamily:"Poppins"
                      }}
                    >
                      {header.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={tableHeaders?.length}
                      sx={{
                        textAlign: "center",fontFamily:"Poppins",
                        py: 3,
                        borderBottom: "none !important",
                        height: "300px",
                      }}
                    >
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow
                      sx={{ cursor: "pointer" }}
                      key={row.id}
                    
                    >
                      <TableCell sx={{ textAlign: "center",fontFamily:"Poppins" }}>
                        {row?.client?.first_name + " " + row?.client?.last_name}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center",fontFamily:"Poppins" }}>
                        {row?.title || "-"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center",fontFamily:"Poppins" }}>
                        {row?.category?.name || "-"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center",fontFamily:"Poppins" }}>
                        {row?.subcategory?.name || "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",fontFamily:"Poppins",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "400px",
                        }}
                      >
                        <Tooltip title={row?.description || ""} arrow>
                          <span>{row?.description || "-"}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell >
                        <Box  sx={{
                          textAlign: "center",
                          fontFamily:"Poppins",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 2,
                        }}
                        onClick={(e) => e.stopPropagation()}>

                       
                        <Tooltip title={"Details"}>

                        <MoreVertIcon
                          sx={{ color: Colors.primary, cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/client-matter-detail/${row?._id}`)
                          }
                          />
                          </Tooltip>

                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: Colors.primary,
                            textTransform: "none",
                            borderRadius:'20px '
                          }}
                          onClick={() => handleSendRespond(row)}
                        >
                          Respond
                        </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
           <Box
            component={Paper}
            sx={{
              display: "flex",
              flexWrap:"wrap",
              gap:2,
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              p: 2,
              borderRadius: 4,
            }}
          >
            <Typography variant="body1">
              Showing ({(page - 1) * limit + 1} -{" "}
              {Math.min(page * limit, count)}) of {count} entries
              {/* (Page {page} of {Math.ceil(count / limit)}) */}
            </Typography>

            <StyledPagination
              count={Math.ceil(count / limit)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              renderItem={(item) => (
                <PaginationItem
                  slots={{
                    next: NavigateNext,
                    previous: NavigateBefore,
                  }}
                  {...item}
                />
              )}
            />
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default ClientMatter;
