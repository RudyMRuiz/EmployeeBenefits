# Employee Benefits Web App

The Employee Benefits app is a cloud-enabled, mobile-ready, ReactJS powered web app.

# Challenge

Create an application that calculates the cost of benefits for each employee and their dependents. The cost of benefits for each employee is $1000 and for each of their dependents is $500. A discount is applied if the employee or any of their dependents first name start with the letter 'A'. 

# High Level Structure

ReactJS was chosen as the main framework for the view components of the Employee Benefits webapp due to its flexible javascript library for UI's. The component structure of ReactJS also enables re-usability of many parts of the webapp. I also know that Paylocity is switching over to React ;)

Firebase's Firestore is used for the model component of the Employee Benefits webapp. There was no need for a relational database such as mySQL since Employees simply have dependents and Employees dont tie together with other Employees. I have prior experience using Firebase and really enjoyed their easy API calls to the model. This also allowed the cloud-enabled functionality part of the web app. 