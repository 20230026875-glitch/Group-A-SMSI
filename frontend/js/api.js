// WALA NA DIRY ANG API_BASE_URL KAY NAA NA SA CONFIG.JS

// 1. Verify Access Code
async function verifyAccessCode(code) {
    const response = await fetch(`${API_BASE_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    });
    return await response.json();
}

// 2. Fetch Tickets (Para sa Tickets Log ug Management)
async function fetchTickets() {
    try {
        const response = await fetch(`${API_BASE_URL}/tickets`);
        return await response.json();
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

// 3. Submit Response (Para sa Response Panel)
async function submitResponse(ticketId, message) {
    try {
        const response = await fetch(`${API_BASE_URL}/responses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticketId, message })
        });
        return await response.json();
    } catch (error) {
        console.error("Error submitting response:", error);
    }
}
