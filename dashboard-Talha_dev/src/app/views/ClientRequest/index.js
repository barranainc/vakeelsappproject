import React, { Fragment, useState, useEffect } from "react";
import {
  Box,
  Grid2,
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Paper,
  Chip,
  Pagination,
  Tooltip,
  CircularProgress,
  Button,
  PaginationItem,
  styled,
  TextField
} from "@mui/material";
import moment from "moment";
import InputField from "../../components/inputfield";
import { SearchIcon, StackIcon } from "../../assets/icons";
import ClientServices from "../../apis/client/ClientServices";
import Colors from "../../assets/styles";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import TelegramIcon from '@mui/icons-material/Telegram';
import ChatServices from "../../apis/chat";
import { ErrorToaster, SuccessToaster } from "../../components/toaster";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { NavigateBefore, NavigateNext } from "@mui/icons-material";


const Grid = (props) => <Grid2 {...props} />;

function ClientRequest() {
  const [isFilterOpen, setIsFilterOpen] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    
  };
  const tableHeaders = [
    { key: "clientName", label: "Client Name" },
    { key: "title", label: "Title" },
    { key: "serviceName", label: "Service Name" },
    { key: "subServiceName", label: "Sub-Service Name" },
    { key: "description", label: "Description" },
    { key: "requestType", label: "Request Type" },
    { key: "action", label: "Action" },
  ];

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
  const { register, control, getValues } = useForm();
  const navigate = useNavigate();

  const handleFilterOpen = (event) => {
    setIsFilterOpen(event.currentTarget);
  };

  const getUsers = async (searchText,page, limit) => {
    setLoading(true);

    try {
      const result = await ClientServices.clientRequest(
        searchText || "",
        page ? page : 1,
        limit ? limit : 10
      );
      if (result.responseCode === 200) {
        setRows(result?.data?.requests);
        setCount(result?.data?.count);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   

      const delaySearch = setTimeout(() => {
        getUsers(searchText, page, limit);
      }, 500); 
      return () => clearTimeout(delaySearch);
    

  }, [searchText, page, limit]);

  const handlePageChange = (event, value) => {
    setPage(value);
    getUsers(searchText ,value, limit);
  };

  useEffect(() => {
    getUsers(searchText , page, limit);
  }, []);

  const handleSendRespond = async (data) => {
    const obj = {
      client_id: data?.client_id,
      type: "client_request",
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
            type: "client_request"
           }
        });
        
      }
    } catch (error) {
      ErrorToaster(error?.message);
    
      navigate("/all-chat",{state : {
        room_id : error?.error?.room_id,
         type: "client_request"
      
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
              flexWrap:'wrap'
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
              Clients Request
            </Typography>
            <TextField
          placeholder="Search"
          variant="outlined"
          value={searchText}
          onChange={handleSearchChange}
          sx={{ width: "300px" }}
        />
            {/* <Box
                sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 2,
                }}
                >
                <Box
                    sx={{
                    width: "427px",
                    }}
                >
                    <InputField
                    fullWidth={true}
                    placeholder={"Search here"}
                    slotProps={{
                        input: {
                        endAdornment: (
                            <IconButton onClick={handleSearch}>
                            <SearchIcon />
                            </IconButton>
                        ),
                        },
                    }}
                    register={register("search")}
                    onKeyDown={handleSearch}
                    />
                </Box>
                <IconButton
                    sx={{
                    height: "55px",
                    width: "55px",
                    borderRadius: "8px",
                    background: Colors.primary,
                    ":hover": {
                        background: Colors.primary,
                    },
                    }}
                    onClick={handleFilterOpen}
                >
                    <StackIcon />
                </IconButton>
                </Box> */}
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
                        textAlign: "center",
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
                        textAlign: "center",
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
                      <TableCell sx={{ textAlign: "center" ,fontFamily:"Poppins"}}>
                        {row?.client?.first_name + " " + row?.client?.last_name}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" ,fontFamily:"Poppins"}}>
                        {row?.title || "-"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" ,fontFamily:"Poppins"}}>
                        {row?.service?.name || "-"}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" ,fontFamily:"Poppins"}}>
                        {row?.sub_service?.name || "-"}
                      </TableCell>

                      <TableCell
                        sx={{
                          textAlign: "center",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "400px", // Adjust the width as needed
                        }}
                      >
                        <Tooltip title={row?.description || ""} arrow>
                          <span>{row?.description || "-"}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" ,fontFamily:"Poppins"}}>
                        {row?.request_type == "non_judicial"  ? "Non Judicial" : row?.request_type == "judicial" ? "Judicial" : "-"}
                      </TableCell>
                      <TableCell>
                        <Box  sx={{
                          textAlign: "center",
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
                            navigate(`/client-request-detail/${row?._id}`)
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

export default ClientRequest;
