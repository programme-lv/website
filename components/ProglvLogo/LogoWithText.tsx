import Logo from '@/public/logo.png'
import { Flex, Text } from '@mantine/core'
import Image from 'next/image'

export default function LogoWithText({logoScale=0.1}: { logoScale?: number }) {
    return (
        <Flex align={"center"} gap={"sm"}>
            <Image src={Logo} alt="Proglv logo" width={360 * logoScale} height={284 * logoScale} />
            <Text size={'xl'} fw={500} c={"rgb(2, 61, 137)"} style={{ fontFamily: "Roboto" }}>
                programme.lv
            </Text>
        </Flex>
    )
}