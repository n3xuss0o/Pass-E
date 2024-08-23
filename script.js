// Remplace ces valeurs par celles de ton compte Airtable
const AIRTABLE_API_TOKEN = 'pat5Et4rPwGKQJXJR.c7d610ed44136b4e9a7c90721742c5ea4bed8b8059f8232db90438a6bff75695';  // Utilise le jeton d'authentification
const AIRTABLE_BASE_ID = 'app9wEysyeQ4sgOXY'; // Remplace par l'ID de ta base Airtable
const AIRTABLE_TABLE_NAME = 'Table 1'; // Assure-toi que ce nom correspond au nom de la table dans Airtable

const apiUrl = `https://api.airtable.com/v0/${'app9wEysyeQ4sgOXY'}/${'Table 1'}`;
const headers = {
    Authorization: `Bearer ${'pat5Et4rPwGKQJXJR.c7d610ed44136b4e9a7c90721742c5ea4bed8b8059f8232db90438a6bff75695'}`,  // Utilise le jeton dans l'en-tête Authorization
    'Content-Type': 'application/json',
};

// Fonction appelée lorsque le QR code est scanné avec succès
function onScanSuccess(decodedText, decodedResult) {
    console.log('QR Code scanned:', decodedText); // Log le texte décodé pour débogage
    document.getElementById('token').value = decodedText;
    scanQRCode(decodedText);
}

// Fonction pour vérifier le QR code dans Airtable et mettre à jour son statut
function scanQRCode(token) {
    console.log('Searching for token:', token); // Log le token recherché pour débogage

    // Appel API pour vérifier si le QR code existe et obtenir son statut
    fetch(apiUrl + `?filterByFormula={Token}="${token}"`, { headers })
        .then(response => response.json())
        .then(data => {
            console.log('Airtable response:', data); // Log la réponse d’Airtable pour débogage
            if (data.records.length === 0) {
                document.getElementById('result').textContent = 'QR code not found';
            } else {
                const record = data.records[0];
                if (record.fields.Status === 'Used') {
                    document.getElementById('result').textContent = 'QR code already used';
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
                        document.getElementById('result').textContent = 'QR code is valid and has been used';
                    })
                    .catch(error => {
                        document.getElementById('result').textContent = 'Error updating QR code status.';
                        console.error('Error updating QR code status:', error);
                    });
                }
            }
        })
        .catch(error => {
            document.getElementById('result').textContent = 'Error scanning QR code.';
            console.error('Error fetching QR code:', error);
        });
}

// Fonction pour démarrer le scanner de QR code
function startScanner() {
    const html5QrCode = new Html5QrCode("scanner-container");
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