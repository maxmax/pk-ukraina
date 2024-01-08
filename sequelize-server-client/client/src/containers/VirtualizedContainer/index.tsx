import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  Container,
  Typography
} from '@mui/material';

import './styles.css';

interface RowProps {
  index: number;
  style: React.CSSProperties;
}

const Row: React.FC<RowProps> = ({ index, style }) => (
  <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
    Row {index}
  </div>
);

const VirtualizedContainer: React.FC = () => (
  <Container maxWidth="lg" sx={{ height: '80vh', mt: 5 }}>
    <Typography variant="h2" gutterBottom>
      React Window Virtualized
    </Typography>
    <AutoSizer>
      {({ height, width }) => (
        <List
          className="List"
          height={height}
          itemCount={1000}
          itemSize={35}
          width={width}
        >
          {Row}
        </List>
      )}
    </AutoSizer>
  </Container>
);

export default VirtualizedContainer;
