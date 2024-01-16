import { useEffect, useState } from 'react';

interface Statement {
  id: number;
  createdAt: string;
  dateReceiving: string;
  diskNumber: string;
  outputName: string;
  inputName: string;
  deedNumber: string;
  notes: string;
  published: boolean;
}

const useStatements = (page: number, pageSize: number) => {
  const [statements, setStatements] = useState<Statement[]>([]);

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/statements/pagination?page=${page}&pageSize=${pageSize}`);
        const data = await response.json();
        setStatements(data);
      } catch (error) {
        console.error('Error fetching statements:', error);
      }
    };

    fetchStatements();
  }, [page, pageSize]);

  return statements;
};

export default useStatements;
