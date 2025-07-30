import React, { Fragment, useState, useEffect, useRef } from "react";
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
  Button,
  Paper,
  FormControl,
  InputLabel,
  Input,
  TextField,
  CircularProgress,
} from "@mui/material";
import "@fontsource/open-sans";
import "@fontsource/inter";
import Colors from "../../assets/styles";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CaseServices from "../../apis/cases/CasesServices";
import { baseUrl } from "../../config/axios";
import SimpleDialog from "../../components/Modal";
import UploadServices from "../../apis/upload/UploadServices";
import { ErrorToaster, SuccessToaster } from "../../components/toaster";
import MatterServices from "../../apis/matter/MatterServices";

const Grid = (props) => <Grid2 {...props} />;

function MatterServicess() {
  const [matter, setMatter] = useState([]);
  const [addDialog, setAddDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [imagePreview, setImagePreview] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const tableHeaders = [
    { key: "name", label: "Name" },
    { key: "icon", label: "Icon" },
    { key: "action", label: "Action" },
 
  ];
  const {
    register,
    control,
    getValues,
    formState: { errors },
    handleSubmit,
    setValue,
    clearErrors,
  } = useForm();
  const {
    register: register2,
    control: control2,
    getValues: getValues2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    clearErrors: clearErrors2,
  } = useForm();

  const navigate = useNavigate();

  const getMatter = async () => {
    try {
      const result = await MatterServices.getMatter();
      if (result.responseCode == 200) {
        setMatter(result?.data?.categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMatter();
  }, []);
  const createMatter = async (formData) => {
    const obj = {
      name: formData.name,
      icon: imagePreview,
    };
    try {
      const data = await MatterServices.createMatter(obj);
      SuccessToaster(data?.message);
      setAddDialog(false);
      setValue("name", "");
      setImagePreview("");
      getMatter();
    } catch (error) {
      ErrorToaster(error?.message);
    }
  };
  const updateMatter = async (formData) => {
    const obj = {
      id: editData?._id,
      name: formData.name,
      icon: imagePreview,
    };
    try {
      const data = await MatterServices.updateMatter(obj);
      SuccessToaster(data?.message);
      setImagePreview("");
      setEditDialog(false);
      setValue2("name", "");
      getMatter();
    } catch (error) {
      ErrorToaster(error?.message);
    }
  };
  const deleteMatter = async () => {
    try {
      const data = await MatterServices.deleteCategory(categoryId);
      SuccessToaster(data?.message);
      setDeleteDialog(false);
      getMatter();
    } catch (error) {
      ErrorToaster(error?.message);
    }
  };

  const handleFileChange = async (e) => {
    try {
      const formData = new FormData();
      formData.append("document", e.target.files[0]);

      const response = await UploadServices.uploadImage(formData);
      setImagePreview(response?.data?.path);
    } catch (error) {
      //   ErrorHandler(error);
      ErrorToaster(error?.message);
    }
  };

  return (
    <Fragment>
      <SimpleDialog
        open={addDialog}
        onClose={() => {
          setAddDialog(false);
          setValue("name", "");
          setValue("icon", "");
          setImagePreview("");
          clearErrors();
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(createMatter)}
          sx={{ px: 3, py: 2 }}
        >
          <Typography
            className="heading-font"
            variant="h5"
            mb={2}
            sx={{
              fontWeight: 600,
              textAlign: "center",
              color: Colors.primary,
              fontFamily:"Poppins"
            }}
          >
            Add New Matter Service
          </Typography>

          
          <InputLabel sx={{fontFamily:"Poppins"}}>Enter Name</InputLabel>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              placeholder="Enter name"
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors?.name?.message}
            />
          </FormControl>

         
          <InputLabel sx={{fontFamily:"Poppins"}}>Upload Icon</InputLabel>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              type="file"
              InputProps={{
                inputProps: { accept: "image/*" },
              }}
              {...register("icon", {
                required: "Icon is required",
                validate: (fileList) =>
                  fileList?.[0] || "Please select an image file.",
              })}
              onChange={(e) => {
                handleFileChange(e);
                clearErrors("icon");
              }}
              error={!!errors.icon}
              helperText={errors?.icon?.message}
            />
          </FormControl>

          
          {imagePreview && (
            <Box
              component="img"
              src={baseUrl + imagePreview}
              alt="Preview"
              sx={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: 1,
                mt: 1,
                mx: "auto",
                display: "block",
              }}
            />
          )}

          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: Colors.primary,
              color: Colors.white,
              fontWeight: "bold",
              textTransform: "capitalize",
              "&:hover": { backgroundColor: Colors.primary },
              fontFamily:"Poppins"
            }}
          >
            Submit
          </Button>
        </Box>
      </SimpleDialog>

      <SimpleDialog
        open={editDialog}
        onClose={() => {
          setEditDialog(false);
          setValue2("icon", "");
          setValue2("name", "");
          setImagePreview("");
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit2(updateMatter)}
          sx={{ px: 3, py: 2 }}
        >
          <Typography
            className="heading-font"
            variant="h5"
            mb={2}
            sx={{
              fontWeight: 600,
              textAlign: "center",
              color: Colors.primary,
              fontFamily:"Poppins"
            }}
          >
            Edit Matter Service
          </Typography>

          
          <InputLabel sx={{fontFamily:"Poppins"}}>Enter Name</InputLabel>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              placeholder="Enter name"
              {...register2("name", { required: "Name is required" })}
              error={!!errors2.name}
              helperText={errors2?.name?.message}
            />
          </FormControl>

         
          <InputLabel sx={{fontFamily:"Poppins"}}>Upload Icon</InputLabel>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              type="file"
              {...register2("icon")}
              onChange={(e) => {
                handleFileChange(e);
              }}
            />
          </FormControl>

          
          {imagePreview && (
            <Box
              component="img"
              src={baseUrl + imagePreview} 
              alt="Preview"
              sx={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: 1,
                mt: 1,
                mx: "auto",
                display: "block",
              }}
            />
          )}

          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: Colors.primary,
              color: Colors.white,
              fontWeight: "bold",
              textTransform: "capitalize",
              "&:hover": { backgroundColor: Colors.primary },
              fontFamily:"Poppins"
            }}
          >
            Submit
          </Button>
        </Box>
      </SimpleDialog>

      <SimpleDialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <Box sx={{ px: 3, textAlign: "center" }}>
          
          <Typography
            className="heading-font"
            variant="h5"
            mb={1}
            sx={{
              fontWeight: 600,
              textAlign: "center",
              color: Colors.primary,
              fontFamily:"Poppins"
            }}
          >
            Confirm Deletion
          </Typography>
          <Typography
            className="heading-font"
            mb={1}
            sx={{
              fontWeight: 400,
              textAlign: "center",
              fontSize: "14px",
              color: Colors.darkGray,
              fontFamily:"Poppins"
            }}
          >
            Are you sure you want to delete this category
          </Typography>

          
          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 3 }}>
            <Button
              variant="outlined"
              onClick={() => setDeleteDialog(false)}
              sx={{
                textTransform: "capitalize",
                px: 4,
                fontWeight: "bold",
                fontFamily:"Poppins"
              }}
            >
              No
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={deleteMatter}
              sx={{
                textTransform: "capitalize",
                px: 4,
                fontWeight: "bold",
                fontFamily:"Poppins"
              }}
            >
              Yes
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "28px",
                      fontWeight: 500,
                      fontFamily: "Open Sans",
                      color: Colors.primary,
                      fontWeight: "bold",
                      fontFamily:"Poppins"
                    }}
                  >
                    Matter Services
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                gap: 2,
              }}
              onClick={() => setAddDialog(true)}
            >
              <Button
                sx={{
                  height: "55px",
                  width: "150px",
                  display: "flex",
                  color: Colors.white,
                  borderRadius: "8px",
                  background: Colors.primary,
                  border: `1px solid ${Colors.primary}`,
                  ":hover": {
                    background: Colors.primary,
                  },
                  fontFamily:"Poppins"
                }}
              >
                Add New
              </Button>
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
  <TableRow sx={{ backgroundColor: Colors.primary, position: "sticky", top: 0,zIndex:1 }}>
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
                {matter.length === 0 ? (
                  
                  <TableRow>
                    <TableCell
                      colSpan={3}
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
                  matter.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": { backgroundColor: "#f9f9f9" },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontSize: "15px",
                          padding: "14px",
                          textAlign: "center",
                          p: 2,
                          color: Colors.textGray,
                          fontFamily:"Poppins"
                        }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "15px",
                          padding: "14px",
                          textAlign: "center",
                          p: 2,
                          color: Colors.textGray,
                          fontFamily:"Poppins"
                        }}
                      >
                        <Box
                          component="img"
                          src={baseUrl + row?.icon} 
                          alt="Preview"
                          sx={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            borderRadius: 1,
                            mt: 1,
                            mx: "auto",
                            display: "block",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "15px",
                          padding: "14px",
                          textAlign: "center",
                          p: 2,
                          color: Colors.textGray,
                          fontFamily:"Poppins"
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <IconButton
                            onClick={() => {
                              setEditDialog(true);
                              setEditData(row);
                              setValue2("name", row?.name);
                              setValue2("icon", row?.icon);
                              setImagePreview(row?.icon);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              setCategoryId(row?._id);
                              setDeleteDialog(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              navigate("/matter-services-subcategory", { state: row });
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default MatterServicess;
