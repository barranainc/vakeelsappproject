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
  CircularProgress,
  PaginationItem,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import moment from "moment";
import InputField from "../../components/inputfield";
import { SearchIcon, StackIcon } from "../../assets/icons";
import ClientServices from "../../apis/client/ClientServices";
import Colors from "../../assets/styles";
import { useForm } from "react-hook-form";
import BadgeIcon from "@mui/icons-material/Badge";
import SimpleDialog from "../../components/Modal";
import { baseUrl } from "../../config/axios";
import { useNavigate } from "react-router-dom";
import {
  FirstPage,
  LastPage,
  NavigateNext,
  NavigateBefore,
} from "@mui/icons-material";

const Grid = (props) => <Grid2 {...props} />;
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

function UserManagement() {
  const [isFilterOpen, setIsFilterOpen] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [lawyerData, setLawyerData] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const { register, control, getValues } = useForm();
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    
  };
  const navigate = useNavigate();

  const handleFilterOpen = (event) => {
    setIsFilterOpen(event.currentTarget);
  };
  const tableHeaders = [
    { key: "name", label: "Name" },
    { key: "councilId", label: "Council Id" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "joined", label: "Joined" },
    { key: "cnic", label: "CNIC" },
    { key: "Action", label: "Action" },
  ];

  const getLawyers = async (searchText,userType , page, limit) => {
    setLoading(true);
    try {
      const result = await ClientServices.getClient(
        searchText || "",
        "lawyer",
        page || 1,
        limit || 10
      );
      if (result.responseCode === 200) {
        setRows(result?.data?.users);
        setCount(result?.data?.count);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async () => {
    console.log(status);
    const obj = {
      is_approved: status,
      user_id: lawyerData?._id,
    };
    try {
      const result = await ClientServices.changeStatus(obj);
      if (result.responseCode === 200) {
        getLawyers();
        setOpenStatusModal(false);
        setStatus("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    

      const delaySearch = setTimeout(() => {
        getLawyers(searchText,"lawyer" ,page, limit);
      }, 500); 
      
      return () => clearTimeout(delaySearch);
    
  }, [searchText, page, limit]);

  const handlePageChange = (event, value) => {
    setPage(value);
    getLawyers(searchText,"lawyer" ,value, limit);
  };

  useEffect(() => {
    getLawyers(searchText,"lawyer" , page, limit);
  }, []);

  return (
    <Fragment>
      <SimpleDialog open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ p: 2 }}>
          {/* Dialog Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontFamily: "Poppins" }}
            >
              CNIC Details
            </Typography>
          </Box>

          {/* CNIC Images Grid */}
          <Grid container spacing={3}>
            <Grid item size={{ xs: 6, sm: 4, md: 6 }}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  overflow: "hidden",
                  textAlign: "center",
                }}
              >
                <img
                  alt={"FRONT"}
                  src={baseUrl + lawyerData?.cnic_front}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ py: 1, fontWeight: "bold", fontFamily: "Poppins" }}
                >
                  Front Picture
                </Typography>
              </Box>
            </Grid>
            <Grid item size={{ xs: 6, sm: 4, md: 6 }}>
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  overflow: "hidden",
                  textAlign: "center",
                }}
              >
                <img
                  alt={"FRONT"}
                  src={baseUrl + lawyerData?.cnic_back}
                  style={{
                    width: "100%",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{ py: 1, fontWeight: "bold", fontFamily: "Poppins" }}
                >
                  Back Picture
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </SimpleDialog>
      <SimpleDialog
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
      >
        <Box sx={{ p: 2 }}>
          {/* Dialog Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ fontFamily: "Poppins" }}
            >
              Change Status
            </Typography>
          </Box>

          {/* CNIC Images Grid */}
          <Grid container spacing={3} sx={{ width: "100% !important" }}>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              sx={{ width: "100% !important" }}
            >
              {/* Status Dropdown */}
              <InputLabel>Status</InputLabel>
              <FormControl fullWidth>
                <Select
                  fullWidth
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value={true}>Approved</MenuItem>
                  <MenuItem value={false}>Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              onClick={() => {
                setOpenStatusModal(false);
                setStatus("");
              }}
              sx={{
                mr: 2,
                backgroundColor: "#f0f0f0",
                px: 3,
                color: "#333",
                "&:hover": { backgroundColor: "#d9d9d9" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleStatusChange}
              sx={{
                backgroundColor: Colors.primary,
                color: "#fff",
                "&:hover": { backgroundColor: "#1565c0" },
                boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
                borderRadius: "8px",
                px: 3,
              }}
            >
              Change
            </Button>
          </Box>
        </Box>
      </SimpleDialog>

      <Grid container rowGap={3}>
        <Grid size={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "28px",
                fontWeight: "bold",
                fontFamily: "Open Sans",
                color: Colors.primary,
                fontFamily: "Poppins",
              }}
            >
              Lawyers Management
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
                    zIndex: 1,
                  }}
                >
                  {tableHeaders.map((header) => (
                    <TableCell
                      key={header.key}
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: Colors.white,
                        fontFamily: "Poppins",
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
                      onClick={() =>
                        navigate("/lawyer-management-details", { state: row })
                      }
                    >
                      <TableCell
                        sx={{
                          textAlign: "center",
                          verticalAlign: "middle",
                          fontFamily: "Poppins",
                        }}
                      >
                        {row?.first_name + " " + row?.last_name}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          verticalAlign: "middle",
                          fontFamily: "Poppins",
                        }}
                      >
                        {row?.council_id}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          verticalAlign: "middle",
                          fontFamily: "Poppins",
                        }}
                      >
                        {row?.email}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          verticalAlign: "middle",
                          fontFamily: "Poppins",
                        }}
                      >
                        {row?.phone}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          verticalAlign: "middle",
                          fontFamily: "Poppins",
                        }}
                      >
                        {moment(row?.created_at).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                          verticalAlign: "middle",
                          fontFamily: "Poppins",
                        }}
                      >
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenModal(true);
                            setLawyerData(row);
                          }}
                        >
                          <BadgeIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "14px",
                          textAlign: "center",
                          p: 2,
                          color: Colors.textGray,
                        }}
                      >
                        <Chip
                          onClick={(e) => {
                            e.stopPropagation();
                            if(row?.is_approved == null){
                              setOpenStatusModal(true);
                              setLawyerData(row);
                            }
                          }}
                          label={
                            row?.is_approved == null
                              ? "Pending"
                              : row?.is_approved == true
                              ? "Approved"
                              : "Rejected"
                          }
                          style={{
                            backgroundColor:
                              row?.is_approved == null
                                ? "#EAA141"
                                : row?.is_approved == true
                                ? "#337DBD"
                                : "rgb(196 68 57)",
                            color: "#fff",
                            width: "150px",
                          }}
                        />
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
              flexWrap: "wrap",
              gap: 2,
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

export default UserManagement;
