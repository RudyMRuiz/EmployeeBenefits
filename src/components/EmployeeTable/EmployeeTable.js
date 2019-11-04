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

// Employee controller for Material-Table Component
class EmployeeTable extends Component {
    constructor(props) {
        super(props);

        //this.totalCost = 0;
        this.unsub = null;
        this.ref = firestore.collection(`users/${auth.currentUser.uid}/Employees/`);
        this.state = {
            columns: [
                { title: 'First Name', field: 'firstName' },
                { title: 'Last Name', field: 'lastName' },
                { title: 'Total Cost', field: 'totalCost', type: 'numeric', editable: 'never'},
            ],
            data: [],
            totalCost: 0
        }
        
        //As of ES6+ React no longer autobinds methods
        this.createEmployee = this.createEmployee.bind(this);
        this.updateTotalCost = this.updateTotalCost.bind(this);
    }

    // Initialize component with DidMount lifecycle method
    componentDidMount(){
        this.unsubscribe = this.ref
            .onSnapshot(snapshot => {
                let data = [];
                snapshot.forEach(doc =>
                    data.push({ ...doc.data(), uid: doc.id }),
                );
                this.setState({
                    data
                });
            });
    }
    
    // Create
    createEmployee(newEmployee){
        const upperCaseFirstName = this.capitilizeName(newEmployee.firstName);
        const upperCaseLastName = this.capitilizeName(newEmployee.lastName);
        const employeeCost = this.isDiscounted(upperCaseFirstName, 1000)
        newEmployee = {
            ...newEmployee,
            firstName: upperCaseFirstName,
            lastName: upperCaseLastName,
            cost: employeeCost,
            totalCost: employeeCost
        }
        this.ref.doc().set(newEmployee)
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
        this.updateTotalCost(newEmployee.uid)
    }

    capitilizeName(name){
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    // Delete
    deleteEmployee(oldEmployeeUid){
        this.ref.doc(oldEmployeeUid).delete()
        .then(() => {
            console.log("Document Deleted!")
        })
        .catch((error) => {
            console.error("Error removing document")
        })
    }

    // Patch
    patchEmployee(newEmployee){
        const capitilizedFirstName = this.capitilizeName(newEmployee.firstName);
        const capitilizedLastName = this.capitilizeName(newEmployee.lastName);
        const employeeCost = this.isDiscounted(newEmployee.firstName, 1000)
        newEmployee = {
            ...newEmployee,
            firstName: capitilizedFirstName,
            lastName: capitilizedLastName,
            cost: employeeCost
        }
        this.ref.doc(newEmployee.uid).set(newEmployee)
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

    updateTotalCost(employeeUid, cost, op){
        this.ref.doc(employeeUid).collection("Dependents").get()
            .then(dependentSnapshot => {
                let dependentCosts = 0;
                dependentSnapshot.forEach(doc => {
                    dependentCosts += doc.data().cost
                });
                this.setState({totalCost: dependentCosts}, () => {
                    this.ref.get()
                        .then(employeeSnapshot => {
                            let employee = {};
                            let employeeCost = 0;
                            employeeSnapshot.forEach(doc => {
                                if(doc.id === employeeUid){
                                    employeeCost = this.state.totalCost + doc.data().cost;

                                    this.setState({totalCost: employeeCost}, () => {
                                        employee = {firstName: doc.data().firstName, lastName: doc.data().lastName, cost: doc.data().cost};
                                        this.ref.doc(employeeUid).set({...employee, totalCost: this.state.totalCost});
                                        this.updateMonthlyCost();
                                    });
                                }
                            })
                        })
                })
            })
    }

    updateMonthlyCost(){

    }

    render() {
        return (
            <MaterialTable
            icons={tableIcons}
            title="Employees"
            columns={this.state.columns}
            data={this.state.data}
            
            onRowClick={(event, rowData, togglePanel) => togglePanel()}
            detailPanel={rowData => {
                return (
                <DependentTable tableIcons={tableIcons} employeeUid={rowData.uid} triggerUpdateCost={this.updateTotalCost}/>
                )
            }}
            editable={{
                // Create
                onRowAdd: (newEmployee) =>
                    new Promise((resolve, reject) => {
                    setTimeout(() => {
                        {
                        const data = this.state.data;
                        this.createEmployee(newEmployee)
                        this.setState({ data }, () => resolve());
                        }
                        resolve()
                    }, 1000)
                }),
                // Patch
                onRowUpdate: (newEmployee, oldData) =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            this.patchEmployee(newEmployee);

                            resolve()
                        }, 1000)
                    }),
                // Delete
                onRowDelete: oldEmployee =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            this.deleteEmployee(oldEmployee.uid);

                            resolve()
                        }, 1000)
                    }),
            }}
            />
        )
    }
}

export default EmployeeTable;