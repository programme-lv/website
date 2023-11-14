import Breadcrumbs from '@mui/joy/Breadcrumbs';
import IconButton from "@mui/joy/IconButton";
import Link from '@mui/joy/Link';
export default function BreadcrumbNav({path}){
    return (
        <div className={"flex"}>
            <Breadcrumbs className={"flex text-blue-420 font-bold text-lg"}>
                <IconButton href={"/"} className={"bg-transparent flex"}>
                    <img className={"h-7 w-auto"} alt={"logo"} src="/proglv_logo_simple.png"></img>
                </IconButton>
                {path.map(({name, link})=>(
                    <Link key={name} className={" text-blue-420 font-bold text-lg hover:no-underline hover:text-white hover:bg-blue-420 p-1"} href={link}>{name}</Link>
                    ))}
            </Breadcrumbs>
        </div>
    );
}