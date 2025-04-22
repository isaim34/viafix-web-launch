
export const ensureVendorData = () => {
  // For customers, ensure vendor data exists with defaults
  if (!localStorage.getItem('vendorName')) {
    localStorage.setItem('vendorName', 'Isai Mercado');
  }
  
  if (!localStorage.getItem('vendorAvatar')) {
    localStorage.setItem('vendorAvatar', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80');
  }
  
  // Also ensure the vendor is in mechanic list results
  const vendorAvatar = localStorage.getItem('vendorAvatar');
  const vendorName = localStorage.getItem('vendorName');
  
  if (vendorAvatar) {
    localStorage.setItem('local-mechanic-avatar', vendorAvatar);
  }
  
  if (vendorName) {
    localStorage.setItem('local-mechanic-name', vendorName);
  }
};
