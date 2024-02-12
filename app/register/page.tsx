import LoginCard from "@/components/LoginCard/LoginCard";
import { Center } from "@mantine/core";
export default function Login() {
    return (
        <div style={{minHeight: "100vh", backgroundImage: "url(/backgrounds/mountains.png)", backgroundSize:"cover"}}>
        <Center mih={{base:0, md: "80vh"}} style={{display:"flex", flexDirection:"column"}}>
            <LoginCard />
        </Center>
        </div>
    )
}