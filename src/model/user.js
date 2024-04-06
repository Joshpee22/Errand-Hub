class User {
  constructor(id, email, username, firstName, lastName, userRole, password,
    createdDate, modifiedDate) {
    // Assigning values to properties of the User object
    this.id = id; // Assigning id
    this.email = email; // Assigning email
    this.username = username; // Assigning username
    this.firstName = firstName; // Assigning firstName
    this.lastName = lastName; // Assigning lastName
    this.userRole = userRole; // Assigning userRole
    this.password = password; // Assigning password
    this.createdDate = createdDate; // Assigning createdDate
    this.modifiedDate = modifiedDate; // Assigning modifiedDate
  }
}

module.exports = User; // Exporting the User class