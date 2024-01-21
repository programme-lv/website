import Logo from '@/public/logo.png'
import Image from 'next/image'

export default function ProglvLogo(props: { scale: number }) {
    const { scale } = props
    return (
        <Image src={Logo} alt="Proglv logo" width={360 * scale} />
    )
}