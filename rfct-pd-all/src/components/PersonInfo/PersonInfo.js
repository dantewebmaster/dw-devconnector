import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
// MATERIAL UI COMPONENTS
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
// ICONS
import PersonOutlineIcon from '@material-ui/icons/PersonOutlined';
// UTILS
import formatDate from 'Utils/formatDate';

const styles = (theme) => ({
  personInfo: {
    marginBottom: theme.spacing.unit * 5,
    minWidth: '300px',
  },
  header: {
    display: 'flex',
    marginBottom: theme.spacing.unit * 3,
    alignItems: 'center',
    '& svg': {
      marginRight: theme.spacing.unit * 2,
      fontSize: '32px',
    },
  },
  item: {
    marginBottom: theme.spacing.unit * 2,
    '& p': {
      textTransform: 'uppercase',
      marginTop: theme.spacing.unit,
    }
  },
  cycle: {
    display: 'flex',
    '& span': {
      marginRight: theme.spacing.unit * 1.3,
    },
  },
});

const PersonInfo = ({ title, personData, classes }) => {
  return (
    <div className={classes.personInfo}>
      {title && <div className={classes.header}>
        <PersonOutlineIcon />
        <Typography variant="button" component="h3">
          <FormattedMessage
            id="common.person_info_title"
            defaultMessage="Informações da Pessoa"
            description="Título do card - Informações da Pessoa"
          />
        </Typography>
      </div>}
      <div className={classes.body}>
        <div className={classes.item}>
          <Typography variant="caption">
            <FormattedMessage
              id="common.person_code"
              defaultMessage="Código da Pessoa"
              description="Rótulo - Código da Pessoa"
            />
          </Typography>
          <Typography variant="body2">{personData.personCode}</Typography>
        </div>
        <div className={classes.item}>
          <Typography variant="caption">
            <FormattedMessage
              id="common.person_name"
              defaultMessage="Nome da Pessoa"
              description="Rótulo - Nome da Pessoa"
            />
          </Typography>
          <Typography variant="body2">{personData.personName}</Typography>
        </div>
        {
          personData.currentCycle &&
          <React.Fragment>
            <div className={classes.item}>
              <Typography variant="caption">
                <FormattedMessage
                  id="common.current_cycle"
                  defaultMessage="Ciclo Vigente"
                  description="Rótulo - Ciclo Vigente"
                />
              </Typography>
              <Typography variant="body2">{personData.currentCycle.cycleCode}</Typography>
            </div>
            <div className={classes.cycle}>
              <span>
                <Typography variant="caption">
                  <FormattedMessage
                    id="common.start_cycle"
                    defaultMessage="Início do Ciclo"
                    description="Rótulo comum - Início do Ciclo"
                  />
                </Typography>
                <Typography variant="body2">
                  {formatDate(personData.currentCycle.dateStart)}
                </Typography>
              </span>
              <span>
                <Typography variant="caption">
                  <FormattedMessage
                    id="common.end_cycle"
                    defaultMessage="Fim do Ciclo"
                    description="Rótulo comum - Fim do Ciclo"
                  />
                </Typography>
                <Typography variant="body2">
                  {formatDate(personData.currentCycle.dateEnd)}
                </Typography>
              </span >
            </div >
          </React.Fragment >}
      </div >
    </div >
  );
};

PersonInfo.propTypes = {
  personData: PropTypes.object.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  classes: PropTypes.object,
};

export default withStyles(styles)(PersonInfo);
