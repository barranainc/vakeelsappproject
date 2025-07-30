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
  PaginationItem,
  styled,
  CircularProgress,
  Avatar,
  TextField,
} from "@mui/material";
import moment from "moment";
import InputField from "../../components/inputfield";
import { SearchIcon, StackIcon } from "../../assets/icons";
import ClientServices from "../../apis/client/ClientServices";
import Colors from "../../assets/styles";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { baseUrl } from '../../config/axios';

import { NavigateBefore, NavigateNext } from "@mui/icons-material";

const Grid = (props) => <Grid2 {...props} />;

function ParalegalManagment() {
  const [isFilterOpen, setIsFilterOpen] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    
  };
  const tableHeaders = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phoneNumber", label: "Phone Number" },
    { key: "joined", label: "Joined" },
    { key: "status", label: "Status" },
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

  const getUsers = async (searchText,userType,page, limit) => {
    setLoading(true);

    try {
      const result = await ClientServices.getClient(
        searchText || "",
        "paralegal",
        page ? page : 1,
        limit ? limit : 10
      );
      if (result.responseCode === 200) {
        setRows(result?.data?.users);
        setCount(result?.data?.count);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  

  const handlePageChange = (event, value) => {
    setPage(value);
    getUsers(searchText,"paralegal",value, limit);
  };

  useEffect(() => {
    getUsers(searchText,"paralegal",page, limit);
  }, []);

  useEffect(() => {
   

    const delaySearch = setTimeout(() => {
      getUsers(searchText,"paralegal", page, limit);
    }, 500); 
    return () => clearTimeout(delaySearch);
  

}, [searchText, page, limit]);
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
                fontFamily: "Poppins",
              }}
            >
              Paralegal Management
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
                        navigate("/paralegal-detail", { state: row })
                      }
                    >
                      <TableCell
                        sx={{ textAlign: "center", fontFamily: "Poppins" }}
                      >
                        <Box sx={{display:"flex",alignItems:"center",gap:1}}> 

                        <Avatar
                  alt={`${row.first_name} ${row.last_name}`}
                  src={baseUrl  + row.picture}
                  sx={{ width: 50, height: 50 }}
                />
                  {row.first_name + " " + row.last_name}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontFamily: "Poppins" }}
                      >
                        {row.email}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontFamily: "Poppins" }}
                      >
                        {row.phone}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontFamily: "Poppins" }}
                      >
                        {moment(row.created_at).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontFamily: "Poppins" }}
                      >
                        <Chip
                          label="Active"
                          style={{
                            backgroundColor: "rgb(64 192 35)",
                            color: "#fff",
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

export default ParalegalManagment;
