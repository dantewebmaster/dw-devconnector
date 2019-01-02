import React, { PureComponent } from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link, withRouter } from 'react-router';
// MATERIAL UI COMPONENTS
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
// MATERIAL UI ICONS
import ActionHome from 'material-ui/svg-icons/action/home';
import ArrowDropDown from 'material-ui/svg-icons/navigation/arrow-drop-down';

class TopNavigation extends PureComponent {

  handleGoHome = () => {
    const publicPath = process.env.PUBLIC_PATH;
    const homePath = `${publicPath.lastIndexOf('/') !== publicPath.length - 1 ? '/' : ''}/home`;
    this.props.router.push(homePath);
  };

  render() {
    const { activeMenus } = this.props;
    return (
      <Toolbar>
        <ToolbarGroup firstChild>
          <IconButton
            tooltip={<FormattedMessage
              id="navigation.home"
              defaultMessage="Início"
              description="Menu Início"
            />}
            onClick={this.handleGoHome}
          >
            <ActionHome />
          </IconButton>
        </ToolbarGroup>
        <ToolbarGroup>
          <Menu desktop={true} autoWidth={false}>
            <MenuItem
              rightIcon={<ArrowDropDown />}
              primaryText={<FormattedMessage
                id="navigation.titles.home"
                defaultMessage="Modelos Comerciais e Estruturas"
                description="Menu Modelos Comerciais e Estruturas"
              />}
              key={Math.random()}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              menuItems={[
                <MenuItem
                  isActive={activeMenus.includes('/business-models/new')}
                  primaryText={<FormattedMessage
                    id="navigation.business_models.new"
                    defaultMessage="Novo Modelo Comercial"
                    description="Menu Novo Modelo"
                  />}
                  containerElement={<Link to="/business-models/new" />}
                  key={Math.random()}
                />,
                <MenuItem
                  primaryText={<FormattedMessage
                    id="navigation.business_models.search"
                    defaultMessage="Modelos Comerciais"
                    description="Menu Modelos Comerciais"
                  />}
                  containerElement={<Link to="/business-models" />}
                  key={Math.random()}
                />,
                <MenuItem
                  primaryText={<FormattedMessage
                    id="navigation.structures_types"
                    defaultMessage="Tipos de Estruturas"
                    description="Menu Tipos de Estruturas"
                  />}
                  containerElement={<Link to="/structure-types" />}
                  key={Math.random()}
                />,
                <MenuItem
                  primaryText={<FormattedMessage
                    id="navigation.hierarchies"
                    defaultMessage="Hierarquias de Modelos"
                    description="Menu Hierarquias de Modelos"
                  />}
                  containerElement={<Link to="/hierarchies" />}
                  key={Math.random()}
                />,
                <Divider key={Math.random()} />,
                <MenuItem
                  primaryText={<FormattedMessage
                    id="navigation.structures.new"
                    defaultMessage="Cadastro de Estruturas"
                    description="Menu Cadastro de Estruturas"
                  />}
                  containerElement={<Link to="/structures/new" />}
                  key={Math.random()}
                />,
                <MenuItem
                  primaryText={<FormattedMessage
                    id="navigation.structures.search"
                    defaultMessage="Consulta de Estruturas"
                    description="Menu Consulta de Estruturas"
                  />}
                  containerElement={<Link to="/structures" />}
                  key={Math.random()}
                />,
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.structures_parameters"
                      defaultMessage="Parametrização de Estruturas"
                      description="Menu Parametrização de Estruturas"
                    />
                  }
                  containerElement={
                    <Link to="/structures/parameters" />
                  }
                  key={Math.random()}
                />
              ]}
            />
          </Menu>
        </ToolbarGroup>
        <ToolbarGroup>
          <Menu desktop={true} autoWidth={false}>
            <MenuItem
              rightIcon={
                <ArrowDropDown />
              }
              primaryText={
                <FormattedMessage
                  id="navigation.calendars_blocks"
                  defaultMessage="Calendários e Blocos"
                  description="Menu Calendários e Blocos"
                />
              }
              key={Math.random()}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              menuItems={[
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.calendars.new"
                      defaultMessage="Novo Calendário"
                      description="Menu Novo Calendário"
                    />
                  }
                  containerElement={
                    <Link to="/calendars/new" />
                  }
                  key={Math.random()}
                />,
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.calendars.search"
                      defaultMessage="Consulta de Calendários"
                      description="Menu Consulta de Calendários"
                    />
                  }
                  containerElement={
                    <Link to="/calendars" />
                  }
                  key={Math.random()}
                />,
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.calendars_parameters"
                      defaultMessage="Parametrização de Calendários"
                      description="Menu Parametrização de Calendários"
                    />
                  }
                  containerElement={
                    <Link to="/calendars/parameters" />
                  }
                  key={Math.random()}
                />,
                <Divider key={Math.random()} />,
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.blocks_sub_blocks"
                      defaultMessage="Blocos e Sub-Blocos"
                      description="Menu Blocos e Sub-Blocos"
                    />
                  }
                  containerElement={
                    <Link to="/calendars/blocks" />
                  }
                  key={Math.random()}
                />,
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.special_dates"
                      defaultMessage="Datas Especiais"
                      description="Menu Datas Especiais"
                    />
                  }
                  containerElement={
                    <Link to="/calendars/special-dates" />
                  }
                  key={Math.random()}
                />
              ]}
            />
          </Menu>
        </ToolbarGroup>
        <ToolbarGroup>
          <Menu desktop={true} autoWidth={false}>
            <MenuItem
              rightIcon={
                <ArrowDropDown />
              }
              primaryText={
                <FormattedMessage
                  id="navigation.zones_sectors"
                  defaultMessage="Zoneamento e Setorização"
                  description="Menu Zoneamento e Setorização"
                />
              }
              key={Math.random()}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              menuItems={[
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.zones.new"
                      defaultMessage="Novo Zoneamento"
                      description="Menu Novo Zoneamento"
                    />
                  }
                  containerElement={
                    <Link to="/zones/new" />
                  }
                  key={Math.random()}
                />,
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.zones"
                      defaultMessage="Consulta de Zoneamentos"
                      description="Menu Consulta de Zoneamentos"
                    />
                  }
                  containerElement={
                    <Link to="/zones" />
                  }
                  key={Math.random()}
                />,
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.zones_assignment"
                      defaultMessage="Atribuição Estrutura x Zoneamento"
                      description="Menu Atribuição Estrutura x Zoneamento"
                    />
                  }
                  containerElement={
                    <Link to="/zones/assignment" />
                  }
                  key={Math.random()}
                />,
                <Divider key={Math.random()} />,
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.sectors.new"
                      defaultMessage="Nova Setorização"
                      description="Menu Nova Setorização"
                    />
                  }
                  containerElement={
                    <Link to="/sectors/new" />
                  }
                  key={Math.random()}
                />,
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.sectors.search"
                      defaultMessage="Consulta de Setorizações"
                      description="Menu Consulta de Setorizações"
                    />
                  }
                  containerElement={
                    <Link to="/sectors" />
                  }
                  key={Math.random()}
                />,
                <Divider key={Math.random()} />,
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.zones_sectors.related_structures_consult"
                      defaultMessage="Consulta de Estruturas Relacionadas"
                      description="Menu Consulta de Estruturas Relacionadas"
                    />
                  }
                  containerElement={
                    <Link to="zones/related-structures-consult" />
                  }
                  key={Math.random()}
                />,
                <Divider key={Math.random()} />,
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.zones_sectors.bulk_geo_structure"
                      defaultMessage="Cadastro de Estrutura Geográfica"
                      description="Menu - Cadastro de Estrutura Geográfica"
                    />
                  }
                  containerElement={
                    <Link to="zones/bulk-geo-structure" />
                  }
                  key={Math.random()}
                />
              ]}
            />
          </Menu>
        </ToolbarGroup>
        <ToolbarGroup>
          <Menu desktop={true} autoWidth={false}>
            <MenuItem
              rightIcon={
                <ArrowDropDown />
              }
              primaryText={
                <FormattedMessage
                  id="navigation.structure_movements"
                  defaultMessage="Movimentações de Estruturas"
                  description="Menu Movimentações de Estruturas"
                />
              }
              key={Math.random()}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              menuItems={[
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.structure_movements.new"
                      defaultMessage="Agendamento de Movimentação"
                      description="Menu Agendamento de Movimentação"
                    />
                  }
                  containerElement={
                    <Link to="/structure-movements/new" />
                  }
                  key={Math.random()}
                />,
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.structure_movements.search"
                      defaultMessage="Consulta de Agendamentos"
                      description="Menu Consulta de Agendamentos"
                    />
                  }
                  containerElement={
                    <Link to="/structure-movements/search" />
                  }
                  key={Math.random()}
                />,
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="navigation.structure_movements.parameters"
                      defaultMessage="Parametrização de Movimentação"
                      description="Menu Parametrização de Movimentação"
                    />
                  }
                  containerElement={
                    <Link to="/structure-movements/parameters" />
                  }
                  key={Math.random()}
                />,
                <MenuItem
                  primaryText={
                    <FormattedMessage
                      id="structure.movements.history"
                      defaultMessage="Histórico de Movimentação"
                      description="Rótulo do título - Histórico de Movimentação"
                    />
                  }
                  containerElement={
                    <Link to="/structure-movements/history" />
                  }
                  key={Math.random()}
                />
              ]}
            />
          </Menu>
        </ToolbarGroup>
        <ToolbarGroup>
          <Menu desktop={true} autoWidth={false}>
            <MenuItem
              containerElement={<Link to="/reports" />}
              primaryText={<FormattedMessage
                id="navigation.reports"
                defaultMessage="Relatórios"
                description="Menu Relatórios"
              />}
              key={Math.random()}
            />
          </Menu>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

TopNavigation.propTypes = {
  router: PropTypes.object,
  activeMenus: PropTypes.array.isRequired,
};

export default withRouter(TopNavigation);
