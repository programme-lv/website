import Image from "next/image";
import React, {PropsWithChildren, useState} from "react";
import Logo_white from "@/../public/Logo_white.png"
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';


const Sidebar = (props: PropsWithChildren) => {
    const [collapsed, setSidebarCollapsed] = useState(false);
    return (
        <div>
            {collapsed
                ? <div className={"bg-logoblue-69 text-white justify-center min-h-screen w-min columns-1 p-3"}>
                    <a onClick={() => setSidebarCollapsed((st) => !st)}>
                        <Image src={Logo_white} alt={"Logo"} style={{
                            width: 'auto',
                            height: 'auto',
                            maxWidth: '40px'
                        }}/>
                    </a>
                    <div className={"p-5"}></div>
                    <div className={"flex justify-center p-2 hover:bg-logoblue-420 rounded"}>
                        <HomeRoundedIcon/>
                    </div>
                    <div className={"flex justify-center p-2 hover:bg-logoblue-420 rounded"}>
                        <SearchRoundedIcon/>
                    </div>
                    <div className={"flex justify-center p-2 hover:bg-logoblue-420 rounded"}>
                        <PlaylistAddCheckRoundedIcon/>
                    </div>
                </div>
                : <div className={"bg-logoblue-69 text-white justify-start min-h-screen w-min columns-1 p-3"}>

                    <a onClick={() => setSidebarCollapsed((st) => !st)}
                    >
                        <div className={"flex items-center"}>
                            <Image src={Logo_white} alt={"Logo"} style={{
                                width: 'auto',
                                height: 'auto',
                                maxWidth: '40px'
                            }}/>
                            <div className={"font-semibold px-3 text-lg"}>Programme.lv</div>
                        </div>
                    </a>
                    <div className={"p-5"}></div>
                    <div className={"flex p-2 items-center hover:bg-logoblue-420 rounded"}>
                        <HomeRoundedIcon/>
                        <div className={"px-3"}>Sākums</div>
                    </div>
                    <div className={"flex justify-start p-2 items-center hover:bg-logoblue-420 rounded"}>
                        <SearchRoundedIcon/>
                        <div className={"px-3"}>Meklēt</div>
                    </div>
                    <div className={"flex justify-start p-2 items-center hover:bg-logoblue-420 rounded"}>
                        <PlaylistAddCheckRoundedIcon/>
                        <div className={"px-3"}>Iesūtījumi</div>
                    </div>
                </div>
            }


        </div>
    )
};

export default Sidebar;