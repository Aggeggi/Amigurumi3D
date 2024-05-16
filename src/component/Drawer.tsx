import { Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled, useTheme } from "@mui/material"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { useTranslation } from "react-i18next"
import ViewInArIcon from "@mui/icons-material/ViewInAr"
import PatternIcon from "@mui/icons-material/Pattern"
import { useRouter } from "next/navigation"
const drawerWidth = 240

interface CustomDrawerProps {
  open: boolean
  handleDrawerClick: () => void
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}))

const CustomDrawer = ({ open, handleDrawerClick }: CustomDrawerProps) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClick}>{theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
      </DrawerHeader>
      <Divider />
      <List onKeyDown={handleDrawerClick} onClick={handleDrawerClick}>
        <ListItem key={"home"} disablePadding>
          <ListItemButton onClick={() => router.push("/")}>
            <ListItemIcon>{<ViewInArIcon></ViewInArIcon>}</ListItemIcon>
            <ListItemText primary={t("home")} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"patterns"} disablePadding>
          <ListItemButton onClick={() => router.push("/patterns")}>
            <ListItemIcon>{<PatternIcon></PatternIcon>}</ListItemIcon>
            <ListItemText primary={t("patterns")} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  )
}
export default CustomDrawer
