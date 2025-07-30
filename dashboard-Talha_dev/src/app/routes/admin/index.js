import ContentManagement from "../../views/clientManagement";
import InstructorManagement from "../../views/lawyermanagement";
import Dashboard from "../../views/mainDashboard/index";
import UserManagement from "../../views/paralegalManagement";
import AccountSetting from "../../views/AccountSetting";
import CasesManagement from "../../views/CasesManagment";
import CaseServices from "../../views/CaseServices";
import MatterServices from "../../views/MatterServices";
import RequestServicess from "../../views/RequestServices";
import CasesSubcategory from "../../views/CaseServices/SubCategories";
import MatterSubcategory from "../../views/MatterServices/SubCategories";
import RequestSubCategory from "../../views/RequestServices/SubCategories";
import LawyerDetails from "../../views/lawyermanagement/lawyerdetail";
import ClientDetails from "../../views/clientManagement/clientdetail";
import RequestManagement from "../../views/RequestManagment/index";
import Notification from "../../views/Notification/index";
import ParalegalDetail from "../../views/paralegalManagement/paralegalDetail/index";
import CaseDetail from "../../views/CasesManagment/caseDetail/index";
import MatterManagement from "../../views/MatterManagment/index";
import MatterDetail from "../../views/MatterManagment/matterDetail/index";
import RequestDetail from "../../views/RequestManagment/requsetDetail/index";


const adminRoutes = [
  {
    path: "/clients-management",
    component: <ContentManagement />,
  },
  {
    path: "/notification",
    component: <Notification />,
  },
  {
    path: "/admin-dashboard",
    component: <Dashboard />,
  },
  {
    path: "/lawyer-management",
    component: <InstructorManagement />,
  },
  {
    path: "/lawyer-management-details",
    component: <LawyerDetails />,
  },
  {
    path: "/clients-management-details",
    component: <ClientDetails />,
  },
  {
    path: "/paralegals-management",
    component: <UserManagement />,
  },
  {
    path: "/paralegal-detail",
    component: <ParalegalDetail />,
  },
  {
    path: "/account-setting",
    component: <AccountSetting />,
  },
 
  {
    path: "/cases-management",
    component: <CasesManagement />,
  },
  {
    path: "/case-detail",
    component: <CaseDetail />,
  },
  {
    path: "/request-management",
    component: <RequestManagement />,
  },
  {
    path: "/case-services",
    component: <CaseServices />,
  },
  {
    path: "/matter-services",
    component: <MatterServices />,
  },
  {
    path: "/request-services",
    component: <RequestServicess />,
  },
  {
    path: "/case-services-subcategory",
    component: <CasesSubcategory />,
  },
  {
    path: "/matter-services-subcategory",
    component: <MatterSubcategory />,
  },
  {
    path: "/request-services-subcategory",
    component: <RequestSubCategory />,
  },
  {
    path: "/matter-management",
    component: <MatterManagement />,
  },
  {
    path: "/matter-detail/:id",
    component: <MatterDetail />,
  },
  {
    path: "/request-detail/:id",
    component: <RequestDetail />,
  },
];

export default adminRoutes;
