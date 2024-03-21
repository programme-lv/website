import { Box, Card, Center, Container, Divider, Group, useMantineTheme } from "@mantine/core";
import Image from "next/image";
import LIO from '@/public/supporters/lio.png';
import NMS from '@/public/supporters/nms.jpg';
import PPS from '@/public/supporters/pps.png';
import SIT from '@/public/supporters/startit.png';
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export default function () {
    const theme = useMantineTheme();
    return (
        <Box mb='xl' bg={'#fafafa'}>
            <Container size={'xl'} >
                <Divider my='xl' />
                <Group visibleFrom="md" justify='space-between' gap={'md'} >
                    <LogoDisplay img={LIO} alt='Latvijas Informātikas olimpiādes logo' />
                    <LogoDisplay img={NMS} alt='Neklātienes Matemātikas skolas logo' />
                    <LogoDisplay img={PPS} alt='Pirmās Programmēšanas skolas logo' />
                    <LogoDisplay img={SIT} alt='Start(IT) izglītības fonda logo' />
                </Group>
                <Group hiddenFrom="md" justify='space-around' gap={'md'} >
                    <LogoDisplay img={LIO} alt='Latvijas Informātikas olimpiādes logo' />
                    <LogoDisplay img={NMS} alt='Neklātienes Matemātikas skolas logo' />
                    <LogoDisplay img={PPS} alt='Pirmās Programmēšanas skolas logo' />
                    <LogoDisplay img={SIT} alt='Start(IT) izglītības fonda logo' />
                </Group>
            </Container>
        </Box>
    );
}

export function LogoDisplay({ img, alt }: { img: StaticImport, alt: string }) {
    const height = 140;
    const width = height * (16 / 9);
    return (
        <Card withBorder pos={'relative'} py={'sm'} radius='md' w={width} h={height}>
            <Center pos={'relative'} h={'100%'}>
                <Image src={img} fill={true} style={{ objectFit: "contain" }} alt={alt} />
            </Center>
        </Card>
    );
}