import React from 'react'
import { Box, CircularProgress } from '@mui/material'
import Colors from '../../assets/styles'

function Loader() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
      <CircularProgress sx={{ color: Colors.accent, "&.MuiCircularProgress-root": { width: "32px !important", height: "32px !important" } }} />
    </Box>
  )
}

export default Loader
