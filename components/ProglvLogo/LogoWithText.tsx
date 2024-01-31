import Logo from '@/public/logo.png'
import { Flex, Text } from '@mantine/core'
import Image from 'next/image'

export default function LogoWithText(props: { scale: number }) {
    const { scale } = props
    return (
        <Flex align={"center"} gap={"sm"}>
        <Image src={Logo} alt="Proglv logo" width={360 * scale} height={284 * scale} />
        <Text size="xl" fw={500} c={"rgb(2, 61, 137)"} style={{fontFamily: "Roboto"}}>
        programme.lv
        </Text>
        </Flex>
    )
}