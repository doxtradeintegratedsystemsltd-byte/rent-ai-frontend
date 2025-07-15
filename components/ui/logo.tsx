import Image from "next/image";
import Link from "next/link";

const Logo = ({ className, dark }: { className?: string; dark?: boolean }) => {
  return (
    <Link href="/" className={className}>
      {dark ? (
        <Image src="/images/logo-dark.svg" alt="Logo" width={32} height={32} />
      ) : (
        <Image src="/images/logo.svg" alt="Logo" width={32} height={32} />
      )}
    </Link>
  );
};

export default Logo;
