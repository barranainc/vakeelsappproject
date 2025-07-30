import GridViewIcon from '@mui/icons-material/GridView';
import GavelIcon from '@mui/icons-material/Gavel';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import ChatIcon from '@mui/icons-material/Chat';
import NoteIcon from '@mui/icons-material/Note';

const dashboardNav = [
  {
    path: "/admin-dashboard",
    name: "Dashboard",
    icon:<GridViewIcon/>
  },
  {
    path: "/lawyer-management",
    name: "Lawyers Management",
    icon:<GavelIcon/>
  },
  {
    path: "/clients-management",
    name: "Clients Management",
    icon:<PersonIcon/>
  },
  {
    path: "/paralegals-management",
    name: "Paralegal Management",
    icon:<AdminPanelSettingsIcon/>

  },
  {
    path: "/request-management",
    name: "Request Management",
    icon:<AdminPanelSettingsIcon/>

  },
  {
    path: "/cases-management",
    name: "Cases Management",
    icon:<ArticleIcon/>

  },
  {
    path: "/matter-management",
    name: "Matter Management",
    icon:<NoteIcon/>
  },
  {
    
    name: "Configurations",
    icon:<SettingsIcon/>,
    path:"/case-services",
    subMenu: [
      {
      path: "/case-services",
      name: "Case Services",
      icon:<WorkOutlineIcon/>

    },
      {
      path: "/matter-services",
      name: "Matter Services",
      icon:<WorkOutlineIcon/>
    },
      {
      path: "/request-services",
      name: "Request Services",
      icon:<WorkOutlineIcon/>
    },
  ]
  },
  // {
  //   path: "/promotions",
  //   name: "Promotions"
  // },
  // {
  //   path: "/analytics-reporting",
  //   name: "Analytics & Reporting"
  // },
  // {
  //   path: "/ticket-management",
  //   name: "Ticket Management"
  // },
  // {
  //   path: "/orders-management",
  //   name: "Orders Management"
  // },
];
const paralegalNav = [
  {
    path: "/paralegal-dashboard",
    name: "Dashboard",
    icon:<GridViewIcon/>
  },

  {
    path: "/client-request",
    name: "Client Request",
    icon:<AdminPanelSettingsIcon/>

  },
  {
    path: "/client-matter",
    name: "Client Matter",
    icon:<ArticleIcon/>

  },
  {
    path: "/all-chat",
    name: "Chats",
    icon:< ChatIcon/>

  },
  // {
    
  //   name: "Configurations",
  //   icon:<SettingsIcon/>,
  //   path:"/case-services",
  //   subMenu: [
  //     {
  //     path: "/case-services",
  //     name: "Case Services",
  //     icon:<WorkOutlineIcon/>

  //   },
  //     {
  //     path: "/matter-services",
  //     name: "Matter Services",
  //     icon:<WorkOutlineIcon/>
  //   },
  //     {
  //     path: "/request-services",
  //     name: "Request Services",
  //     icon:<WorkOutlineIcon/>
  //   },
  // ]
  // },
  // {
  //   path: "/promotions",
  //   name: "Promotions"
  // },
  // {
  //   path: "/analytics-reporting",
  //   name: "Analytics & Reporting"
  // },
  // {
  //   path: "/ticket-management",
  //   name: "Ticket Management"
  // },
  // {
  //   path: "/orders-management",
  //   name: "Orders Management"
  // },
];

export  {dashboardNav ,paralegalNav};