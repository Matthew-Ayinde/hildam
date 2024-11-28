const generateMockData = () => {
    const clothingItems = ['Shirt', 'Pants', 'Jacket', 'Dress', 'Blouse'];
    const orderStatuses = ['Completed', 'Pending', 'Cancelled'];
    const paymentTypes = ['Cash', 'Transfer', 'POS'];
    const items = ['Adire', 'Buba', 'Agbada', 'Abaya', 'Kaftan'];
    const paymentStatus = ['Items Recieved', 'Not Delivered'];
  
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      orderId: `#1111ORD${i + 1}`,
      clothing: clothingItems[i % clothingItems.length],
      customerName: `Customer${i + 1}`,
      orderBy: `Customer full name ${i + 1}`,
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      total: `${Math.floor(Math.random() * 90000) + 10000}`,
      address: `Street${i + 1}/City`,
      paymentType: paymentTypes[i % paymentTypes.length],
      status: orderStatuses[i % orderStatuses.length],
      items: items[i % items.length],
      paymentStatus: paymentStatus[i % paymentStatus.length],
    }));
  
    return mockData;
  };
  
  export const mockData = generateMockData();
  