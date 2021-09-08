import { Navigate } from 'react-router-dom';

// Icons
import { 
  AccountTree,
  Dashboard,
  BorderColor,
  TableView,
  ContactPage,
} from '@mui/icons-material'

//Layouts
import AdminLayout from '../../components/_AdminLayout';
import AdminLayout2 from '../../components/AdminLayout';
import MainLayout from '../../components/MainLayout';

// Pages -- admin
import DashboardLayout from '../../pages/admin/Dashboard';
import DataFetching from '../../pages/admin/Tables/DataFetching';
import BasicFilteringGrid from '../../pages/admin/Tables/Table';
import MindMap from '../../pages/admin/Mindmap/Mindmap';
import Counter from '../../pages/admin/Counter/Counter';
import Profile from '../../pages/admin/Profile';

// Pages - main
import About from '../../pages/About';
import Home from '../../pages/Home';
import Login from '../../pages/Login';
import Register from '../../pages/Register';
import NotFound from '../../pages/NotFound';

import loadable from "@loadable/component"
import PostList from '../../components/Posts/PostList';
const Loading = () => {
  return <div>Loading...</div>
}
const DashboardPage = loadable(() => import("../../pages/admin/Dashboard.js"), {
  fallback: <Loading />,
})

const routes = [
  {
    path: 'app',
    element: <AdminLayout2 />,
    children: [
      { path: '', element: <DashboardPage />, title: 'Dashboard',icon: Dashboard, children: [] },
      { path: 'mindmap', element: <MindMap />, title: 'MindMap',icon: AccountTree, children: [] },
      { path: 'whiteboard', element: <MindMap />, title: 'WhiteBoard',icon: BorderColor, children: [] },
      { path: 'counter', element: <Counter />, title: 'Counter',icon: Dashboard, children: [] },
      { path: 'tables', element: <BasicFilteringGrid />, title: 'Tables',icon: TableView, children: [] },
      { path: 'users', element: <DataFetching />, title: 'Users',icon: ContactPage,
        children: [
          { path: ':id', element: <DataFetching />, title: 'User',icon: Dashboard },
          
        ]
      },
      { path: 'profile', element: <Profile />, title: 'Profile',icon: Dashboard ,children: [] },
      { path: '*', element: <Navigate to="/404" />,icon: Dashboard,children: [] }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'posts', element: <PostList /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: 'about', element: <About /> },
      { path: '/', element: <Home /> },
      /* { path: '/', element: <Navigate to="/app/dashboard" /> }, */
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
