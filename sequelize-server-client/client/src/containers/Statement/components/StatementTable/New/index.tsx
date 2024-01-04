import React, { useState, useEffect, ChangeEvent } from 'react';
import { Box, TextField, Typography, Stack, Button } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { NewStatementProps } from '../../../types';

type NewProps = {
	createStatement: (data: NewStatementProps) => Promise<void>;
	setParentOpen: (value: boolean) => void;
};

const defaultAttributes = {
	diskNumber: '',
  outputName: '',
  inputName: '',
  deedNumber: '',
  notes: '',
};

const fieldLabels: Record<string, string> = {
  diskNumber: 'Номер жорсткого диску',
  outputName: 'ПІБ та підпис працівника, що передав носій',
  inputName: 'ПІБ та підпис працівника який отримав носій',
  deedNumber: 'Номер Акту про знищення жорсткого диску',
  notes: 'Примітки',
};

const New: React.FC<NewProps> = ({ createStatement, setParentOpen }) => {
  const [dataValue, setDataValue] = useState<Dayjs | null>(dayjs());
  const [attributes, setAttributes] = useState(defaultAttributes);

  const handleChangeAttributes = (e: ChangeEvent<HTMLInputElement>) => {
    setAttributes((prevAttributes) => ({
      ...prevAttributes,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (dataValue !== null) {
      setAttributes((prevAttributes) => ({
        ...prevAttributes,
        dateReceiving: String(dataValue.toDate()),
      }));
    }
  }, [dataValue]);

  const setCreateStatement = () => {
    createStatement(attributes);
    setAttributes(defaultAttributes);
		setParentOpen(false);
  };

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
        {'Створити новий'}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Дата отримання"
          value={dataValue}
          format="DD/MM/YYYY"
          onChange={(newValue) => setDataValue(newValue)}
        />
      </LocalizationProvider>

      {Object.entries(attributes).map(([field, value]) => (
        // Using a condition to exclude the dateReceiving field
        field !== 'dateReceiving' && (
          <TextField
            key={field}
            fullWidth
            label={fieldLabels[field] || field}
            id={field}
            name={field}
            variant="standard"
            value={value}
            onChange={handleChangeAttributes}
          />
        )
      ))}

      <Stack spacing={2} direction="row" sx={{ pt: 4 }}>
        <Button onClick={setCreateStatement} variant="contained">
          {'Створити'}
        </Button>
      </Stack>
    </Box>
  );
};

export default New;
