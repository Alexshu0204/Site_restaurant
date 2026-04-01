import AnnouncementBar from "./AnnouncementBar";

export default function Header() {
  return (
    <div className=" fixed top-0 left-0 w-full z-50">
      <AnnouncementBar />
      <nav className="bg-[#231f1d] p-8 text-white text-center text-[32px] font-mono">
        LE GÉNÉRAL
      </nav>
    </div>
  )
}

