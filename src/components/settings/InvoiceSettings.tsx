
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { InvoiceSettingsPreview } from "./InvoiceSettingsPreview";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

interface InvoiceSettings {
  logoUrl: string;
  brandName: string;
  businessAddress: string;
  contactEmail: string;
  contactPhone: string;
  bankAccounts: BankAccount[];
  invoiceFooter: string;
}

export function InvoiceSettings() {
  const [settings, setSettings] = useState<InvoiceSettings>({
    logoUrl: "",
    brandName: "Undangan Digital",
    businessAddress: "Jl. Pemuda No. 123, Surabaya",
    contactEmail: "contact@undangandigital.com",
    contactPhone: "+62 812 3456 7890",
    bankAccounts: [
      {
        id: "1",
        bankName: "BCA",
        accountNumber: "1234567890",
        accountHolderName: "PT Undangan Digital Indonesia",
      }
    ],
    invoiceFooter: "Terima kasih atas pesanan Anda."
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("invoiceSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Error parsing invoice settings:", e);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  const handleSaveSettings = () => {
    localStorage.setItem("invoiceSettings", JSON.stringify(settings));
    toast.success("Pengaturan invoice berhasil disimpan");
  };

  // Update settings object when inputs change
  const handleInputChange = (field: keyof InvoiceSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Handle bank account updates
  const handleBankAccountChange = (index: number, field: keyof BankAccount, value: string) => {
    const updatedAccounts = [...settings.bankAccounts];
    updatedAccounts[index] = {
      ...updatedAccounts[index],
      [field]: value
    };
    setSettings(prev => ({ ...prev, bankAccounts: updatedAccounts }));
  };

  // Add new bank account
  const addBankAccount = () => {
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      bankName: "",
      accountNumber: "",
      accountHolderName: ""
    };
    setSettings(prev => ({
      ...prev,
      bankAccounts: [...prev.bankAccounts, newAccount]
    }));
  };

  // Remove bank account
  const removeBankAccount = (index: number) => {
    const updatedAccounts = [...settings.bankAccounts];
    updatedAccounts.splice(index, 1);
    setSettings(prev => ({ ...prev, bankAccounts: updatedAccounts }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Bisnis</CardTitle>
            <CardDescription>
              Informasi bisnis yang akan ditampilkan pada invoice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                value={settings.logoUrl}
                onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-muted-foreground">
                Masukkan URL logo Anda (disarankan ukuran 200x200 pixel)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandName">Nama Bisnis</Label>
              <Input
                id="brandName"
                value={settings.brandName}
                onChange={(e) => handleInputChange("brandName", e.target.value)}
                placeholder="Undangan Digital"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress">Alamat Bisnis</Label>
              <Textarea
                id="businessAddress"
                value={settings.businessAddress}
                onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                placeholder="Jl. Pemuda No. 123, Surabaya"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                  placeholder="contact@undangandigital.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Telepon</Label>
                <Input
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                  placeholder="+62 812 3456 7890"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Akun Bank</span>
              <Button variant="outline" size="sm" onClick={addBankAccount}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah Akun
              </Button>
            </CardTitle>
            <CardDescription>
              Akun bank yang akan ditampilkan pada invoice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.bankAccounts.map((account, index) => (
              <div key={account.id} className="border p-4 rounded-md space-y-3 relative">
                {settings.bankAccounts.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-destructive h-8 w-8 p-0"
                    onClick={() => removeBankAccount(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor={`bankName-${index}`}>Nama Bank</Label>
                  <Input
                    id={`bankName-${index}`}
                    value={account.bankName}
                    onChange={(e) => handleBankAccountChange(index, "bankName", e.target.value)}
                    placeholder="BCA, Mandiri, BNI, dll"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`accountNumber-${index}`}>Nomor Rekening</Label>
                  <Input
                    id={`accountNumber-${index}`}
                    value={account.accountNumber}
                    onChange={(e) => handleBankAccountChange(index, "accountNumber", e.target.value)}
                    placeholder="1234567890"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`accountHolderName-${index}`}>Nama Pemilik Rekening</Label>
                  <Input
                    id={`accountHolderName-${index}`}
                    value={account.accountHolderName}
                    onChange={(e) => handleBankAccountChange(index, "accountHolderName", e.target.value)}
                    placeholder="PT Undangan Digital Indonesia"
                  />
                </div>
              </div>
            ))}
            
            {settings.bankAccounts.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                Belum ada akun bank. Klik tombol "Tambah Akun" untuk menambahkan.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Catatan Footer Invoice</CardTitle>
            <CardDescription>
              Catatan yang akan ditampilkan di bagian bawah invoice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={settings.invoiceFooter}
              onChange={(e) => handleInputChange("invoiceFooter", e.target.value)}
              placeholder="Terima kasih atas pesanan Anda."
              rows={3}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Simpan Pengaturan
          </Button>
        </div>
      </div>

      <div className="md:order-last">
        <InvoiceSettingsPreview settings={settings} />
      </div>
    </div>
  );
}
