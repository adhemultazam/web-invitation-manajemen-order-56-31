import { useState, useEffect } from "react";
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
import { BankAccount } from "@/types/types";
import { Plus, Trash2 } from "lucide-react";

export function InvoiceSettings() {
  const [formData, setFormData] = useState({
    businessName: "Undangan Digital",
    address: "Jl. Contoh No. 123, Jakarta",
    city: "Jakarta",
    zipCode: "12345",
    phone: "0812-3456-7890",
    email: "info@undangandigital.com",
    website: "www.undangandigital.com",
    bankAccounts: [] as BankAccount[],
    invoiceFooter: "Terima kasih atas pesanan Anda.",
    logo: ""
  });

  const [previewImage, setPreviewImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Load saved settings when component mounts
  useEffect(() => {
    const savedSettings = localStorage.getItem("invoiceSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setFormData(prev => ({
        ...prev,
        ...parsed
      }));
      if (parsed.logo) {
        setPreviewImage(parsed.logo);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBankAccountChange = (index: number, field: keyof BankAccount, value: string) => {
    const updatedAccounts = [...formData.bankAccounts];
    updatedAccounts[index] = {
      ...updatedAccounts[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      bankAccounts: updatedAccounts
    });
  };

  const handleAddBankAccount = () => {
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      bankName: "",
      accountNumber: "",
      accountHolderName: ""
    };
    
    setFormData({
      ...formData,
      bankAccounts: [...formData.bankAccounts, newAccount]
    });
  };

  const handleRemoveBankAccount = (index: number) => {
    const updatedAccounts = [...formData.bankAccounts];
    updatedAccounts.splice(index, 1);
    
    setFormData({
      ...formData,
      bankAccounts: updatedAccounts
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
    
    // Save to localStorage
    localStorage.setItem("invoiceSettings", JSON.stringify(formData));
    toast.success('Pengaturan invoice berhasil disimpan');
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Informasi Rekening Bank</h3>
              <Button 
                type="button" 
                onClick={handleAddBankAccount} 
                variant="outline" 
                size="sm"
              >
                <Plus className="mr-1 h-4 w-4" />
                Tambah Rekening
              </Button>
            </div>

            {formData.bankAccounts.length > 0 ? (
              <div className="space-y-4">
                {formData.bankAccounts.map((account, index) => (
                  <div key={account.id} className="p-4 border rounded-md space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Rekening #{index + 1}</h4>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveBankAccount(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`bankName-${index}`}>Nama Bank</Label>
                        <Input
                          id={`bankName-${index}`}
                          value={account.bankName}
                          onChange={(e) => handleBankAccountChange(index, 'bankName', e.target.value)}
                          placeholder="BCA, Mandiri, dll."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`accountNumber-${index}`}>Nomor Rekening</Label>
                        <Input
                          id={`accountNumber-${index}`}
                          value={account.accountNumber}
                          onChange={(e) => handleBankAccountChange(index, 'accountNumber', e.target.value)}
                          placeholder="1234567890"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`accountHolderName-${index}`}>Atas Nama</Label>
                        <Input
                          id={`accountHolderName-${index}`}
                          value={account.accountHolderName}
                          onChange={(e) => handleBankAccountChange(index, 'accountHolderName', e.target.value)}
                          placeholder="Nama pemilik rekening"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed rounded-md p-8 text-center">
                <p className="text-muted-foreground mb-2">Belum ada rekening bank</p>
                <Button 
                  type="button" 
                  onClick={handleAddBankAccount} 
                  variant="outline" 
                  size="sm"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Tambah Rekening
                </Button>
              </div>
            )}

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
