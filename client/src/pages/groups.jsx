import React from 'react';
import AllGroups from '../components/common/allGroups';
import FindGroups from '../components/groups/find';
import CreateGroup from '../components/groups/create';
import LinearNav from '../components/common/linearNav';

const Groups = () => {
  return (
    <LinearNav
      title="Groups"
      data={[
        {
          name: 'groups',
          label: 'My groups',
          Component: AllGroups,
        },
        {
          name: 'find',
          label: 'Find groups',
          Component: FindGroups,
        },
        {
          name: 'create',
          label: 'Create a group',
          Component: CreateGroup,
        },
      ]}
    />
  );
};

export default Groups;
