import React from 'react'

// Material
import {
  AppBar,
  Grid,
  Link,
  Stack,
  Toolbar,
  Typography
} from "@material-ui/core";
import { Facebook, LinkedIn, Twitter } from "@mui/icons-material";
import { styled } from "@mui/styles";

const StyledLink = styled(Link)`
  color: #ffffff;

  & .MuiSvgIcon-root:hover {
    color: #ffffff;
  }
`;

const Footer = () => {
  return (
    <footer>
      {/* <AppBar sx={{ top: "auto", bottom: 0, position: "absolute", backgroundColor: "#304659" }}> */}
        <Toolbar variant="dense" sx={{ backgroundColor: "#304659" }}>
          <Grid container spacing={{ xs: 1, sm: 2, md: 4 }}>
            <Grid
              item
              xs={12}
              sm={4}
              sx={{ textAlign: "center" }}
            >
              <Typography sx={{ color: "white" }}>
                {new Date().getFullYear()}&copy; All rights reserved.
              </Typography>
            </Grid>
            <Grid item sm={4} xs={12} style={{ textAlign: "center" }}>
              <StyledLink
                href="https://www.twitter.com"
                underline="always"
                sx={{ color: "white" }}
              >
                <Twitter />
              </StyledLink>
              <StyledLink href="https://www.linkedin.com" underline="always">
                <LinkedIn />
              </StyledLink>
              <StyledLink href="https://www.facebook.com" underline="always">
                <Facebook />
              </StyledLink>
            </Grid>
            <Grid item xs={12} sm={4} style={{ textAlign: "center" }}>
              <Link
                href="https://privacy-policy/"
                underline="always"
                sx={{ color: "white" }}
              >
                Privacy Policy
              </Link>
            </Grid>
          </Grid>
        </Toolbar>
      {/* </AppBar> */}
      {/* <Toolbar /> */}
    </footer>
  );
};

export default Footer;
