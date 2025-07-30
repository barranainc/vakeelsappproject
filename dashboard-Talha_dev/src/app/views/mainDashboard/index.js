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
import { ErrorToaster } from "../../components/toaster";
import AuthServices from "../../apis/auth/AuthServices";

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
      name: "Total Clients",
      tenure: "This Month",
      number: statsData?.clientCount,
      profit: 0,
      loss: 1.5,
      lastTenure: "Last Month",
      lastNumber: 265,
      background: "#337DBD",
    },
    {
      name: "Total Lawyers",
      tenure: "This Month",
      number: statsData?.lawyerCount,

      profit: 2.5,
      loss: 0,
      lastTenure: "Last Month",
      lastNumber: 897,
      background: "#0F5189",
    },
    {
      name: "Total Paralegal ",
      tenure: "This Month",
      number: statsData?.paralegalCount,
      profit: 2.5,
      loss: 0,
      lastTenure: "Last Month",
      lastNumber: 2600,
      background: "#EAA141",
    },
    {
      name: "Total Cases ",
      tenure: "This Month",
      number: statsData?.casesCount,

      profit: 2.5,
      loss: 0,
      lastTenure: "Last Month",
      lastNumber: 2600,
      background: "#337DBD",
    },
    {
      name: "Total Request ",
      tenure: "This Month",
      number: statsData?.requestsCount,

      profit: 2.5,
      loss: 0,
      lastTenure: "Last Month",
      lastNumber: 2600,
      background: "#0F5189",
    },
    {
      name: "Total Matters ",
      tenure: "This Month",
      number: statsData?.mattersCount,

      profit: 2.5,
      loss: 0,
      lastTenure: "Last Month",
      lastNumber: 2600,
      background: "#EAA141",
    },
  ];

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
            Welcome Admin!
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
                    <Grid key={ind} size={{xs:12 ,sm:6 ,md:4}}>
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
