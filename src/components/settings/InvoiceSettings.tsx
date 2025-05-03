
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function InvoiceSettings() {
  const [formData, setFormData] = useState({
    businessName: "Undangan Digital",
    address: "Jl. Contoh No. 123, Jakarta",
    city: "Jakarta",
    zipCode: "12345",
    phone: "0812-3456-7890",
    email: "info@undangandigital.com",
    website: "www.undangandigital.com",
    bankAccount: "BCA - 1234567890",
    bankAccountName: "PT Undangan Digital",
    taxId: "123.456.789.0-123.000",
    invoiceFooter: "Terima kasih atas pesanan Anda.",
    logo: ""
  });

  const [previewImage, setPreviewImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Only allow images
    if (!file.type.match('image.*')) {
      toast.error('Hanya file gambar yang diperbolehkan');
      return;
    }
    
    // Size check - limit to 500KB
    if (file.size > 500 * 1024) {
      toast.error('Ukuran maksimal logo adalah 500KB');
      return;
    }
    
    setIsUploading(true);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setPreviewImage(reader.result);
        setFormData({
          ...formData,
          logo: reader.result
        });
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success('Pengaturan invoice berhasil disimpan');
    // In a real application, you would save to backend here
  };
  
  const handleDeleteLogo = () => {
    setPreviewImage('');
    setFormData({
      ...formData,
      logo: ''
    });
    toast.success('Logo berhasil dihapus');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Invoice</CardTitle>
          <CardDescription>
            Atur informasi yang akan ditampilkan pada invoice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informasi Bisnis</h3>
            
            <div className="space-y-2">
              <Label htmlFor="logo">Logo</Label>
              <div className="flex items-start space-x-4">
                <div>
                  <div className="border rounded-md h-32 w-32 flex items-center justify-center overflow-hidden bg-secondary">
                    {previewImage ? (
                      <img 
                        src={previewImage}
                        alt="Logo preview"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">Tidak ada logo</span>
                    )}
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <div className="relative">
                      <Button size="sm" variant="outline" className="w-full" type="button" disabled={isUploading}>
                        {isUploading ? "Uploading..." : "Upload Logo"}
                      </Button>
                      <Input
                        type="file"
                        id="logo"
                        accept="image/*"
                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </div>
                    {previewImage && (
                      <Button size="sm" variant="outline" type="button" onClick={handleDeleteLogo}>
                        Hapus
                      </Button>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Rekomendasi: 200x200px, maks 500KB
                  </div>
                </div>
                
                <div className="space-y-2 flex-1">
                  <Label htmlFor="businessName">Nama Bisnis</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Nama bisnis Anda"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Alamat lengkap"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Kota</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Kota"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">Kode Pos</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Kode pos"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nomor telepon"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Website URL"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informasi Pembayaran</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bankAccount">Rekening Bank</Label>
                <Input
                  id="bankAccount"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  placeholder="BCA - 1234567890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankAccountName">Atas Nama</Label>
                <Input
                  id="bankAccountName"
                  name="bankAccountName"
                  value={formData.bankAccountName}
                  onChange={handleChange}
                  placeholder="Nama pemilik rekening"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxId">NPWP (opsional)</Label>
              <Input
                id="taxId"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                placeholder="NPWP"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceFooter">Catatan Kaki Invoice</Label>
              <Textarea
                id="invoiceFooter"
                name="invoiceFooter"
                value={formData.invoiceFooter}
                onChange={handleChange}
                rows={2}
                placeholder="Catatan kaki yang akan ditampilkan di bagian bawah invoice"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Simpan Perubahan</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
