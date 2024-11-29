const generateMockData = () => {
    const gender = ['Unspecified', 'Female', 'Male'];
   
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      date: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      fullName: `Firstname${i + 1} + Lastname${i + 1}`,
      email: `customer${i + 1}@example.com`,
      phone: `080${Math.floor(Math.random() * 90000000) + 10000000}`,
      age: `${Math.floor(Math.random() * 90) + 10}`,
      gender: gender[i % gender.length],
    }));
  
    return mockData;
  };
  
  export const mockData = generateMockData();
  