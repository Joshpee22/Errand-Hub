function trackPackage() {
    const trackingNumber = document.getElementById('trackingNumber').value;
    const resultElement = document.getElementById('trackingResult');

    // Simulate fetching tracking information from a server/database.
    // In a real application, this would involve AJAX or fetch requests.
    setTimeout(() => {
        resultElement.textContent = `Tracking information for ${trackingNumber}: Delivered`;
    }, 2000); // Simulate delay for loading information
}

document.getElementById('shipmentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const senderName = document.getElementById('senderName').value;
    const receiverName = document.getElementById('receiverName').value;
    const shipmentDetails = document.getElementById('shipmentDetails').value;

    // Here you would implement logic to send shipment details to the server.
    // This could involve AJAX or fetch requests to a backend API.
    console.log('Shipment booked:', { senderName, receiverName, shipmentDetails });
});

// Add this to your existing JavaScript file
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    if (chatInput.value.trim() !== '') {
        const message = document.createElement('div');
        message.className = 'message';
        message.textContent = `You: ${chatInput.value}`;
        chatMessages.appendChild(message);

        // In a real application, you would handle sending the message to a server.
        // For simplicity, we're just displaying it on the page here.

        chatInput.value = ''; // Clear the input field after sending the message
    }
}
