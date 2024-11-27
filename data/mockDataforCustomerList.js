const generateMockData = () => {
    const clothingItems = ['Shirt', 'Pants', 'Jacket', 'Dress', 'Blouse'];
    const orderStatuses = ['Completed', 'Packaging', 'Cancelled'];
    const paymentTypes = ['Cash', 'Transfer', 'POS'];
    const priority = ['High', 'Medium', 'Low'];
    const paymentStatus = ['Paid', 'Refund'];
  
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      orderId: `#1111ORD${i + 1}`,
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      clothing: clothingItems[i % clothingItems.length],
      customerName: `Customer${i + 1}`,
      email: `customer${i + 1}@example.com`,
      phone: `080${Math.floor(Math.random() * 90000000) + 10000000}`,
      address: `Street${i + 1}/City`,
      paymentType: paymentTypes[i % paymentTypes.length],
      status: orderStatuses[i % orderStatuses.length],
      priority: priority[i % priority.length],
      paymentStatus: paymentStatus[i % paymentStatus.length],
    }));
  
    return mockData;
  };
  
  export const mockData = generateMockData();
  