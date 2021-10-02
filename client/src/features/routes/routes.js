import { Navigate } from 'react-router-dom';

// Icons
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import TableViewOutlinedIcon from '@mui/icons-material/TableViewOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';

//Layouts
import AdminLayout from '../../components/common/Layout/AdminLayout';
import MainLayout from '../../components/common/Layout/MainLayout';

// Pages -- admin
import DataFetching from '../../pages/admin/Tables/DataFetching';
import BasicFilteringGrid from '../../pages/admin/Tables/Table';
import MindMap from '../../pages/admin/Mindmap/Mindmap';
import Whiteboard from '../../pages/admin/Whiteboard/Whiteboard';
import Counter from '../../pages/admin/Counter/Counter';
import Profile from '../../pages/admin/Profile';

// Pages - main
import About from '../../pages/About';
import Home from '../../pages/Home';
import Login from '../../pages/Login';
import Register from '../../pages/Register';
import NotFound from '../../pages/NotFound';
import PostList from '../../components/Posts/PostList';
import PostItem from '../../components/Posts/PostItem';
import loadable from "@loadable/component"
import Posts from '../../components/Posts/Posts';
import Loading from '../../components/common/Loading'

// const Loading = () => {
//   return <div>Loading...</div>
// }
const DashboardPage = loadable(() => import("../../pages/admin/Dashboard.js"), {
  fallback: <Loading />,
})

const routes = (isAuthenticated) => [
  {
    path: 'app',
    //element: isAuthenticated ? <AdminLayout /> : <RestrictedArea />, //<Navigate to="/" />,
    element: <AdminLayout />,
    children: [
      { path: '', element: <DashboardPage />, title: 'Dashboard',icon: DashboardOutlinedIcon, children: [] },
      { path: 'mindmap', element: <MindMap />, title: 'MindMap',icon: AccountTreeOutlinedIcon, children: [] },
      { path: 'whiteboard', element: <Whiteboard />, title: 'WhiteBoard',icon: BorderColorOutlinedIcon, children: [] },
      { path: 'counter', element: <Counter />, title: 'Counter',icon: HourglassEmptyOutlinedIcon, children: [] },
      { path: 'tables', element: <BasicFilteringGrid />, title: 'Tables',icon: TableViewOutlinedIcon, children: [] },
      { path: 'users', element: <DataFetching />, title: 'Users',icon: PeopleAltOutlinedIcon,
        children: [
          { path: ':id', element: <DataFetching />, title: 'User',icon: PersonOutlinedIcon },
          
        ]
      },
      { path: 'profile', element: <Profile />, title: 'Profile',icon: ContactMailOutlinedIcon ,children: [] },
      { path: '*', element: <Navigate to="/404" />,icon: DashboardOutlinedIcon,children: [] }
    ]
  },
  {
    path: '/',
    //element: !isAuthenticated ? <MainLayout /> : <Navigate to="/app/dashboard" />,
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home />, title: 'Home' },
      { path: 'posts', element: <Posts />, title: 'Posts', children: [
        { path: '/', element: <PostList />, title: 'Postlist' },
        { path: ':id', element: <PostItem />, title: 'Post Item' },
      ]},
      { path: 'about', element: <About />, title: 'About' },
      { path: 'login', element: <Login />, title: 'Login' },
      { path: 'register', element: <Register />, title: 'Register'},
      { path: '404', element: <NotFound />, title: '404' },
      /* { path: '/', element: <Navigate to="/app/dashboard" /> }, */
      { path: '*', element: <Navigate to="/404" />, title:'' }
    ]
  }
];

export default routes;