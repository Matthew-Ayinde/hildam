const generateMockData = () => {
    const roles = ['Admin', 'Project Manager', 'Account Manager', 'Customer'];
  
    const mockData = Array.from({ length: 100 }, (_, i) => ({
      name: `Firstname${i + 1} + Lastname${i + 1}`,
      email: `customer${i + 1}@example.com`,
      age: `${Math.floor(Math.random() * 90) + 10}`,
      roles: roles[i % roles.length],
    }));
  
    return mockData;
  };
  
  export const mockData = generateMockData();
  