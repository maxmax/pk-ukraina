import { useState, useEffect, ChangeEvent } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Button,
  Stack,
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { StatementProps } from '../../../types';

type DataTypes = {
  statementData: StatementProps;
  // updateStatement: (attributes: StatementProps) => void;
  // deleteStatement: (id: number) => void;
	updateStatement: Function;
  deleteStatement: Function;
}

export default function Edit({ 
  statementData, 
  updateStatement, 
  deleteStatement
}: DataTypes) {
  const [dataValue, setDataValue] = useState<Dayjs | null>(dayjs(statementData.dateReceiving));
  const [attributes, setAttributes] = useState<StatementProps>(statementData);

  const handleChangeAttributes = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAttributes((prevAttributes) => ({
      ...prevAttributes,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (dataValue !== null) {
      setAttributes((prevAttributes) => ({
        ...prevAttributes,
        dateReceiving: String(dataValue.toDate())
      }));
    }
  }, [dataValue, setAttributes]);

  const setUpdateStatement = () => {
    updateStatement(attributes);
  };

  const setDeleteStatement = () => {
    deleteStatement(attributes.id);
  };

  const excludedFields = ['id', 'dateReceiving', 'published', 'createdAt', 'updatedAt'];

  const fieldLabels: Record<string, string> = {
    diskNumber: 'Номер жорсткого диску',
    outputName: 'ПІБ та підпис працівника, що передав носій',
    inputName: 'ПІБ та підпис працівника який отримав носій',
    deedNumber: 'Номер Акту про знищення жорсткого диску',
    notes: 'Примітки',
  };

  const filteredKeys = Object.keys(attributes).filter((field) => !excludedFields.includes(field));

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, minWidth: '45ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h6" component="h3" align="center" gutterBottom>
        {'Редагувати'}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker 
          label="Дата отримання"
          value={dataValue} 
          format="DD/MM/YYYY"
          onChange={(newValue) => setDataValue(newValue)} 
        />
      </LocalizationProvider>
      {filteredKeys.map((field) => (
        <TextField
          key={field}
          fullWidth
          label={fieldLabels[field] || field}
          id={field}
          name={field}
          variant="standard"
          value={attributes[field as keyof StatementProps]}
          onChange={handleChangeAttributes}
        />
      ))}
      <Stack spacing={2} direction="row" sx={{ pt: 4 }}>
        <Button onClick={setUpdateStatement} variant="contained">
          {'Оновити'}
        </Button>
        <Button onClick={setDeleteStatement} variant="contained" color="error">
          {'Видалити'}
        </Button>
      </Stack>
    </Box>
  );
}