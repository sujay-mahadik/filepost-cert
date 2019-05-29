import Dashboard from "views/Dashboard/Dashboard.jsx";
import Notifications from "views/Notifications/Notifications.jsx";
import Icons from "views/Icons/Icons.jsx";
import Typography from "views/Typography/Typography.jsx";
import TableList from "views/TableList/TableList.jsx";
import Maps from "views/Maps/Maps.jsx";
import UserPage from "views/UserPage/UserPage.jsx";
import CertificateGeneration from "views/GenerateCertificate/GenerateCertificate.jsx";
import CertificateVerification from "views/VerifyCerificate/VerifyCertificate.jsx";
import CertificateList from "views/CertificateList/CertificateList.jsx";

var dashRoutes = [
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   icon: "nc-icon nc-bank",
  //   component: Dashboard
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "nc-icon nc-diamond",
  //   component: Icons
  // },
  // { path: "/maps", name: "Maps", icon: "nc-icon nc-pin-3", component: Maps },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "nc-icon nc-bell-55",
  //   component: Notifications
  // },
  {
    path: "/certificate-generation",
    name: "Generate Certificate",
    icon: "nc-icon nc-bank",
    component: CertificateGeneration
  },
  {
    path: "/certificate-verification",
    name: "Verify Certificate",
    icon: "nc-icon nc-badge",
    component: CertificateVerification
  },
  {
    path: "/user-page",
    name: "User Profile",
    icon: "nc-icon nc-single-02",
    component: UserPage
  },
  {
    path: "/certificate-list",
    name: "Certificate List",
    icon: "nc-icon nc-tile-56",
    component: CertificateList
  },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "nc-icon nc-caps-small",
  //   component: Typography
  // },
  { redirect: true, path: "/", pathTo: "/dashboard", name: "Dashboard" }
];
export default dashRoutes;
