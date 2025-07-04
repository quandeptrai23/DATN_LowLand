import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import ListItemButton from "@mui/material/ListItemButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useEffect } from "react";
import Logo from "../../components/logo";
import Scrollbar from "../../components/scrollbar";
import { useResponsive } from "../../hooks/use-responsive";
import { RouterLink } from "../../routes/components";
import { usePathname } from "../../routes/hooks";
import { NAV } from "./config-layout";
import navConfig from "./config-navigation";
import { user } from "src/redux/selectors/UserSelector";

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const account = useSelector(user);
  const pathname = usePathname();

  const upLg = useResponsive("up", "lg");

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: "flex",
        borderRadius: 1.5,
        alignItems: "center",
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={account.imageURL} alt="photoURL" />

      <Box sx={{ ml: 2 }}>
        {/* <Typography variant="h5">{jwtDecode(localStorage.getItem("accessToken")).fullName}</Typography> */}

        <Typography variant="h5" fontSize={"14px !important"}>
          {account.fullName}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {/* {account.role} */}
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  // const renderUpgrade = (
  //   <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
  //     <Stack
  //       alignItems="center"
  //       spacing={3}
  //       sx={{ pt: 5, borderRadius: 2, position: "relative" }}
  //     >
  //       <Box
  //         component="img"
  //         src="/assets/illustrations/illustration_avatar.png"
  //         sx={{ width: 100, position: "absolute", top: -50 }}
  //       />

  //       <Box sx={{ textAlign: "center" }}>
  //         <Typography variant="h6">Get more?</Typography>

  //         <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
  //           From only $69
  //         </Typography>
  //       </Box>

  //       <Button
  //         href="https://material-ui.com/store/items/minimal-dashboard/"
  //         target="_blank"
  //         variant="contained"
  //         color="inherit"
  //       >
  //         Upgrade to Pro
  //       </Button>
  //     </Stack>
  //   </Box>
  // );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{ p: 3, display: "flex", alignItems: "center", flexWrap: "wrap" }}
      >
        <Logo />
        <Typography sx={{ ml: 2, fontSize: "19px !important" }} variant="h1">
          Lowland 
        </Typography>
      </Box>

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />

      {/* {renderUpgrade} */}
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: "fixed",
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: "body2",
        color: "text.secondary",
        textTransform: "capitalize",
        fontWeight: "fontWeightMedium",
        ...(active && {
          color: "primary.main",
          fontWeight: "fontWeightSemiBold",
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
