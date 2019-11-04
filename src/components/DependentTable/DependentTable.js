import React, { Component } from 'react';
import MaterialTable from 'material-table';

import {auth, firestore} from '../../firebase';

// Dependents Controller for Material-Table Component
class DependentTable extends Component {
    constructor(props){
        super(props)

        this.ref = firestore.collection(`users/${auth.currentUser.uid}/Employees/${this.props.employeeUid}/Dependents`);
        this.state = {
            columns: [
              { title: 'First Name', field: 'firstName' },
              { title: 'Last Name', field: 'lastName' },
              { title: 'Cost', field: 'cost', type: 'numeric', editable: 'never'},
            ],
            data: []
        }
    }
    // Initialize component with DidMount lifecycle method
    componentDidMount(){
        this.unsubscribe = this.ref
            .onSnapshot(snapshot => { // Initialize database listener
                let data = [];
                snapshot.forEach(doc =>
                    data.push({ ...doc.data(), uid: doc.id }),
                );
                this.setState({
                    data,
                });
            });
    }

    // Create
    createDependent(newDependent){
        const dependentCost = this.isDiscounted(newDependent.firstName, 500)
        newDependent = {
            ...newDependent,
            cost: dependentCost
        }
        this.ref.doc().set(newDependent)
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
        this.props.triggerUpdateCost(this.props.employeeUid);
    }

    // Patch
    patchDependent(dependentData){
        const dependentCost = this.isDiscounted(dependentData.firstName, 500)
        dependentData = {
            ...dependentData,
            cost: dependentCost
        }
        this.ref.doc(dependentData.uid).set(dependentData)
        .then(function() {
            console.log("Document successfully updated!");
        })
        .catch(function(error) {
            console.error("Error updating document: ", error);
        });
        this.props.triggerUpdateCost(this.props.employeeUid);
    }

    // Delete
    deleteDependent(dependentUid){
        this.ref.doc(dependentUid).delete()
        .then(() => {
            console.log("Document Deleted!")
        })
        .catch((error) => {
            console.error("Error removing document")
        })
        this.props.triggerUpdateCost(this.props.employeeUid);
    }
    
    isDiscounted(firstName, cost){
        if(firstName.charAt(0) === 'A'){
            return cost = cost - cost * 0.1
        }
        else 
            return cost
    }

    render() {
        return(
            <MaterialTable 
                icons={this.props.tableIcons}
                title="Dependents"
                columns={this.state.columns}
                data={this.state.data}

                editable={{
                    // Create
                    onRowAdd: (newDependent) =>
                    new Promise((resolve, reject) => {
                    setTimeout(() => {
                            {
                            const data = this.state.data;
                            this.createDependent(newDependent)
                            this.setState({ data }, () => resolve());
                            }
                        resolve()
                    }, 1000)
                    }),
                    // Patch
                    onRowUpdate: (newDependent, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                this.patchDependent(newDependent);
                                
                                resolve()
                            }, 1000)
                        }),
                    // Delete
                    onRowDelete: oldDependent=>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                this.deleteDependent(oldDependent.uid);
     
                                resolve()
                            }, 1000)
                        }),
                }}
                options={{
                    toolbar: true,
                    emptyRowsWhenPaging: false,
                    search: false,
                    padding: "dense",
                    rowStyle: {
                        backgroundColor: '#EEE',
                      }
                }}
            />
        )
    }
}

export default DependentTable;