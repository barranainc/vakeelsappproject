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
  Select,
  MenuItem,
  Button,
  Tooltip,
  CircularProgress,
  OutlinedInput,
  InputAdornment,
  PaginationItem,
  styled
} from "@mui/material";
import moment from "moment";
import InputField from "../../components/inputfield";
import { SearchIcon, StackIcon } from "../../assets/icons";
import ClientServices from "../../apis/client/ClientServices";
import Colors from "../../assets/styles";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import RequestServices from "../../apis/request/RequestServices";
import ClearIcon from '@mui/icons-material/Clear';
import { NavigateBefore, NavigateNext } from "@mui/icons-material";


const Grid = (props) => <Grid2 {...props} />;

function RequestManagement() {
  const [isFilterOpen, setIsFilterOpen] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [selectedValue, setSelectedValue] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const { register, control, getValues } = useForm();
  const navigate = useNavigate();
  const tableHeaders = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    { key: "requestType", label: "Request Type" },
    { key: "serviceName", label: "Service Name" },
    { key: "subServiceName", label: "Sub-Service Name" },
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

  const handleSelectChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleClear = () => {
    setSelectedValue('');
    getUsers("", page, limit);

  };
  const getUsers = async (req = "", pageNum = 1, limitPage = 10) => {
    setLoading(true);

    try {
      const result = await RequestServices.getRequestManagment(
        req || "",
        pageNum ? pageNum : page,
        limitPage ? limitPage : limit
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

  const handleSearch = (e) => {
    getUsers(selectedValue, page, limit);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    getUsers(null, value, limit);
  };

  useEffect(() => {
    getUsers(null, page, limit);
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
              flexWrap:"wrap"
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
              Request Management
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: 2,
                mt:{lg: "0",md:'0',sm:1,xs:1},
              }}
            >
              <Box
                sx={{
                  width:{lg: "427px",md:'427px',sm:"370px",xs:"370px"},
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Select
                    fullWidth
                    value={selectedValue}
                    onChange={handleSelectChange}
                    placeholder="Search here"
                    displayEmpty
                    input={
                      <OutlinedInput
                        endAdornment={
                          selectedValue && (
                            <InputAdornment position="end">
                              <IconButton onClick={handleClear} edge="end" sx={{mr:2 }}>
                                <ClearIcon sx={{fontSize:"20px"}} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }
                        />
                      }
                  >
                    <MenuItem value="" disabled>
                      Search here
                    </MenuItem>
                    <MenuItem value="judicial">Judicial</MenuItem>
                    <MenuItem value="non_judicial">Non-Judicial</MenuItem>
                  </Select>
                  <Button
                    sx={{
                      padding: "14px 20px",
                      backgroundColor: Colors.primary,
                      fontFamily: "Poppins",
                    }}
                    variant="contained"
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </div>
              </Box>
            </Box>
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
                    <TableRow sx={{ cursor: "pointer" }} key={row.id} onClick={()=>navigate(`/request-detail/${row?._id}`)}>
                      <TableCell
                        sx={{ textAlign: "center", fontFamily: "Poppins" }}
                      >
                        {row?.client?.first_name + " " + row?.client?.last_name}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontFamily: "Poppins" }}
                      >
                        {row?.client?.email}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontFamily: "Poppins" }}
                      >
                        {row?.title}
                      </TableCell>
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
                        <Tooltip title={row?.description || ""} arrow>
                          <span>{row?.description}</span>
                        </Tooltip>
                      </TableCell>

                      <TableCell
                        sx={{ textAlign: "center", fontFamily: "Poppins" }}
                      >
                        {row?.request_type == "judicial" ? "Judicial" : row?.request_type == "non_judicial" ? "Non Judicial" : '-'}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontFamily: "Poppins" }}
                      >
                        {row?.service?.name}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: "center", fontFamily: "Poppins" }}
                      >
                        {row?.sub_service?.name ? row?.sub_service?.name : "-"}
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

export default RequestManagement;
