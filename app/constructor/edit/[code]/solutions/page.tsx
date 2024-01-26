import { Container, Divider } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function Solutions(){
    
    return (
        <div style={{height: "100%", width: "100%"}}>
        <Container bg="white" py={1}>
            <h5>Risinājumi</h5>
            <Divider my={'xs'}/>
        </Container>
        </div>
    );
}