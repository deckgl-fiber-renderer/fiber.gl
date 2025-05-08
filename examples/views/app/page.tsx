import Link from 'next/link';

export default function Page() {
  return (
    <ul>
      <li>
        <Link href="/globe">Globe</Link>
      </li>
      <li>
        <Link href="/orbit">Orbit</Link>
      </li>
      <li>
        <Link href="/orthographic">Orthographic</Link>
      </li>
    </ul>
  );
}
