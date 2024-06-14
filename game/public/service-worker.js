self.addEventListener('message', async (event) => {
    const data = event.data;

    try {
        const response = await fetch('monpark-game-production.up.railway.app/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log('Data saved to server');
        } else {
            console.error('Failed to save data to server');
        }
    } catch (error) {
        console.error('Error saving data to server:', error);
    }
});
