import { AuthenticationCard } from "@/components/AuthenticationCard/AuthenticationCard";
import LogoWithText from "@/components/ProglvLogo/LogoWithText";
import { Center, Flex } from "@mantine/core";
export default function Login() {
    return (
        <div style={{minHeight: "100vh", backgroundImage: "url(/backgrounds/mountains.png)", backgroundSize:"cover"}}>
        <Center mih={{base:0, md: "80vh"}} style={{display:"flex", flexDirection:"column"}}>
            <AuthenticationCard />
        </Center>
        </div>
    )
}