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
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData?.user) {
      console.log(`User not authenticated, cannot fetch ${table}`);
      return [];
    }
    
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .eq('user_id', userData.user.id)
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
    
    if (!userData?.user) {
      toast.error("You must be logged in to add data");
      return null;
    }
    
    // Ensure user_id is set
    const dataWithUserId = {
      ...data,
      user_id: userData.user.id
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
  getOrders: async (month?: string) => {
    try {
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        console.log("User not authenticated, cannot fetch orders");
        return [];
      }
      
      let query = supabase
        .from('orders')
        .select('*')
        .eq('user_id', userData.user.id);
      
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
      
      // Create a new object with explicit month property for TypeScript
      const orderData = {
        ...order,
        user_id: userData.user.id,
        month: orderMonth
      } as Partial<Order> & { month: string, user_id: string };
      
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
      const updateData = { ...order } as Partial<Order> & { month?: string };
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
      // Get current user
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        console.log("User not authenticated, cannot fetch transactions");
        return [];
      }
      
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userData.user.id);
      
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
export const migrateToSupabase = async (
  onProgress?: (progress: { percentage: number; total: number; completed: number; failed: number }) => void
) => {
  // Get current user
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData?.user) {
    toast.error("You must be logged in to migrate data");
    return { success: false, error: "Not authenticated" };
  }
  
  try {
    // Start migration
    toast.info("Starting data migration...");
    
    // Define all migration tasks
    const months = [
      'januari', 'februari', 'maret', 'april', 'mei', 'juni',
      'juli', 'agustus', 'september', 'oktober', 'november', 'desember'
    ];
    
    const years = ['2023', '2024', '2025'];
    
    // Count total items to migrate for progress tracking
    let totalItems = 0;
    let completedItems = 0;
    let failedItems = 0;
    
    // Count items in localStorage
    const vendorsData = localStorage.getItem('vendors');
    const vendors = vendorsData ? JSON.parse(vendorsData) : [];
    totalItems += vendors.length;
    
    const themesData = localStorage.getItem('weddingThemes');
    const themes = themesData ? JSON.parse(themesData) : [];
    totalItems += themes.length;
    
    const addonsData = localStorage.getItem('addons');
    const addons = addonsData ? JSON.parse(addonsData) : [];
    totalItems += addons.length;
    
    const packagesData = localStorage.getItem('packages');
    const packages = packagesData ? JSON.parse(packagesData) : [];
    totalItems += packages.length;
    
    const workStatusesData = localStorage.getItem('workStatuses');
    const workStatuses = workStatusesData ? JSON.parse(workStatusesData) : [];
    totalItems += workStatuses.length;
    
    // Count orders
    for (const month of months) {
      const ordersData = localStorage.getItem(`orders_${month}`);
      const orders = ordersData ? JSON.parse(ordersData) : [];
      totalItems += orders.length;
    }
    
    // Count invoices and items
    const invoicesData = localStorage.getItem('invoices');
    const invoices = invoicesData ? JSON.parse(invoicesData) : [];
    totalItems += invoices.length;
    
    let invoiceItemCount = 0;
    for (const invoice of invoices) {
      if (invoice.items && Array.isArray(invoice.items)) {
        invoiceItemCount += invoice.items.length;
      }
    }
    totalItems += invoiceItemCount;
    
    // Count transactions
    for (const year of years) {
      for (const month of months) {
        const transactionsData = localStorage.getItem(`transactions_${year}_${month}`);
        const transactions = transactionsData ? JSON.parse(transactionsData) : [];
        totalItems += transactions.length;
      }
    }
    
    // Count settings
    const settingKeys = [
      'invoiceSettings', 
      'generalSettings', 
      'themeSettings', 
      'brandSettings'
    ];
    
    for (const key of settingKeys) {
      if (localStorage.getItem(key)) {
        totalItems += 1;
      }
    }
    
    const updateProgress = () => {
      if (onProgress) {
        const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
        onProgress({
          percentage,
          total: totalItems,
          completed: completedItems,
          failed: failedItems
        });
      }
    };
    
    // Initial progress update
    updateProgress();
    
    // Helper function to track progress
    const trackProgress = async (promise) => {
      try {
        await promise;
        completedItems++;
      } catch (error) {
        console.error("Migration error:", error);
        failedItems++;
      }
      updateProgress();
    };
    
    // Migrate vendors
    for (const vendor of vendors) {
      await trackProgress(
        supabase.from('vendors').insert({
          ...vendor,
          user_id: userData.user.id
        })
      );
    }
    console.log("Migrated vendors");
    
    // Migrate themes
    for (const theme of themes) {
      await trackProgress(
        supabase.from('themes').insert({
          ...theme,
          user_id: userData.user.id
        })
      );
    }
    console.log("Migrated themes");
    
    // Migrate addons
    for (const addon of addons) {
      await trackProgress(
        supabase.from('addons').insert({
          ...addon,
          user_id: userData.user.id
        })
      );
    }
    console.log("Migrated addons");
    
    // Migrate packages
    for (const pkg of packages) {
      await trackProgress(
        supabase.from('packages').insert({
          ...pkg,
          user_id: userData.user.id
        })
      );
    }
    console.log("Migrated packages");
    
    // Migrate work statuses
    for (const status of workStatuses) {
      await trackProgress(
        supabase.from('work_statuses').insert({
          ...status,
          user_id: userData.user.id
        })
      );
    }
    console.log("Migrated work statuses");
    
    // Migrate orders from all months
    for (const month of months) {
      const ordersData = localStorage.getItem(`orders_${month}`);
      if (ordersData) {
        const orders = JSON.parse(ordersData);
        for (const order of orders) {
          await trackProgress(
            supabase.from('orders').insert({
              ...order,
              month,
              user_id: userData.user.id
            })
          );
        }
        console.log(`Migrated orders for ${month}`);
      }
    }
    
    // Migrate invoices
    for (const invoice of invoices) {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          ...invoice,
          user_id: userData.user.id
        })
        .select('id')
        .single();
      
      if (error) {
        failedItems++;
      } else {
        completedItems++;
        
        // Migrate invoice items if they exist
        const invoiceId = data.id;
        if (invoice.items && Array.isArray(invoice.items) && invoiceId) {
          for (const item of invoice.items) {
            await trackProgress(
              supabase.from('invoice_items').insert({
                ...item,
                invoice_id: invoiceId,
                user_id: userData.user.id
              })
            );
          }
        }
      }
      
      updateProgress();
    }
    console.log("Migrated invoices and invoice items");
    
    // Migrate transactions
    for (const year of years) {
      for (const month of months) {
        const transactionsData = localStorage.getItem(`transactions_${year}_${month}`);
        if (transactionsData) {
          const transactions = JSON.parse(transactionsData);
          for (const transaction of transactions) {
            await trackProgress(
              supabase.from('transactions').insert({
                ...transaction,
                year,
                month,
                user_id: userData.user.id
              })
            );
          }
          console.log(`Migrated transactions for ${month} ${year}`);
        }
      }
    }
    
    // Migrate user settings
    for (const key of settingKeys) {
      const settingData = localStorage.getItem(key);
      if (settingData) {
        try {
          const value = JSON.parse(settingData);
          await trackProgress(
            supabase.from('user_settings').insert({
              key,
              value,
              user_id: userData.user.id
            })
          );
        } catch (e) {
          console.error(`Failed to migrate setting: ${key}`, e);
          failedItems++;
          updateProgress();
        }
      }
    }
    
    // Final progress update
    updateProgress();
    
    toast.success("Data migration completed successfully!");
    return { 
      success: true,
      stats: {
        total: totalItems,
        completed: completedItems,
        failed: failedItems
      }
    };
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
    fetchAll: async (): Promise<T[]> => {
      try {
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData?.user) {
          console.log(`User not authenticated, cannot fetch ${tableName}`);
          return [];
        }
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('user_id', userData.user.id);
          
        if (error) throw error;
        return data;
      } catch (error) {
        handleSupabaseError(error, `fetch ${tableName}`);
        return [];
      }
    },
    fetchById: async (id: string): Promise<T | null> => {
      try {
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData?.user) {
          console.log(`User not authenticated, cannot fetch ${tableName} by id`);
          return null;
        }
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', id)
          .eq('user_id', userData.user.id)
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        handleSupabaseError(error, `fetch ${tableName} by id`);
        return null;
      }
    },
    create: async (record: Omit<T, 'id'>): Promise<T | null> => {
      try {
        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData?.user) {
          toast.error(`You must be logged in to create ${tableName}`);
          return null;
        }
        
        // Add user_id to record
        const recordWithUserId = {
          ...record,
          user_id: userData.user.id
        };
        
        const { data, error } = await supabase
          .from(tableName)
          .insert(recordWithUserId)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        handleSupabaseError(error, `create ${tableName}`);
        return null;
      }
    },
    update: async (id: string, record: Partial<T>): Promise<T | null> => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .update(record)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        handleSupabaseError(error, `update ${tableName}`);
        return null;
      }
    },
    delete: async (id: string): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        return true;
      } catch (error) {
        handleSupabaseError(error, `delete ${tableName}`);
        return false;
      }
    }
  };
};
