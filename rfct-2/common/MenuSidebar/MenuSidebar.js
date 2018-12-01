import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// ICONS
import TuneIcon from '@material-ui/icons/Tune';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooksOutlined';
import HowToRegIcon from '@material-ui/icons/HowToRegOutlined';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import GetAppIcon from '@material-ui/icons/GetAppOutlined';
import FindInPageIcon from '@material-ui/icons/FindInPageOutlined';
// CUSTOM
import MenuItemTemplate from '../templates/Menu/MenuItemTemplate';
import MenuItemWithSubmenuTemplate from '../templates/Menu/MenuWithSubmenuTemplate';

const publicPath = process.env.PUBLIC_PATH;

class MenuSidebar extends Component {

  state = {
    sidebarOpen: this.props.sidebarOpen,
    submenuSchedulingOpen: false,
    submenuRelationshipOpen: false,
    submenuReportsOpen: false,
  };

  openSubmenuScheduling = () => {
    this.setState({ submenuSchedulingOpen: !this.state.submenuSchedulingOpen });
  };

  openSubmenuReports = () => {
    this.setState({ submenuReportsOpen: !this.state.submenuReportsOpen });
  };

  openSubmenuRelationshipStatus = () => {
    this.setState({ submenuRelationshipOpen: !this.state.submenuRelationshipOpen });
  };

  openSidebarAndSubmenuScheduling = () => {
    this.setState({ submenuSchedulingOpen: true }, this.props.submenuClick);
  };

  openSidebarAndSubmenuReports = () => {
    this.setState({ submenuReportsOpen: true }, this.props.submenuClick);
  };

  openSidebarAndSubmenuRelationshipStatus = () => {
    this.setState({ submenuRelationshipOpen: true }, this.props.submenuClick);
  };

  render() {
    const { submenuSchedulingOpen, submenuReportsOpen, submenuRelationshipOpen } = this.state;

    const { sidebarOpen } = this.props;

    return (
      <div>
        <MenuItemTemplate
          linkTo={publicPath + "home"}
          menuText={<FormattedMessage
            id="menu.home"
            defaultMessage="Home"
            description="Rótulo do item de menu - Home"
          />}
          icon={<HomeIcon />}
        />
        <MenuItemTemplate
          linkTo={publicPath + "person-information"}
          menuText={<FormattedMessage
            id="menu.person_information"
            defaultMessage="Consultoras"
            description="Rótulo do item de menu - Consultoras"
          />}
          icon={<PersonOutlineIcon />}
        />
        <MenuItemTemplate
          linkTo={publicPath + "responsible-association"}
          menuText={<FormattedMessage
            id="menu.responsible_association"
            defaultMessage="Responsáveis"
            description="Rótulo do item de menu - Responsáveis"
          />}
          icon={<PeopleIcon />}
        />
        <MenuItemTemplate
          linkTo={publicPath + "structure-suggestion"}
          menuText={<FormattedMessage
            id="menu.structure_indication"
            defaultMessage="Sugestão"
            description="Rótulo do item de menu - Sugestão"
          />}
          icon={<FindInPageIcon />}
        />
        <MenuItemTemplate
          linkTo={publicPath + "parameters"}
          menuText={<FormattedMessage
            id="menu.parameters"
            defaultMessage="Parametrização"
            description="Rótulo do item de menu - Parametrização"
          />}
          icon={<TuneIcon />}
        />

        <MenuItemWithSubmenuTemplate
          collapseHandler={!sidebarOpen ? this.openSidebarAndSubmenuScheduling : this.openSubmenuScheduling}
          isOpen={submenuSchedulingOpen && sidebarOpen}
          icon={<ImportExportIcon />}
          menuText={<FormattedMessage
            id="menu.structure_change"
            defaultMessage="Movimentação"
            description="Rótulo do item de menu - Movimentação"
          />}
        >
          <MenuItemTemplate
            linkTo={publicPath + "relationship-structure-change"}
            menuText={<FormattedMessage
              id="menu.structureChange"
              defaultMessage="Movimentação Online"
              description="Rótulo do item de menu - Movimentação Online"
            />}
            isSubmenu
          />
          <MenuItemTemplate
            linkTo={publicPath + "scheduling"}
            menuText={<FormattedMessage
              id="menu.scheduling_page"
              defaultMessage="Agendamentos"
              description="Rótulo do item de menu - Agendamentos"
            />}
            isSubmenu
          />
          <MenuItemTemplate
            linkTo={publicPath + "scheduling-cancel"}
            menuText={<FormattedMessage
              id="menu.scheduling.cancel"
              defaultMessage="Cancelar Agendamento"
              description="Rótulo do item de menu - Cancelar Agendamento"
            />}
            isSubmenu
          />
        </MenuItemWithSubmenuTemplate>

        <MenuItemWithSubmenuTemplate
          collapseHandler={!sidebarOpen ? this.openSidebarAndSubmenuRelationshipStatus : this.openSubmenuRelationshipStatus}
          isOpen={submenuRelationshipOpen && sidebarOpen}
          icon={<HowToRegIcon />}
          menuText={<FormattedMessage
            id="menu.relationship_status"
            defaultMessage="Status Comercial"
            description="Rótulo do item de menu - Status Comercial"
          />}
        >
          <MenuItemTemplate
            linkTo={publicPath + "person-relationship-status"}
            menuText={<FormattedMessage
              id="menu.personRelationshipStatus"
              defaultMessage="Cessação/Reativação Online"
              description="Rótulo do item de menu - Cessação/Reativação Online"
            />}
            isSubmenu
          />
          <MenuItemTemplate
            linkTo={publicPath + "bulk-relationship-status"}
            menuText={<FormattedMessage
              id="menu.bulk_relationship_status_page"
              defaultMessage="Reativação em Lote"
              description="Rótulo do item de menu - Reativação em Lote"
            />}
            isSubmenu
          />
        </MenuItemWithSubmenuTemplate>

        <MenuItemWithSubmenuTemplate
          collapseHandler={!sidebarOpen ? this.openSidebarAndSubmenuReports : this.openSubmenuReports}
          isOpen={submenuReportsOpen && sidebarOpen}
          icon={<LibraryBooksIcon />}
          menuText={<FormattedMessage
            id="menu.reports"
            defaultMessage="Relatórios"
            description="Rótulo do item de menu - Relatórios"
          />}
        >
          <MenuItemTemplate
            linkTo={publicPath + "scheduling-report"}
            menuText={<FormattedMessage
              id="menu.scheduling_report"
              defaultMessage="Movimentações"
              description="Rótulo do item de menu - Relatório de Movimentações"
            />}
            isSubmenu
          />
          <MenuItemTemplate
            linkTo={publicPath + "responsible-history-report"}
            menuText={<FormattedMessage
              id="menu.responsible_history_report"
              defaultMessage="Vigência de Responsável"
              description="Rótulo do item de menu - Relatório de Vigência de Responsável"
            />}
            isSubmenu
          />
          <MenuItemTemplate
            linkTo={publicPath + "people_non_contemplated_report"}
            menuText={<FormattedMessage
              id="menu.people_non_contemplated_report"
              defaultMessage="Pessoas Não Contempladas"
              description="Rótulo do item de menu - Relatório de Pessoas Não Contempladas"
            />}
            isSubmenu
          />
        </MenuItemWithSubmenuTemplate>

        <MenuItemTemplate
          linkTo={publicPath + "downloads"}
          menuText={<FormattedMessage
            id="menu.download_reports"
            defaultMessage="Downloads"
            description="Rótulo do item de menu - Downloads"
          />}
          icon={<GetAppIcon />}
        />
      </div>
    );
  }
}

MenuSidebar.propTypes = {
  submenuClick: PropTypes.func.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
};

export default MenuSidebar;
