import { Welcome } from '../components/Welcome/Welcome';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Welcome />
      <Link href="/dashboard">
        hello
      </Link>
      <ColorSchemeToggle />
    </>
  );
}
