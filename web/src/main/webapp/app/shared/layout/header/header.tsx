import './header.scss';

import React, { useState } from 'react';
import { Translate, Storage } from 'react-jhipster';
import { Navbar, Nav, NavbarToggler, Collapse, NavItem, NavLink } from 'reactstrap';
import LoadingBar from 'react-redux-loading-bar';

import { Home, Brand } from './header-components';
import { AdminMenu, EntitiesMenu, AccountMenu, LocaleMenu } from '../menus';
import { useAppDispatch } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale';
import Authentication from 'app/shared/reducers/authentication';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
export interface IHeaderProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  ribbonEnv: string;
  isInProduction: boolean;
  isOpenAPIEnabled: boolean;
  currentLocale: string;
}

const Header = (props: IHeaderProps) => {
  const data = sessionStorage.getItem('user_data') ? sessionStorage.getItem('user_data') : null;
  const dataJson = data ? JSON.parse(data) : null;
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useAppDispatch();

  const handleLocaleChange = event => {
    const langKey = event.target.value;
    Storage.session.set('locale', langKey);
    dispatch(setLocale(langKey));
  };

  const renderDevRibbon = () =>
    props.isInProduction === false ? (
      <div className="ribbon dev">
        <a href="">
          <Translate contentKey={`global.ribbon.${props.ribbonEnv}`} />
        </a>
      </div>
    ) : null;

  const toggleMenu = () => setMenuOpen(!menuOpen);

  /* jhipster-needle-add-element-to-menu - JHipster will add new menu items here */

  return (
    <div id="app-header">
      {renderDevRibbon()}
      <LoadingBar className="loading-bar" />
      <Navbar data-cy="navbar" dark expand="md" fixed="top" className="jh-navbar">
        <NavbarToggler aria-label="Menu" onClick={toggleMenu} />
        <Brand />
        <Collapse isOpen={menuOpen} navbar>
          <Nav id="header-tabs" className="ms-auto" navbar>
            {props.isAuthenticated && props.isAdmin && (
              <NavItem>
                <NavLink tag={Link} to="/dashboard">
                  <FontAwesomeIcon icon={faTachometerAlt} />
                  Dashboard
                </NavLink>
              </NavItem>
            )}

            {data ? (
              dataJson.authorities.includes('ROLE_DERMATOLOGUE') && (
                <NavItem>
                  <NavLink tag={Link} to="/dermatologue/my-scheduler">
                    <FontAwesomeIcon icon={faCalendar} />
                    My-scheduler
                  </NavLink>
                </NavItem>
              )
            ) : (
              <></>
            )}
            {props.isAuthenticated && <EntitiesMenu />}
            {/*{props.isAuthenticated && props.isAdmin && <AdminMenu showOpenAPI={props.isOpenAPIEnabled} />}*/}

            <LocaleMenu currentLocale={props.currentLocale} onClick={handleLocaleChange} />
            <AccountMenu isAuthenticated={props.isAuthenticated} />
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
