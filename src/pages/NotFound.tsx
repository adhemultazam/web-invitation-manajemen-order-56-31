
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-white sm:text-7xl">404</h1>
        <h2 className="mb-8 text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Halaman Tidak Ditemukan
        </h2>
        <p className="mb-8 max-w-lg mx-auto text-gray-600 dark:text-gray-400">
          Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
        </p>
        <Button
          onClick={() => navigate("/")}
          variant="outline" 
          className="flex items-center gap-2 mx-auto"
        >
          <ArrowLeft size={18} />
          Kembali ke Dashboard
        </Button>
      </div>
    </div>
  );
}
