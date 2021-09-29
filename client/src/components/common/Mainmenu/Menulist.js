export const getMenuButtons = (menuData) => {
  return menuData.map(({ title, path }) => {
    if(title) {
      return (
        <NavLink end className={classes.navlinkNavbar} to={path} activeClassName={classes.activeClassNavbarElement} key={`routeLink-${title}}`}>
          <ListItem button activeClassName={classes.activeClassNavbarElement} key={`routeListItem-${title}}`} >
            <Typography variant="span">{title}</Typography>
          </ListItem>
        </NavLink>
      );
    }
  });
};