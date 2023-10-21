import React from "react";
import Box from '@mui/joy/Box';
import Sheet from "@mui/joy/Sheet";
// import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Divider from "@mui/joy/Divider";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
// import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PlaylistAddCheckRoundedIcon from "@mui/icons-material/PlaylistAddCheckRounded";

import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Avatar from "@mui/joy/Avatar";
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';


export default function Sidebar(){
    const menuOptions1 = [
        {
            icon: <HomeRoundedIcon className={"fill-white"}/>,
            name: 'Sākums',
            link: '',
        },
        {
            icon: <SearchRoundedIcon className={"fill-white"}/>,
            name:  'Mēklēt',
            link: '',
        },
        {
            icon: <PlaylistAddCheckRoundedIcon className={"fill-white"}/>,
            name: 'Iesūtījumi',
            link: ''
        }
    ];
    const menuOptions2 = [
        {
            icon: <PersonRoundedIcon className={"fill-white"}/>,
            name: 'Profils',
            link: ''
        },
        {
            icon: <SettingsRoundedIcon className={"fill-white"}/>,
            name: 'Iestatījumi',
            link: ''
        },
        {
            icon: <LogoutRoundedIcon className={"fill-white"}/>,
            name: 'Izrakstīties',
            link: ''
        }
    ]
    return (
        <Sheet
        className="flex justify-items-center px-1 bg-logoblue-69 overflow-hidden"
        sx={{
            position: 'fixed',
            transform: {
                xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
                md: 'none',
            },
            transition: 'transform 0.4s, width 0.4s',
            zIndex: 10000,
            height: '96.7dvh',
            minWidth: '0',
            width: 'auto',
            top: 0,
            p: 2,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRight: '1px solid',
            borderColor: 'divider',
        }}>

            <div className={"flex justify-items-center px-2"}>
                <div className={"flex text-white font-bold text-center"}>Programme.lv</div>
            </div>
            <Divider className="bg-logoblue-420"/>
            <List className={"flex pt-0"}>
                {menuOptions1.map(({icon, name, link}) => (
                    <ListItem key={name} className={"justify-items-center"}>
                        <ListItemButton className="flex text-white font-semibold align-text-center align-items-center rounded hover:bg-logoblue-420" href={link}>
                            <ListItemDecorator className={"flex"}>
                                {icon}
                            </ListItemDecorator>
                            <ListItemContent className={"flex"}>
                                <div>{name}</div>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <div>
            <Divider className="bg-logoblue-420"/>
            <List className={"align-items-end mt-auto mb-0"}>
                {menuOptions2.map(({icon, name, link}) => (
                    <ListItem key={name} className={"flex justify-items-center"}>
                        <ListItemButton className={"flex text-white font-semibold  align-items-center rounded hover:bg-logoblue-420"} href={link}>
                            <ListItemDecorator className={"flex"}>
                                {icon}
                            </ListItemDecorator>
                            <ListItemContent className={"flex"}>
                                <div>{name}</div>
                            </ListItemContent>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider className="bg-logoblue-420"/>
            <Box className={"flex align-items-center pt-3 ps-1"}>
                <Avatar className={"rounded"} variant="soft" size="md" src="team_photo/krisjanis.png"/>
                <Box className={"flex"}>
                    <div className={"columns-1 px-2 align-items-center"}>
                    <div className={"text-sm text-white flex"}>K. Petručeņa</div>
                    <div className={"text-xs text-gray-300 flex"}>@KrisjanisP</div>
                    </div>
                </Box>
            </Box>
            </div>




        </Sheet>
    )
}