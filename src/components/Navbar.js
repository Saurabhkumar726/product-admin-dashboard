import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <nav className="flex items-center justify-between border-b bg-white px-6 py-4">
      <h1 className="text-xl font-bold text-gray-900">
        Product Admin
      </h1>

      <button
        type="button"
        onClick={handleLogout}
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        Logout
      </button>
    </nav>
  );
}