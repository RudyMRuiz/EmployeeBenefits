import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import EmptyState from '../EmptyState';
import EmployeeTable from '../EmployeeTable/EmployeeTable';

const styles = (theme) => ({
  emptyStateIcon: {
    fontSize: theme.spacing(12)
  },

  button: {
    marginTop: theme.spacing(1)
  },

  buttonIcon: {
    marginRight: theme.spacing(1)
  }
});

class HomeContent extends Component {
  render() {

    // Properties
    const { signedIn } = this.props;

    // If Signed In, load EmployeeTable Component
    if (signedIn) {
      return (
        <EmployeeTable />
      );
    }

    return (
      <EmptyState
        title={process.env.REACT_APP_NAME}
        description="Please Sign Up or Log In to access the application"
        
      />
    );
  }
}

HomeContent.defaultProps = {
  signedIn: false
};

HomeContent.propTypes = {
  // Styling
  classes: PropTypes.object.isRequired,

  // Properties
  signedIn: PropTypes.bool.isRequired
};

export default withStyles(styles)(HomeContent);
