import React, { Component } from 'react';
import MaterialTable from 'material-table';

import {auth, firestore} from '../../firebase';

class DependentTable extends Component {
    constructor(props){
        super(props)

        this.ref = firestore.collection(`users/${auth.currentUser.uid}/Employees/${this.props.DependentUid}/Dependents`);
        this.state = {

        }
    }
    render() {
        console.log("DEPENDENT TABLE " + this.props.DependentUid)
        return(
            <MaterialTable 
                icons={this.props.TableIcons}
                title="Dependents"
            />
        )
    }
}

export default DependentTable;