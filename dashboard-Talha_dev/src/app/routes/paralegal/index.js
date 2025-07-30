import Dashboard from "../../views/mainDashboard/paralegaldashboard";
import ClientRequest from "../../views/ClientRequest/index";
import ClientRequestDetail from "../../views/ClientRequest/ClientRequestDetail/index";
import ClientMatterDetail from "../../views/ClientMatter/ClientMatterDetail/index";
import ClientMatter from "../../views/ClientMatter";
import Chat from "../../views/Chat/index";
import AllChat from "../../views/AllChat/index"
import Notification from "../../views/Notification/index"
import AccountSetting from "../../views/AccountSetting";

const paralegalRoutes = [
  
  {
    path: "/paralegal-dashboard",
    component: <Dashboard />,
  },
  {
    path: "/client-request",
    component: <ClientRequest />,
  },
  {
    path: "/client-matter",
    component: <ClientMatter />,
  },
  {
    path: "/client-request-detail/:id",
    component: <ClientRequestDetail />,
  },
  {
    path: "/client-matter-detail/:id",
    component: <ClientMatterDetail />,
  },
  {
    path: "/chat",
    component: <Chat />,
  },
  {
    path: "/all-chat",
    component: <AllChat />,
  },
  {
    path: "/notification",
    component: <Notification />,
  },
  {
    path: "/account-setting",
    component: <AccountSetting />,
  },
  // {
  //   path: "/lawyer-management-details",
  //   component: <LawyerDetails />,
  // },
  // {
  //   path: "/paralegals-management",
  //   component: <UserManagement />,
  // },
  // {
  //   path: "/account-setting",
  //   component: <AccountSetting />,
  // },
 
  // {
  //   path: "/cases-management",
  //   component: <CasesManagement />,
  // },
  // {
  //   path: "/request-management",
  //   component: <RequestManagement />,
  // },
  // {
  //   path: "/case-services",
  //   component: <CaseServices />,
  // },
  // {
  //   path: "/matter-services",
  //   component: <MatterServices />,
  // },
  // {
  //   path: "/request-services",
  //   component: <RequestServicess />,
  // },
  // {
  //   path: "/case-services-subcategory",
  //   component: <CasesSubcategory />,
  // },
  // {
  //   path: "/matter-services-subcategory",
  //   component: <MatterSubcategory />,
  // },
  // {
  //   path: "/request-services-subcategory",
  //   component: <RequestSubCategory />,
  // },
];

export default paralegalRoutes;
