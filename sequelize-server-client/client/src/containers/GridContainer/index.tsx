import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { TableVirtuoso } from 'react-virtuoso';
import { UsersStoreProps } from './types';
import styled from '@emotion/styled';

const Th = styled.th`
  background: blue;
  color: white;
  text-align: left;
  padding: 2px 6px;
`;

const Td = styled.td`
  text-align: left;
  padding: 2px 8px;
`;

const GridContainer = ({ usersStore }: UsersStoreProps) => {

  useEffect(() => {
    if (!usersStore.hasFetched) {
      usersStore.getUsers();
    }
  }, [usersStore]);

  return (
    <div style={{ width: 600, margin: '0 auto' }}>
      <h1>Users List</h1>
      {usersStore.state === 'pending' && <p>Loading...</p>}
      {usersStore.state === 'done' && (
        <TableVirtuoso
          data={usersStore.usersData}
          useWindowScroll
          fixedHeaderContent={() => (
            <tr>
              <Th style={{ width: 60 }}>#</Th>
              <Th style={{ width: 180 }}>Name</Th>
              <Th style={{ width: 40 }}>Age</Th>
              <Th style={{ width: 300 }}>Email</Th>
            </tr>
          )}
          itemContent={(index, user) => (
            <>
              <Td>{user.id}</Td>
              <Td>{user.firstName} {user.lastName}</Td>
              <Td>{user.age}</Td>
              <Td>{user.email}</Td>
            </>
          )}
        />
      )}
      {usersStore.state === 'error' && <p>Error loading users.</p>}
    </div>
  );
};

export default inject('usersStore')(observer(GridContainer));
