import Image from 'next/image';

function Header() {
  return (
    <div className="sticky top-0 flex h-16 items-center gap-2 border-b bg-white px-2 py-2">
      <Image
        src="/logo.png"
        width={100}
        height={100}
        alt="logo"
        className="h-11 w-11 rounded-xl"
        draggable="false"
      />
      <h1 className="text-xl font-semibold">
        drivegram
      </h1>
    </div>
  );
}

export default Header;
