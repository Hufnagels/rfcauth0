import React from 'react';
import { withAuthenticationRequired } from "@auth0/auth0-react";

// Material
import { styled } from '@mui/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import RestrictedArea from '../../components/common/RestrictedArea';
// import DashboardNavbar from './DashboardNavbar';
// import DashboardSidebar from './DashboardSidebar';

const DashboardLayoutRoot = styled('div')(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  })
);

const DashboardLayoutWrapper = styled('div')(
  ({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    border: '1px solid black',
    paddingTop: 64,
    [theme.breakpoints.up('sx')]: {
      paddingLeft: 256
    }
  })
);

const DashboardLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const DashboardLayoutContent = styled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto'
});

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary.color,
}));

const DashboardLayout = () => {

  return (
    <DashboardLayoutRoot>
{/*       <DashboardNavbar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <DashboardSidebar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      /> */}
      <DashboardLayoutWrapper>
        <DashboardLayoutContainer>
          <DashboardLayoutContent>
            
          <Grid container spacing={3}>
  <Grid item xs={12} md={4} lg={3}>
    <Item>xs</Item>
  </Grid>
  <Grid item xs={12} md={4} lg={3}>
    <Item>xs</Item>
  </Grid>
  <Grid item xs={12} md={4} lg={3}>
    <Item>xs</Item>
  </Grid>
  <Grid item xs={12} md={4} lg={3}>
    <Item>xs</Item>
  </Grid>
  <Grid item xs={12} md={4} lg={3}>
    <Item>xs</Item>
  </Grid>
  <Grid item xs={12} md={4} lg={3}>
    <Item>xs</Item>
  </Grid>
  <Grid item xs={12} md={4} lg={3}>
    <Item>xs</Item>
  </Grid>
  <Grid item xs={12} md={8} lg={6}>
    <Item>xs=6</Item>
  </Grid>
  <Grid item xs={12} md={4} lg={3}>
    <Item>xs</Item>
  </Grid>
</Grid>
          </DashboardLayoutContent>
        </DashboardLayoutContainer>
      </DashboardLayoutWrapper>
    </DashboardLayoutRoot>
  );
};

//export default DashboardLayout;
export default withAuthenticationRequired(DashboardLayout, {
  onRedirecting: () => <RestrictedArea />,
});