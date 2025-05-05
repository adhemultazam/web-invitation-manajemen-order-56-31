
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useOrdersData } from "@/hooks/useOrdersData";

export function TopProductsTable() {
  // Fetch orders data
  const { orders } = useOrdersData();

  // Generate top themes for table
  const topThemes = useMemo(() => {
    const themeMap = new Map<string, number>();
    
    orders.forEach(order => {
      if (order.theme) {
        themeMap.set(order.theme, (themeMap.get(order.theme) || 0) + 1);
      }
    });
    
    const sortedThemeEntries = Array.from(themeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    return sortedThemeEntries.map(([name, count]) => ({
      name,
      count,
      id: Math.floor(Math.random() * 1000) + 1000, // Mock ID for demonstration
      type: "Tema Undangan"
    }));
  }, [orders]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Produk Terlaris</CardTitle>
          <CardDescription>
            Tema dan paket dengan pesanan terbanyak
          </CardDescription>
        </div>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" />
          <span>Tambah Produk</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Produk</TableHead>
                <TableHead>ID Produk</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Jumlah Pesanan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topThemes.length > 0 ? (
                topThemes.map((theme) => (
                  <TableRow key={theme.id}>
                    <TableCell className="font-medium">{theme.name}</TableCell>
                    <TableCell>#{theme.id}</TableCell>
                    <TableCell>Tema Undangan Digital</TableCell>
                    <TableCell>{theme.type}</TableCell>
                    <TableCell>{theme.count}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">Hapus</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Tidak ada data produk
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
