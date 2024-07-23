let server = 'monpark-game-production.up.railway.app'

self.addEventListener('message', async (event) => {

    if (event.data && event.data.server) {
        server = event.data.server
    }
    if (event.data) {
        const data = event.data;
        try {
            const response = await fetch(server + '/api', {
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
    }


});
