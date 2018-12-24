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
            description="Rótulo de menu - Home"
          />}
          icon={<HomeIcon />}
        />
        <MenuItemTemplate
          linkTo={publicPath + "person-information"}
          menuText={<FormattedMessage
            id="page.person_information"
            defaultMessage="Pessoas"
            description="Título da página - Pessoas"
          />}
          icon={<PersonOutlineIcon />}
        />
        <MenuItemTemplate
          linkTo={publicPath + "responsible-association"}
          menuText={<FormattedMessage
            id="menu.responsible_association"
            defaultMessage="Responsáveis"
            description="Rótulo de menu - Responsáveis"
          />}
          icon={<PeopleIcon />}
        />
        <MenuItemTemplate
          linkTo={publicPath + "structure-suggestion"}
          menuText={<FormattedMessage
            id="menu.structure_suggestion"
            defaultMessage="Sugestão"
            description="Rótulo de menu - Sugestão"
          />}
          icon={<FindInPageIcon />}
        />
        <MenuItemTemplate
          linkTo={publicPath + "parameters"}
          menuText={<FormattedMessage
            id="page.parameters"
            defaultMessage="Parametrização"
            description="Título da página - Parametrização"
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
            description="Rótulo de menu - Movimentação"
          />}
        >
          <MenuItemTemplate
            linkTo={publicPath + "relationship-structure-change"}
            menuText={<FormattedMessage
              id="page.online_structure_change"
              defaultMessage="Movimentação Online"
              description="Título da página - Movimentação Online"
            />}
            isSubmenu
          />
          <MenuItemTemplate
            linkTo={publicPath + "scheduling"}
            menuText={<FormattedMessage
              id="page.scheduling"
              defaultMessage="Agendamentos"
              description="Título da página - Agendamentos"
            />}
            isSubmenu
          />
          <MenuItemTemplate
            linkTo={publicPath + "scheduling-cancel"}
            menuText={<FormattedMessage
              id="page.scheduling_cancel"
              defaultMessage="Cancelar Agendamentos"
              description="Título da página - Cancelar Agendamentos"
            />}
            isSubmenu
          />
        </MenuItemWithSubmenuTemplate>

        <MenuItemWithSubmenuTemplate
          collapseHandler={!sidebarOpen ? this.openSidebarAndSubmenuRelationshipStatus : this.openSubmenuRelationshipStatus}
          isOpen={submenuRelationshipOpen && sidebarOpen}
          icon={<HowToRegIcon />}
          menuText={<FormattedMessage
            id="common.commercial_status"
            defaultMessage="Status Comercial"
            description="Rótulo comum - Status Comercial"
          />}
        >
          <MenuItemTemplate
            linkTo={publicPath + "person-relationship-status"}
            menuText={<FormattedMessage
              id="menu.person_relationship_status"
              defaultMessage="Cessação/Reativação Online"
              description="Rótulo de menu - Cessação/Reativação Online"
            />}
            isSubmenu
          />
          <MenuItemTemplate
            linkTo={publicPath + "bulk-relationship-status"}
            menuText={<FormattedMessage
              id="page.bulk_reactivate"
              defaultMessage="Reativação em Lote"
              description="Título da página - Reativação em Lote"
            />}
            isSubmenu
          />
        </MenuItemWithSubmenuTemplate>

        <MenuItemWithSubmenuTemplate
          collapseHandler={!sidebarOpen ? this.openSidebarAndSubmenuReports : this.openSubmenuReports}
          isOpen={submenuReportsOpen && sidebarOpen}
          icon={<LibraryBooksIcon />}
          menuText={<FormattedMessage
            id="common.reports"
            defaultMessage="Relatórios"
            description="Rótulo comum - Relatórios"
          />}
        >
          <MenuItemTemplate
            linkTo={publicPath + "scheduling-report"}
            menuText={<FormattedMessage
              id="menu.scheduling_report"
              defaultMessage="Movimentações"
              description="Rótulo de menu - Relatório de Movimentações"
            />}
            isSubmenu
          />
          <MenuItemTemplate
            linkTo={publicPath + "responsible-history-report"}
            menuText={<FormattedMessage
              id="menu.responsible_history_report"
              defaultMessage="Vigência de Responsável"
              description="Rótulo de menu - Vigência de Responsável"
            />}
            isSubmenu
          />
          <MenuItemTemplate
            linkTo={publicPath + "people-non-contemplated-report"}
            menuText={<FormattedMessage
              id="menu.people_non_contemplated_report"
              defaultMessage="Pessoas Não Contempladas"
              description="Rótulo de menu - Relatório de Pessoas Não Contempladas"
            />}
            isSubmenu
          />
        </MenuItemWithSubmenuTemplate>

        <MenuItemTemplate
          linkTo={publicPath + "downloads"}
          menuText={<FormattedMessage
            id="common.downloads"
            defaultMessage="Downloads"
            description="Rótulo comum - Downloads"
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
