import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import moment from "moment/moment";
import ExcelJS from "exceljs/dist/exceljs";
import FileSaver from "file-saver";
// CUSTOM COMPONENTS
import withHandlers from 'Components/HighOrderComponents/withHandlers';
import withMessages from 'Components/HighOrderComponents/withMessages';
import PeopleNonContemplatedReportView from './views/PeopleNonContemplatedReport';
// ACTIONS
import * as peopleNonContemplatedReportActions from './actions/peopleNonContemplatedReportActions';

const messages = defineMessages({
  processDate: {
    id: "common.process_date",
    defaultMessage: "Data de Processamento",
    description: "Rótulo comum - Data de Processamento"
  },
  personCode: {
    id: "common.cn_code",
    defaultMessage: "Código da CN",
    description: "Cabeçalho da coluna - Código da CN"
  },
  name: {
    id: "common.cn_name",
    defaultMessage: "Nome da CN",
    description: "Cabeçalho comum - Nome da CN"
  },
  zipCode: {
    id: "common.zipcode",
    defaultMessage: "CEP",
    description: "Rótulo comum - CEP"
  },
  structureLevelName: {
    id: "common.structure_type",
    defaultMessage: "Tipo de Estrutura",
    description: "Rótulo comum - Tipo de Estrutura"
  },
  structureCode: {
    id: "common.structure_code",
    defaultMessage: "Código da Estrutura",
    description: "Rótulo comum - Código da Estrutura"
  },
  structureName: {
    id: "common.structure_name",
    defaultMessage: "Nome da Estrutura",
    description: "Rótulo comum - Nome da Estrutura"
  },
  parentStructureLevelName: {
    id: "common.parent_structure_level_name",
    defaultMessage: "Tipo de estrutura superior",
    description: "Rótulo comum - Tipo de estrutura superior"
  },
  parentStructureCode: {
    id: "common.parent_structure_code",
    defaultMessage: "Código da estrutura superior",
    description: "Rótulo comum - Código da estrutura superior"
  },
  parentStructureName: {
    id: "common.parent_structure",
    defaultMessage: "Estrutura Superior",
    description: "Rótulo comum - Estrutura Superior"
  },
  worksheetTitle: {
    id: "menu.people_non_contemplated_report",
    defaultMessage: "Pessoas Não Contempladas",
    description: "Rótulo de menu - Pessoas Não Contempladas"
  },
});

class PeopleNonContemplatedReport extends Component {

  handleFormatDate = (date) => {
    const { intl } = this.props;
    return intl.formatDate(moment(date).toDate(), {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  handlerExportExcel = () => {
    const { peopleNonContemplatedReport: { lists }, intl } = this.props;

    const exportPeopleNonContemplated = lists.peopleNonContemplated.map(item => {
      return {
        processDate: this.handleFormatDate(item.processDate),
        personCode: item.personCode,
        name: item.name,
        zipCode: item.zipCode,
        structureLevelName: item.structureLevelName,
        structureCode: item.structureCode,
        structureName: item.structureName,
        parentStructureLevelName: item.parentStructureLevelName,
        parentStructureCode: item.parentStructureCode,
        parentStructureName: item.parentStructureName,
      };
    });

    let workbook = new ExcelJS.Workbook();

    workbook.creator = 'Natura';
    workbook.created = new Date();

    let worksheet = workbook.addWorksheet(intl.formatMessage(messages['worksheetTitle']));

    worksheet.columns = [
      {
        header: intl.formatMessage(messages['processDate']),
        key: 'processDate',
        width: 25
      },
      {
        header: intl.formatMessage(messages['personCode']),
        key: 'personCode',
        width: 20
      },
      {
        header: intl.formatMessage(messages['name']),
        key: 'name',
        width: 40
      },
      {
        header: intl.formatMessage(messages['zipCode']),
        key: 'zipCode',
        width: 20
      },
      {
        header: intl.formatMessage(messages['structureLevelName']),
        key: 'structureLevelName',
        width: 30
      },
      {
        header: intl.formatMessage(messages['structureCode']),
        key: 'structureCode',
        width: 30
      },
      {
        header: intl.formatMessage(messages['structureName']),
        key: 'structureName',
        width: 20
      },
      {
        header: intl.formatMessage(messages['parentStructureLevelName']),
        key: 'parentStructureLevelName',
        width: 30
      },
      {
        header: intl.formatMessage(messages['parentStructureCode']),
        key: 'parentStructureCode',
        width: 30
      },
      {
        header: intl.formatMessage(messages['parentStructureName']),
        key: 'parentStructureName',
        width: 40
      },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    exportPeopleNonContemplated.forEach((element, index) => {
      worksheet.getRow(index + 2).values = Object.values(element);
      worksheet.getRow(index + 2).alignment = { vertical: 'middle', horizontal: 'center' };
    });

    workbook.xlsx.writeBuffer()
      .then(buffer => {
        FileSaver.saveAs(
          new Blob([buffer], { type: 'application/octet-stream' }),
          'pessoas-nao-contempladas.xlsx'
        );
      })
      .catch(error => {
        throw error;
      });
  };

  handleExport = () => {
    const { actions } = this.props;
    actions.getPeopleNonContemplated()
      .then(() => this.handlerExportExcel());
  };

  get handlers() {
    return {
      ...this.props.handlers,
      exportExcel: this.handleExport,
    };
  }
  render() {
    const { peopleNonContemplatedReport: { lists } } = this.props;
    return (
      <PeopleNonContemplatedReportView
        handlers={this.handlers}
        lists={lists}
      />
    );
  }
}

PeopleNonContemplatedReport.propTypes = {
  intl: intlShape,
  actions: PropTypes.object.isRequired,
  handlers: PropTypes.object.isRequired,
  peopleNonContemplatedReport: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    peopleNonContemplatedReport: state.peopleNonContemplatedReport
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...peopleNonContemplatedReportActions }, dispatch)
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withMessages,
  withHandlers,
  injectIntl,
)(PeopleNonContemplatedReport);
