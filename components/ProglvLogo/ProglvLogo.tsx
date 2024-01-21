import Logo from '@/public/logo.png'
import Image from 'next/image'
import Link from 'next/link'

export default function ProglvLogo(props: { scale: number }) {
    const { scale } = props
    return (
        <Link href="/" style={{padding:0, margin:0, display: 'flex'}}>
        <Image src={Logo} alt="Proglv logo" width={360 * scale} />
        </Link>
    )
}