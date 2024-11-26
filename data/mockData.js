const generateMockData = () => {
    const clothingItems = ['Shirt', 'Pants', 'Jacket', 'Dress', 'Blouse'];
    const statuses = ['Paid', 'Pending', 'Cancelled'];
    const paymentTypes = ['Credit Card', 'PayPal', 'Bank Transfer'];
  
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      orderId: `ORD-${i + 1}`,
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      clothing: clothingItems[i % clothingItems.length],
      customerName: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      phone: `080${Math.floor(Math.random() * 90000000) + 10000000}`,
      address: `Street ${i + 1}, City, Country`,
      paymentType: paymentTypes[i % paymentTypes.length],
      status: statuses[i % statuses.length],
    }));
  
    return mockData;
  };
  
  export const mockData = generateMockData();
  