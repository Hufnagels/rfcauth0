import * as React from 'react';
import { NavLink, useLocation, Link as RouterLink } from 'react-router-dom';

// Material
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';

const BreadcrumbContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: theme.spacing(1, 3),
}));

const RouterBreadcrumbs = () => {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  
  let location = useLocation();

  console.log('location',location)
  const pathnames = location.pathname.split('/').filter((x) => x);
  console.log('location2',pathnames)
  return (
    <BreadcrumbContainer>
      <Breadcrumbs aria-label="breadcrumb">
        <NavLink underline="hover" color="inherit" to="/" activeClassName='' ><Typography variant="inherit">Home</Typography></NavLink>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            return last ? (
              <Typography color="text.primary" key={to}>{value}</Typography>
              ) : (
              <NavLink underline="hover" color="inherit" to={to} key={to}>{value}</NavLink>
              );
        })}
      </Breadcrumbs>
    </BreadcrumbContainer>
  );
}

export default RouterBreadcrumbs;