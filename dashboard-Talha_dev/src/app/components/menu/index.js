import React from 'react';
import { Menu, MenuItem } from '@mui/material';
import Colors from '../../assets/styles';
import "@fontsource/open-sans";

function ListMenu({ open, anchorEl, onClose, options, onClick }) {
  return (
    <Menu
      id="account-menu"
      open={open}
      anchorEl={anchorEl}
      onClick={onClose}
      onClose={onClose}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            background: Colors.white,
            overflow: 'visible',
            minWidth: "157px",
            mt: 1.5,
            borderRadius: "10px",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            width: "194px",
            // '&::before': {
            //   content: '""',
            //   display: 'block',
            //   position: 'absolute',
            //   top: 0,
            //   right: 14,
            //   width: 10,
            //   height: 10,
            //   bgcolor: Colors.white,
            //   transform: 'translateY(-50%) rotate(45deg)',
            //   zIndex: 0,
            // },
          },
        },
      }}
      MenuListProps={{
        sx: {
          py: 0
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {options?.map((opt, ind) => (
        <MenuItem
          key={ind}
          sx={{ fontFamily: "Open Sans", color: Colors.primary + "B3", p: "16px", borderBottom: ind !== options.length - 1 ? `1px solid ${Colors.lightGray1}` : "none", }}
          onClick={onClick ? () => onClick(opt) : () => { }}
        >
          {opt}
        </MenuItem>
      ))}
    </Menu>
  )
}

export default ListMenu;
