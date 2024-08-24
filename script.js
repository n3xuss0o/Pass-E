// Remplace ces valeurs par celles de ton compte Airtable
const AIRTABLE_API_TOKEN = 'pat5Et4rPwGKQJXJR.c7d610ed44136b4e9a7c90721742c5ea4bed8b8059f8232db90438a6bff75695';  // Utilise le jeton d'authentification
const AIRTABLE_BASE_ID = 'app9wEysyeQ4sgOXY'; // Remplace par l'ID de ta base Airtable
const AIRTABLE_TABLE_NAME = 'Table 1'; // Assure-toi que ce nom correspond au nom de la table dans Airtable

const apiUrl = `https://api.airtable.com/v0/${'app9wEysyeQ4sgOXY'}/${'Table 1'}`;
const headers = {
    Authorization: `Bearer ${'pat5Et4rPwGKQJXJR.c7d610ed44136b4e9a7c90721742c5ea4bed8b8059f8232db90438a6bff75695'}`,  // Utilise le jeton dans l'en-tête Authorization
    'Content-Type': 'application/json',
};

function onScanSuccess(decodedText, decodedResult) {
    console.log('QR Code scanned:', decodedText); // Voir la valeur scannée
    scanQRCode(decodedText);
}

// Fonction pour vérifier le QR code dans Airtable
function scanQRCode(token) {
    console.log('Searching for token:', token); // Log le token recherché pour débogage

    // Appel API pour vérifier si le QR code existe
    fetch(apiUrl + `?filterByFormula={Token}="${token}"`, { headers })
        .then(response => response.json())
        .then(data => {
            console.log('Airtable response:', data); // Log la réponse d’Airtable pour débogage
            const resultElement = document.getElementById('result');
            
            if (!data.records || !Array.isArray(data.records)) {
                resultElement.textContent = 'Error: Invalid response from server';
                resultElement.className = 'error';
                console.error('Invalid response structure:', data);
                return;
            }
            
            if (data.records.length === 0) {
                resultElement.textContent = 'QR code is not valid';
                resultElement.className = 'error';
            } else {
                const record = data.records[0];
                if (record.fields.Status === 'Used') {
                    resultElement.textContent = 'QR code is not valid'; // QR code exists but already used
                    resultElement.className = 'error';
                } else {
                    // Mettre à jour le statut du QR code à "Used"
                    fetch(`${apiUrl}/${record.id}`, {
                        method: 'PATCH',
                        headers: headers,
                        body: JSON.stringify({
                            fields: { Status: 'Used' },
                        }),
                    })
                    .then(() => {
                        resultElement.textContent = 'QR code is valid';
                        resultElement.className = 'success';
                    })
                    .catch(error => {
                       resultElement.textContent = 'Error updating QR code status.';
                       resultElement.className = 'error';
                       console.error('Error updating QR code status:', error);
                    });
                }
            }
        })
        .catch(error => {
           resultElement.textContent = 'Error scanning QR code.';
           resultElement.className = 'error'; 
           console.error('Error fetching QR code:', error);
        });
}

// Fonction pour démarrer le scanner de QR code
function startScanner() {
    const html5QrCode = new Html5Qrcode("scanner-container");
    html5QrCode.start(
        { facingMode: "environment" }, // Utiliser la caméra arrière
        {
            fps: 10, // Frames per second
            qrbox: 250 // Taille du box de QR code
        },
        onScanSuccess,
        (errorMessage) => {
            console.log('QR code scan error:', errorMessage);
        }
    ).catch(err => {
        console.error('Error starting the QR code scanner:', err);
    });
}

// Démarrer le scanner lorsque le document est prêt
document.addEventListener('DOMContentLoaded', startScanner);