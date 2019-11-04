import React, { Component } from 'react';
import { forwardRef } from 'react';

import MaterialTable from 'material-table';
import DependentTable from '../DependentTable';
import {firestore, auth} from '../../firebase';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };

  class EmployeeTable extends Component {
    constructor(props) {
      super(props);

      this.unsub = null;
      this.ref = firestore.collection(`users/${auth.currentUser.uid}/Employees/`);
      this.state = {
        columns: [
          { title: 'First Name', field: 'firstName' },
          { title: 'Last Name', field: 'lastName' },
          { title: 'Cost', field: 'cost', type: 'numeric', editable: 'never'},
        ],
        data: []
      }

      this.addEmployee = this.addEmployee.bind(this);
    }

    componentDidMount(){
        this.unsubscribe = this.ref
            .onSnapshot(snapshot => {
                let data = [];
                snapshot.forEach(doc =>
                    data.push({ ...doc.data(), uid: doc.id }),
                );
                this.setState({
                    data,
                });
            });
    }
    
    addEmployee(newData){
        const employeeCost = this.isDiscounted(newData.firstName, 1000)
        newData = {
            ...newData,
            cost: employeeCost
        }
        this.ref.doc().set(newData)
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    }

    removeEmployee(uid){
        this.ref.doc(uid).delete()
        .then(() => {
            console.log("Document Deleted!")
        })
        .catch((error) => {
            console.error("Error removing document")
        })
    }

    updateEmployee(newData){
        const employeeCost = this.isDiscounted(newData.firstName, 1000)
        newData = {
            ...newData,
            cost: employeeCost
        }
        this.ref.doc(newData.uid).set(newData)
        .then(function() {
            console.log("Document successfully updated!");
        })
        .catch(function(error) {
            console.error("Error updating document: ", error);
        });
    }

    isDiscounted(firstName, cost) {
        if(firstName.charAt(0) === 'A'){
            return cost = cost - cost * 0.1
        }
        else 
            return cost
    }
  
    handleDependentClick(uid){
        this.unsubscribe = this.ref.doc(uid).collection("Dependents")
            .onSnapshot(snapshot => {
                let data = [];
                snapshot.forEach(doc =>
                    data.push({ ...doc.data(), uid: doc.id }),
                );
                this.setState({
                    data,
                });
            });
    }

    render() {
      return (
        console.log(),
        <MaterialTable
          icons={tableIcons}
          title="Employees"
          columns={this.state.columns}
          data={this.state.data}
          actions={[
            {
              icon: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
              tooltip: 'Dependents',
              //onClick: (event, rowData) => alert("You clicked " + this.ref.doc(rowData.uid))
              onClick: (event, rowData) => this.handleDependentClick(rowData.uid)
            },
          ]}
          onRowClick={(event, rowData, togglePanel) => togglePanel()}
          detailPanel={rowData => {
            return (
              <DependentTable TableIcons={tableIcons} DependentUid={rowData.uid}/>
            )
          }}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    const data = this.state.data;
                    //data.push(newData);
                    this.addEmployee(newData)
                    this.setState({ data }, () => resolve());
                  }
                  resolve()
                }, 1000)
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    const data = this.state.data;
                    const index = data.indexOf(oldData);
                    //console.log("NEWDATA " + this.ref.doc().collection('Dependents') + newData.uid)
                    this.updateEmployee(newData);
                    //data[index] = newData;
                    //this.setState({ data }, () => resolve());
                  }
                  resolve()
                }, 1000)
              }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  {
                    let data = this.state.data;
                    const index = data.indexOf(oldData);
                    this.removeEmployee(oldData.uid);
                    //data.splice(index, 1);
                    //this.setState({ data }, () => resolve());
                  }
                  resolve()
                }, 1000)
              }),
          }}
        />
      )
    }
  }

  export default EmployeeTable;