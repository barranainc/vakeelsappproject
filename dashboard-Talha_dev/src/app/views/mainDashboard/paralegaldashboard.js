import React, { Fragment, useEffect, useState } from "react";
import {
  Box,
  CardMedia,
  Chip,
  Divider,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import "@fontsource/open-sans";
import "@fontsource/inter";
import Colors from "../../assets/styles";
import Images from "../../assets/images";
import AuthServices from "../../apis/auth/AuthServices";
import { ErrorToaster } from "../../components/toaster";

const Grid = (props) => <Grid2 {...props} />;

function Dashboard() {
  const [statsData , setStatsData] = useState()
  const getStats = async  ()=>{
    try{
      const response = await AuthServices.getStats()
      setStatsData(response?.data)
    }catch(error){
      ErrorToaster(error)
    }
  }
  useEffect(()=>{
    getStats()
  },[])
  const line1Cards = [
    {
      name: "Request Covered",
      tenure: "This Month",
      number: statsData?.requestsCount,
      profit: 0,
      loss: 1.5,
      lastTenure: "Last Month",
      lastNumber: 265,
      background: "#337DBD",
    },
    {
      name: "Matter Covered",
      tenure: "This Month",
      number: statsData?.mattersCount,
      profit: 2.5,
      loss: 0,
      lastTenure: "Last Month",
      lastNumber: 897,
      background: "#0F5189",
    },
   
  ];

  const boxCard1 = [
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.authorImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.authorImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.authorImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.authorImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.authorImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.authorImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.authorImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.authorImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.authorImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.authorImage,
    },
  ];
  const boxCard2 = [
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.courseImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.courseImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.courseImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.courseImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.courseImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.courseImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.courseImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.courseImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.courseImage,
    },
    {
      title: "History Of Tobacco",
      name: "Harrisson Smith",
      image: Images.courseImage,
    },
  ];

  const rows = [
    {
      name: "Mike Brand",
      email: "mikebrand@gmail.com",
      phone: "123-456-7890",
      joined: "25 April, 2018",
      status: "PENDING",
    },
    {
      name: "Andrew Strauss",
      email: "info@yourmail.com",
      phone: "987-654-3210",
      joined: "25 April, 2018",
      status: "APPROVED",
    },
    {
      name: "Ross Kopelman",
      email: "rosskopelman@gmail.com",
      phone: "456-123-7890",
      joined: "25 April, 2018",
      status: "APPROVED",
    },
    {
      name: "Mike Husty",
      email: "mikehusty@gmail.com",
      phone: "321-654-9870",
      joined: "25 April, 2018",
      status: "REJECT",
    },
    {
      name: "Kevin Petersen",
      email: "kpetersen@gmail.com",
      phone: "789-456-1230",
      joined: "25 April, 2018",
      status: "PENDING",
    },
    {
      name: "Mike Husty",
      email: "mikehusty@gmail.com",
      phone: "567-890-1234",
      joined: "25 April, 2018",
      status: "REJECT",
    },
    {
      name: "Kevin Petersen",
      email: "kpetersen@gmail.com",
      phone: "678-901-2345",
      joined: "25 April, 2018",
      status: "PENDING",
    },
    {
      name: "Mike Husty",
      email: "mikehusty@gmail.com",
      phone: "789-012-3456",
      joined: "25 April, 2018",
      status: "REJECT",
    },
    {
      name: "Kevin Petersen",
      email: "kpetersen@gmail.com",
      phone: "890-123-4567",
      joined: "25 April, 2018",
      status: "PENDING",
    },
  ];

  const getStatusChip = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <Chip
            label="PENDING"
            style={{
              backgroundColor: "#a475f9",
              color: "#fff",
              width: "150px",
            }}
          />
        );
      case "APPROVED":
        return (
          <Chip
            label="APPROVED"
            style={{
              backgroundColor: "#08a9f3",
              color: "#fff",
              width: "150px",
            }}
          />
        );
      case "REJECT":
        return (
          <Chip
            label="REJECT"
            style={{
              backgroundColor: "#ff8a80",
              color: "#fff",
              width: "150px",
            }}
          />
        );
      default:
        return null;
    }
  };
  return (
    <Fragment>
      <Grid container rowGap={3}>
        <Grid size={12}>
          <Typography
            sx={{
              fontSize: "28px",
              fontWeight: 600,
              fontFamily: "Open Sans",
              color: Colors.primary,
              fontFamily:"Poppins"
            }}
          >
            Welcome Paralegal!
            <span className="waving-hand">&#x1F44B;</span>
          </Typography>
         
        </Grid>
        <Grid size={12}>
          <Box
            sx={{
              height: "calc(100vh - 237px)",
              overflowY: "scroll",
              "::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Grid container rowGap={3}>
              <Grid size={12}>
                <Grid container spacing={2}>
                  {line1Cards.map((item, ind) => (
                    <Grid key={ind} size={{xs:12 ,sm:6 ,md:6}}>
                      <Box
                        sx={{
                          p: 3,
                          display: "flex",
                          flexDirection: "column",
                          background: `${item.background}`,
                          borderRadius: "15px",

                          boxShadow: "0px 8px 24px 0 #4545501A",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: "Open Sans",
                              fontSize: "18px",
                              color: Colors.white,
                              fontFamily:"Poppins"
                            }}
                          >
                            {item.name}
                          </Typography>
                          {/* <Box
                            sx={{
                              // background: Colors.primary ,
                              borderRadius: "4px",
                              p: "4px 8px"
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "12px",
                                fontFamily: "Open Sans",
                                color: Colors.white
                              }}
                            >
                              {item.tenure}
                            </Typography>
                          </Box> */}
                        </Box>
                        <Divider sx={{ my: "12px", borderColor: "#363638" }} />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: "28px",
                              fontWeight: 600,
                              fontFamily: "Open Sans",
                              lineHeight: "40px",
                              color: Colors.white,
                            }}
                          >
                            {item.number}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  );
}

export default Dashboard;
