import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
// MATERIAL UI COMPONENTS
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { FormattedMessage } from "react-intl";
// CUSTOM
import CardTemplate from 'Components/common/templates/CardTemplate';

const styles = theme => ({
  pageTitle: {
    padding: '0 0 1.5rem',
  },
  button: {
    marginTop: theme.spacing.unit,
  },
});

const PeopleNonContemplatedReportView = ({ classes, handlers }) => {
  return (
    <React.Fragment>
      <Typography variant="subtitle1" className={classes.pageTitle}>
        <FormattedMessage
          id="page.people_non_contemplated_report"
          defaultMessage="Relatório de Pessoa Não Contemplada"
          description="Título da página - Relatório de Pessoa Não Contemplada"
        />
      </Typography>
      <CardTemplate>
        <Typography>
          <FormattedMessage
            id="people_non_contemplated_report.description"
            defaultMessage="Relatório responsável por conter informações de CN's que não estão
            contempladas dentro de nenhuma faixa de cep de zoneamento."
            description="Descrição da página - Relatório de pessoas não contemplatdas"
          />
        </Typography>
        <Button
          onClick={handlers.exportExcel}
          variant="contained"
          color="primary"
          className={classes.button}
        >
          <FormattedMessage
            id="common.export"
            defaultMessage="Exportar"
            description="Rótulo comum - Exportar"
          />
        </Button>
      </CardTemplate>
    </React.Fragment>
  );
};

PeopleNonContemplatedReportView.propTypes = {
  fields: PropTypes.object,
  handlers: PropTypes.object,
  lists: PropTypes.object,
  classes: PropTypes.object,
};

export default withStyles(styles)(PeopleNonContemplatedReportView);
