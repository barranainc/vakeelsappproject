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
  Tooltip,
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
import CaseServices from "../../apis/cases/CasesServices";

const Grid = (props) => <Grid2 {...props} />;

function CasesManagement() {
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
    { key: "case_no", label: "Case No" },
    { key: "client_name", label: "Client Name" },
    { key: "title", label: "Title" },
    // { key: "case_category", label: "Case Category" },
    { key: "case_description", label: "Case Description" },
    { key: "joined", label: "Created At" },
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


  const getUsers = async (searchText , page, limit) => {
    setLoading(true);

    try {
      const result = await CaseServices.getAllCases(
        searchText || "",
        page ? page : 1,
        limit ? limit : 10
      );
      if (result.responseCode === 200) {
        setRows(result?.data?.cases);
        setCount(result?.data?.casesCount);
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
              Cases Management
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
                        navigate("/case-detail", { state: row })
                      }
                    >
                      <TableCell
                        sx={{ textAlign: "center", fontFamily: "Poppins" }}
                      >

                      {row?.case_number}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontFamily: "Poppins" }}
                      >
                        {row?.client_name}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontFamily: "Poppins" }}
                      >
                        {row?.title}
                      </TableCell>
                     
                      {/* <TableCell
                        sx={{ textAlign: "center", fontFamily: "Poppins" }}
                      >
                        {row?.case_category}
                      </TableCell> */}
                      <TableCell
                        sx={{
                          textAlign: "center",
                          fontFamily: "Poppins",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "300px",
                        }}
                      >
                        <Tooltip title={row?.case_description || ""} arrow>
                          <span>{row?.case_description}</span>
                        </Tooltip>
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

export default CasesManagement;
