import React from 'react'

interface CustomerTableProps {
  name: string;
  age: number;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ name, age }) => {
  return (
    <div>
      <h1>{name}</h1>
        <p>{age}</p>
    </div>
  )
}

export default CustomerTable
