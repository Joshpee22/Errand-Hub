class Parcel {
  constructor(id, location, destination, presentLocation, weight, ownerId, receiverPhone, status,
    createdDate, modifiedDate) {
    // Assigning values to properties of the Parcel object
    this.id = id; // Assigning id
    this.location = location; // Assigning location
    this.destination = destination; // Assigning destination
    this.presentLocation = presentLocation; // Assigning presentLocation
    this.weight = weight; // Assigning weight
    this.ownerId = ownerId; // Assigning ownerId
    this.receiverPhone = receiverPhone; // Assigning receiverPhone
    this.status = status; // Assigning status
    this.createdDate = createdDate; // Assigning createdDate
    this.modifiedDate = modifiedDate; // Assigning modifiedDate
  }
}

module.exports = Parcel; // Exporting the Parcel class