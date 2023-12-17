import { useState, useEffect, ChangeEvent } from 'react';
import { 
	Box, 
	TextField, 
	Typography, 
	Stack,
	Button
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { StatementProps } from '../../../types';

type DataTypes = {
	statementData: StatementProps;
	updateStatement: Function;
	deleteStatement: Function;
}

export default function Edit({ 
	statementData, 
	updateStatement, 
	deleteStatement
}: DataTypes) {
	
	const [dataValue, setDataValue] = useState<Dayjs | null>(dayjs(statementData.dateReceiving));
	
	const [attributes, setAttributes] = useState(statementData);

  const handleChangeAttributes = (e: ChangeEvent<HTMLInputElement>) => {
    setAttributes({
      ...attributes,
      [e.target.name]: e.target.value,
    });
  };

	useEffect(() => {
		if (dataValue !== null) {
			setAttributes({
				...attributes,
				dateReceiving: String(dataValue.toDate())
			});
		}
	}, [dataValue, setAttributes]);

	const setUpdateStatement = () => {
		updateStatement(attributes);
	};

	const setDeleteStatement = () => {
		deleteStatement(attributes.id);
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
			<TextField
				fullWidth
				label="Номер жорсткого диску"
				id={'diskNumber'}
				name={'diskNumber'}
				variant="standard"
				value={attributes['diskNumber']}
				onChange={handleChangeAttributes}
			/>
			<TextField
				fullWidth
				label="ПІБ та підпис працівника, що передав носій"
				id={'outputName'}
				name={'outputName'}
				variant="standard"
				value={attributes['outputName']}
				onChange={handleChangeAttributes}
			/>
			<TextField
				fullWidth
				label="ПІБ та підпис працівника який отримав носій"
				id={'inputName'}
				name={'inputName'}
				variant="standard"
				value={attributes['inputName']}
				onChange={handleChangeAttributes}
			/>
			<TextField
				fullWidth
				label="Номер Акту про знищення жорсткого диску"
				id={'deedNumber'}
				name={'deedNumber'}
				variant="standard"
				value={attributes['deedNumber']}
				onChange={handleChangeAttributes}
			/>
			<TextField
				fullWidth
				label="Примітки"
				id={'notes'}
				name={'notes'}
				variant="standard"
				value={attributes['notes']}
				onChange={handleChangeAttributes}
			/>
			<Stack spacing={2} direction="row" sx={{pt: 4}}>
				<Button onClick={setUpdateStatement} variant="contained">{'Оновити'}</Button>
				<Button onClick={setDeleteStatement} variant="contained" color="error">{'Видалити'}</Button>
			</Stack>
    </Box>
  );
}