import { supabase } from "@/integrations/supabase/client";
import { 
  Order, Addon, Vendor, Theme, Package, 
  WorkStatus, Transaction, Invoice, InvoiceItem 
} from "@/types/types";
import { toast } from "sonner";

// Generic error handler
export const handleSupabaseError = (error: any, actionName: string) => {
  console.error(`Supabase ${actionName} error:`, error);
  toast.error(`Error: ${error.message || 'Unknown error occurred'}`);
};

// Common fetching with user_id filter
export const fetchUserData = async <T>(
  table: string, 
  select: string = '*'
): Promise<T[]> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []) as T[];
  } catch (error) {
    handleSupabaseError(error, `fetch ${table}`);
    return [];
  }
};

// Generic insert function
export const insertData = async <T>(
  table: string, 
  data: Partial<T>
): Promise<T | null> => {
  try {
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    
    // Ensure user_id is set
    const dataWithUserId = {
      ...data,
      user_id: userData?.user?.id
    };
    
    const { data: result, error } = await supabase
      .from(table)
      .insert(dataWithUserId)
      .select()
      .single();
    
    if (error) throw error;
    return result as T;
  } catch (error) {
    handleSupabaseError(error, `insert ${table}`);
    return null;
  }
};

// Generic update function
export const updateData = async <T>(
  table: string, 
  id: string, 
  data: Partial<T>
): Promise<T | null> => {
  try {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result as T;
  } catch (error) {
    handleSupabaseError(error, `update ${table}`);
    return null;
  }
};

// Generic delete function
export const deleteData = async (
  table: string, 
  id: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    handleSupabaseError(error, `delete ${table}`);
    return false;
  }
};

// Convert specific functions for different data types
export const addonsApi = {
  getAddons: () => fetchUserData<Addon>('addons'),
  createAddon: (addon: Partial<Addon>) => insertData<Addon>('addons', addon),
  updateAddon: (id: string, addon: Partial<Addon>) => updateData<Addon>('addons', id, addon),
  deleteAddon: (id: string) => deleteData('addons', id)
};

export const vendorsApi = {
  getVendors: () => fetchUserData<Vendor>('vendors'),
  createVendor: (vendor: Partial<Vendor>) => insertData<Vendor>('vendors', vendor),
  updateVendor: (id: string, vendor: Partial<Vendor>) => updateData<Vendor>('vendors', id, vendor),
  deleteVendor: (id: string) => deleteData('vendors', id)
};

export const themesApi = {
  getThemes: () => fetchUserData<Theme>('themes'),
  createTheme: (theme: Partial<Theme>) => insertData<Theme>('themes', theme),
  updateTheme: (id: string, theme: Partial<Theme>) => updateData<Theme>('themes', id, theme),
  deleteTheme: (id: string) => deleteData('themes', id)
};

export const packagesApi = {
  getPackages: () => fetchUserData<Package>('packages'),
  createPackage: (pkg: Partial<Package>) => insertData<Package>('packages', pkg),
  updatePackage: (id: string, pkg: Partial<Package>) => updateData<Package>('packages', id, pkg),
  deletePackage: (id: string) => deleteData('packages', id)
};

export const workStatusesApi = {
  getWorkStatuses: () => fetchUserData<WorkStatus>('work_statuses'),
  createWorkStatus: (status: Partial<WorkStatus>) => insertData<WorkStatus>('work_statuses', status),
  updateWorkStatus: (id: string, status: Partial<WorkStatus>) => updateData<WorkStatus>('work_statuses', id, status),
  deleteWorkStatus: (id: string) => deleteData('work_statuses', id)
};

export const ordersApi = {
  getOrders: (month?: string) => {
    try {
      let query = supabase
        .from('orders')
        .select('*');
      
      if (month && month !== "Semua Data") {
        query = query.eq('month', month.toLowerCase());
      }
      
      return query.then(({ data, error }) => {
        if (error) throw error;
        return data || [];
      });
    } catch (error) {
      handleSupabaseError(error, 'fetch orders');
      return Promise.resolve([]);
    }
  },
  createOrder: async (order: Partial<Order>) => {
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) throw new Error("User not authenticated");
      
      // Explicitly add the month field
      const orderMonth = order.orderDate 
        ? new Date(order.orderDate).toLocaleString('id-ID', { month: 'long' }).toLowerCase()
        : new Date().toLocaleString('id-ID', { month: 'long' }).toLowerCase();
      
      const orderData = {
        ...order,
        user_id: userData.user.id,
        month: orderMonth
      };
      
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error, 'create order');
      return null;
    }
  },
  updateOrder: async (id: string, order: Partial<Order>) => {
    try {
      // If order date is updated, update the month field too
      const updateData = { ...order };
      if (order.orderDate) {
        updateData.month = new Date(order.orderDate).toLocaleString('id-ID', { month: 'long' }).toLowerCase();
      }
      
      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error, 'update order');
      return null;
    }
  },
  deleteOrder: (id: string) => deleteData('orders', id)
};

export const transactionsApi = {
  getTransactions: async (year: string, month: string) => {
    try {
      let query = supabase
        .from('transactions')
        .select('*');
      
      if (year && year !== "Semua Data") {
        query = query.eq('year', year);
      }
      
      if (month && month !== "Semua Data") {
        query = query.eq('month', month.toLowerCase());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleSupabaseError(error, 'fetch transactions');
      return [];
    }
  },
  createTransaction: async (transaction: Partial<Transaction>) => {
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) throw new Error("User not authenticated");
      
      const transactionData = {
        ...transaction,
        user_id: userData.user.id,
      };
      
      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error, 'create transaction');
      return null;
    }
  },
  updateTransaction: (id: string, transaction: Partial<Transaction>) => 
    updateData<Transaction>('transactions', id, transaction),
  deleteTransaction: (id: string) => deleteData('transactions', id)
};

export const invoicesApi = {
  getInvoices: () => fetchUserData<Invoice>('invoices'),
  createInvoice: (invoice: Partial<Invoice>) => insertData<Invoice>('invoices', invoice),
  updateInvoice: (id: string, invoice: Partial<Invoice>) => updateData<Invoice>('invoices', id, invoice),
  deleteInvoice: (id: string) => deleteData('invoices', id)
};

// Function to migrate data from localStorage to Supabase
export const migrateToSupabase = async () => {
  // Get current user
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData?.user) {
    toast.error("You must be logged in to migrate data");
    return { success: false, error: "Not authenticated" };
  }
  
  try {
    // Start migration
    toast.info("Starting data migration...");
    
    // Migrate vendors
    const vendorsData = localStorage.getItem('vendors');
    if (vendorsData) {
      const vendors = JSON.parse(vendorsData);
      for (const vendor of vendors) {
        await supabase.from('vendors').insert({
          ...vendor,
          user_id: userData.user.id
        });
      }
      console.log("Migrated vendors");
    }
    
    // Migrate themes
    const themesData = localStorage.getItem('weddingThemes');
    if (themesData) {
      const themes = JSON.parse(themesData);
      for (const theme of themes) {
        await supabase.from('themes').insert({
          ...theme,
          user_id: userData.user.id
        });
      }
      console.log("Migrated themes");
    }
    
    // Migrate addons
    const addonsData = localStorage.getItem('addons');
    if (addonsData) {
      const addons = JSON.parse(addonsData);
      for (const addon of addons) {
        await supabase.from('addons').insert({
          ...addon,
          user_id: userData.user.id
        });
      }
      console.log("Migrated addons");
    }
    
    // Migrate packages
    const packagesData = localStorage.getItem('packages');
    if (packagesData) {
      const packages = JSON.parse(packagesData);
      for (const pkg of packages) {
        await supabase.from('packages').insert({
          ...pkg,
          user_id: userData.user.id
        });
      }
      console.log("Migrated packages");
    }
    
    // Migrate work statuses
    const workStatusesData = localStorage.getItem('workStatuses');
    if (workStatusesData) {
      const workStatuses = JSON.parse(workStatusesData);
      for (const status of workStatuses) {
        await supabase.from('work_statuses').insert({
          ...status,
          user_id: userData.user.id
        });
      }
      console.log("Migrated work statuses");
    }
    
    // Migrate orders from all months
    const months = [
      'januari', 'februari', 'maret', 'april', 'mei', 'juni',
      'juli', 'agustus', 'september', 'oktober', 'november', 'desember'
    ];
    
    for (const month of months) {
      const ordersData = localStorage.getItem(`orders_${month}`);
      if (ordersData) {
        const orders = JSON.parse(ordersData);
        for (const order of orders) {
          await supabase.from('orders').insert({
            ...order,
            month,
            user_id: userData.user.id
          });
        }
        console.log(`Migrated orders for ${month}`);
      }
    }
    
    // Migrate invoices
    const invoicesData = localStorage.getItem('invoices');
    if (invoicesData) {
      const invoices = JSON.parse(invoicesData);
      for (const invoice of invoices) {
        const { id: invoiceId } = await supabase
          .from('invoices')
          .insert({
            ...invoice,
            user_id: userData.user.id
          })
          .select('id')
          .single()
          .then(res => res.data || { id: null });
        
        // Migrate invoice items if they exist
        if (invoice.items && invoiceId) {
          for (const item of invoice.items) {
            await supabase.from('invoice_items').insert({
              ...item,
              invoice_id: invoiceId,
              user_id: userData.user.id
            });
          }
        }
      }
      console.log("Migrated invoices and invoice items");
    }
    
    // Migrate transactions
    // We need to check for transactions in different year/month combinations
    const years = ['2023', '2024', '2025'];
    for (const year of years) {
      for (const month of months) {
        const transactionsData = localStorage.getItem(`transactions_${year}_${month}`);
        if (transactionsData) {
          const transactions = JSON.parse(transactionsData);
          for (const transaction of transactions) {
            await supabase.from('transactions').insert({
              ...transaction,
              year,
              month,
              user_id: userData.user.id
            });
          }
          console.log(`Migrated transactions for ${month} ${year}`);
        }
      }
    }
    
    toast.success("Data migration completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Migration error:", error);
    toast.error("Error during migration", {
      description: error.message
    });
    return { success: false, error };
  }
};

// CRUD utility to use in hooks and components
export const createSupabaseCrud = <T extends { id: string }>(tableName: string) => {
  return {
    fetchAll: () => fetchUserData<T>(tableName),
    fetchById: async (id: string): Promise<T | null> => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        handleSupabaseError(error, `fetch ${tableName} by id`);
        return null;
      }
    },
    create: (record: Omit<T, 'id'>) => insertData<T>(tableName, record as Partial<T>),
    update: (id: string, record: Partial<T>) => updateData<T>(tableName, id, record),
    delete: (id: string) => deleteData(tableName, id)
  };
};
