import Logo from '@/public/logo.png'
import Image from 'next/image'

export default function LogoWithText(props: { scale: number }) {
    const { scale } = props
    return (
        <div>
        <Image src={Logo} alt="Proglv logo" width={360 * scale} height={284 * scale} />
        programme.lv
        </div>
    )
}