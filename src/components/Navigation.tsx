import React from "react";
import Image from 'next/image';
import {CSSObject, styled, Theme, useTheme} from "@mui/material/styles";
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import ListItemText from '@mui/material/ListItemText';
import Logo_coloured from '@/../public/P_logo_simple.png';
import Logo_white from '@/../public/Logo_white.png';
import Avatar from '@mui/material/Avatar';
import Krisjanis_photo from '@/../public/team_photo/krisjanis.png'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    backgroundColor: '#003F87',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
    backgroundColor: '#003F87',
});
const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const DrawerHeader2 = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);



export default function Navigation() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [open2, setOpen2] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const toggleDrawer2 =
        (open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }
                setOpen2(open);
            };

    return (
        <>
            <AppBar position="fixed" open={open} elevation={0}>
                <Toolbar sx={{bgcolor: 'white'}}>
                    <IconButton
                        aria-label="open menu"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            color: "#003F87",
                            marginRight: 5,
                            "border-radius": 8,
                            "&:hover": {
                                backgroundColor: '#0066FF',
                                color: 'white',
                            },
                            ...(open && {display: 'none'}),
                        }}>
                        <MenuIcon/>
                    </IconButton>

                    <Image src={Logo_coloured} alt={"logo"} style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '40px',
                        ...(open && {display: 'none'}),
                    }} className={"pr-3"}/>
                    <div className={"px-3"} style={{
                        marginLeft: 'auto',
                    }}>
                        <Avatar sx={{"border-radius": 8}} onClick={toggleDrawer2(!open2)}>
                            <Image src={Krisjanis_photo} alt={"Krišjānis Petručeņa"} style={{
                                width: 'auto',
                                height: 'auto',
                                maxWidth: '40px',
                            }}/>
                        </Avatar>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <Image src={Logo_white} alt={'Logo'} style={{
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '40px'
                    }}/>
                    <div className={"font-semibold text-white px-3"}>Programme.lv</div>
                    <IconButton onClick={handleDrawerClose} sx={{
                        color: 'white',
                        "border-radius": 8,
                        "&:hover": {
                            backgroundColor: '#0066FF',
                        }
                    }}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                    </IconButton>

                </DrawerHeader>
                <Divider/>
                <List>
                    {['Sākums', 'Mēklēt', 'Iesūtījumi'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{
                            display: "block",
                            "border-radius": 8,
                            "&:hover": {
                                backgroundColor: '#0066FF',
                            }
                        }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                    color: 'white'
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: 'white'

                                    }}
                                >
                                    {index === 0 && <HomeRoundedIcon/>}
                                    {index === 1 && <SearchRoundedIcon/>}
                                    {index === 2 && <PlaylistAddCheckRoundedIcon/>}
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{opacity: open ? 1 : 0}}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <SwipeableDrawer
                anchor="right"
                open={open2}
                onOpen={toggleDrawer2(true)}
                onClose={toggleDrawer2(false)}
                elevation={0}
                PaperProps={{
                    sx: {
                        backgroundColor: '#003F87'
                    }
                }}
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <DrawerHeader2>
                    <List>
                        <ListItem disablePadding>
                            <ListItemIcon>
                                <Avatar sx={{"border-radius": 8}} onClick={toggleDrawer2(!open2)}>
                                    <Image src={Krisjanis_photo} alt={"Krišjānis Petručeņa"} style={{
                                        width: 'auto',
                                        height: 'auto',
                                        maxWidth: '40px',
                                        borderRadius: '8px'
                                    }}/>
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText primary={"krisjanisp"} sx={{color: 'white', fontWeight: '600 !importantya'}}/>
                        </ListItem>
                    </List>

                </DrawerHeader2>
                <Divider/>
                <List>
                    {['Profils', 'Iestatījumi', 'Izrakstīties'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{
                            display: "block",
                            "border-radius": 8,
                            "&:hover": {
                                backgroundColor: '#0066FF',
                            }
                        }}>
                            <ListItemButton sx={{color: 'white'}}>
                                <ListItemIcon sx={{color: 'white'}}>
                                    {index === 0 && <PersonRoundedIcon/>}
                                    {index === 1 && <SettingsRoundedIcon/>}
                                    {index === 2 && <ExitToAppRoundedIcon/>}
                                </ListItemIcon>
                                <ListItemText primary={text}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </SwipeableDrawer>
        </>
    )
}