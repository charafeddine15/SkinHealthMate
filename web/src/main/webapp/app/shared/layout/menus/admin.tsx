import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { DropdownItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavDropdown } from './menu-components';
import { Translate, translate } from 'react-jhipster';

const adminMenuItems = () => (
  <>
    <MenuItem icon="users" to="/admin/user-management" role={['ROLE_ADMIN']} forWho={['ROLE_ADMIN']}>
      <Translate contentKey="global.menu.admin.userManagement">User management</Translate>
    </MenuItem>
    <MenuItem icon="tachometer-alt" to="/admin/metrics" role={['ROLE_ADMIN']} forWho={['ROLE_ADMIN']}>
      <Translate contentKey="global.menu.admin.metrics">Metrics</Translate>
    </MenuItem>
    <MenuItem icon="heart" to="/admin/health" role={['ROLE_ADMIN']} forWho={['ROLE_ADMIN']}>
      <Translate contentKey="global.menu.admin.health">Health</Translate>
    </MenuItem>
    <MenuItem icon="cogs" to="/admin/configuration" role={['ROLE_ADMIN']} forWho={['ROLE_ADMIN']}>
      <Translate contentKey="global.menu.admin.configuration">Configuration</Translate>
    </MenuItem>
    <MenuItem icon="tasks" to="/admin/logs" role={['ROLE_ADMIN']} forWho={['ROLE_ADMIN']}>
      <Translate contentKey="global.menu.admin.logs">Logs</Translate>
    </MenuItem>
    {/* jhipster-needle-add-element-to-admin-menu - JHipster will add entities to the admin menu here */}
  </>
);

const openAPIItem = () => (
  <MenuItem icon="book" to="/admin/docs" role={['ROLE_ADMIN']} forWho={['ROLE_ADMIN']}>
    <Translate contentKey="global.menu.admin.apidocs">API</Translate>
  </MenuItem>
);

export const AdminMenu = ({ showOpenAPI }) => (
  <NavDropdown icon="users-cog" name={translate('global.menu.admin.main')} id="admin-menu" data-cy="adminMenu">
    {adminMenuItems()}
    {showOpenAPI && openAPIItem()}
  </NavDropdown>
);

export default AdminMenu;
