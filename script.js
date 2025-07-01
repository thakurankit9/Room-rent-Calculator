// script.js

const calculatorForm = document.getElementById('calculator-form');
const calculateBtn = document.getElementById('calculate-btn');
const billDetails = document.getElementById('bill-details');
const downloadImageBtn = document.getElementById('download-image-btn'); // New button
const shareBtnEmail = document.getElementById('share-btn-email');
const shareBtnWhatsapp = document.getElementById('share-btn-whatsapp');
const shareBtnTelegram = document.getElementById('share-btn-telegram');
const emailForm = document.getElementById('email-form');
const sendEmailBtn = document.getElementById('send-email-btn');
const billHistory = document.getElementById('bill-history');
const billList = document.getElementById('bill-list');

// Array to store all calculated bills
let bills = [];

// Event Listeners
calculateBtn.addEventListener('click', calculateBill);
downloadImageBtn.addEventListener('click', generateAndDownloadBillImage); // New event listener
shareBtnEmail.addEventListener('click', () => {
    alert('To share the bill as an image via Email:\n\n1. Click "Download Bill Image" button.\n2. Save the image to your device.\n3. Open your email client and manually attach the downloaded image.\n\n(You can use the "Get Email Instructions" button below to pre-fill an email subject/body with general instructions if needed.)');
    emailForm.style.display = 'block'; // Show email form for manual instructions
});
shareBtnWhatsapp.addEventListener('click', () => {
    alert('To share the bill as an image via WhatsApp:\n\n1. Click "Download Bill Image" button.\n2. Save the image to your device.\n3. Open WhatsApp and manually share the downloaded image from your gallery.');
});
shareBtnTelegram.addEventListener('click', () => {
    alert('To share the bill as an image via Telegram:\n\n1. Click "Download Bill Image" button.\n2. Save the image to your device.\n3. Open Telegram and manually share the downloaded image from your gallery.');
});
sendEmailBtn.addEventListener('click', sendEmailInstructions); // Changed function name

function calculateBill(e) {
    e.preventDefault();

    const month = document.getElementById('month').value;
    const monthRent = parseFloat(document.getElementById('month-rent').value);
    const firstMeterReading = parseFloat(document.getElementById('first-meter-reading').value);
    const secondMeterReading = parseFloat(document.getElementById('second-meter-reading').value);
    const perUnitPrice = parseFloat(document.getElementById('per-unit-price').value);

    // Input validation
    if (isNaN(monthRent) || isNaN(firstMeterReading) || isNaN(secondMeterReading) || isNaN(perUnitPrice)) {
        alert('Please enter valid numbers for all fields.');
        return;
    }
    if (secondMeterReading < firstMeterReading) {
        alert('Second meter reading cannot be less than the first meter reading.');
        return;
    }
    if (monthRent < 0 || firstMeterReading < 0 || secondMeterReading < 0 || perUnitPrice < 0) {
        alert('All values must be non-negative.');
        return;
    }

    const totalUnits = secondMeterReading - firstMeterReading;
    const electricBill = totalUnits * perUnitPrice;
    const totalBill = monthRent + electricBill;

    // Store the current bill details
    const currentBill = {
        month: month,
        monthRent: monthRent,
        firstMeterReading: firstMeterReading,
        secondMeterReading: secondMeterReading,
        perUnitPrice: perUnitPrice,
        totalUnits: totalUnits,
        electricBill: electricBill,
        totalBill: totalBill
    };
    bills.push(currentBill); // Add the new bill to the array

    // Display current month's bill details
    document.getElementById('total-units').innerText = `Total Units: ${totalUnits}`;
    document.getElementById('electric-bill').innerText = `Electric Bill: ${electricBill}`;
    document.getElementById('total-month-rent').innerText = `Month Rent: ${monthRent}`;
    document.getElementById('total-bill').innerText = `Total Bill: ${totalBill}`;

    billDetails.style.display = 'block';
    renderBillHistory(); // Update the bill history display
}

function renderBillHistory() {
    // Clear previous history
    billList.innerHTML = '';

    if (bills.length === 0) {
        billHistory.style.display = 'none';
        return;
    }

    // Display newest bill first
    const sortedBills = [...bills].reverse();

    sortedBills.forEach((bill) => {
        const listItem = document.createElement('li');
        listItem.classList.add('bill-item');
        listItem.innerHTML = `
            <h3>Bill Summary for ${bill.month}</h3>
            <p>Month Rent: <strong>${bill.monthRent}</strong></p>
            <p>Total Units: <strong>${bill.totalUnits}</strong></p>
            <p>Electric Bill: <strong>${bill.electricBill}</strong></p>
            <p>Total Bill: <strong>${bill.totalBill}</strong></p>
        `;
        billList.appendChild(listItem);
    });

    billHistory.style.display = 'block';
}

function generateAndDownloadBillImage() {
    if (bills.length === 0) {
        alert('Please calculate a bill first to generate an image.');
        return;
    }

    // Target the specific section you want to capture as an image
    const elementToCapture = document.getElementById('bill-details');

    // Use html2canvas to render the div as a canvas
    html2canvas(elementToCapture, {
        scale: 2, // Increase scale for better resolution
        logging: false, // Disable logging for cleaner console
        useCORS: true // Required if you have external resources (like fonts)
    }).then(canvas => {
        // Convert canvas to image data URL
        const imgData = canvas.toDataURL('image/png');

        // Create a temporary link element
        const a = document.createElement('a');
        a.href = imgData;
        
        // Get the month from the last calculated bill for the file name
        const lastBill = bills[bills.length - 1];
        const monthName = lastBill ? lastBill.month : 'Bill';
        a.download = `Room_Rent_Bill_${monthName}.png`; // Suggest a file name

        // Programmatically click the link to trigger the download
        document.body.appendChild(a); // Append to body is good practice for programmatic clicks
        a.click();
        document.body.removeChild(a); // Clean up the temporary link

        alert('Bill image downloaded! You can now attach this image to your email or share it via messaging apps.');
    }).catch(error => {
        console.error('Error generating bill image:', error);
        alert('Failed to generate bill image. Please try again.');
    });
}

function sendEmailInstructions() {
    const email = document.getElementById('email').value;
    const lastBill = bills[bills.length - 1]; // Get the last calculated bill

    if (!lastBill) {
        alert('No bill available to provide instructions for.');
        return;
    }

    const subject = `Your Room Rent Bill for ${lastBill.month} (Image Attached Separately)`;
    const body = `Dear recipient,\n\nPlease find your room rent bill for ${lastBill.month} attached as an image. If you don't see the image, please check your downloads or attach it manually.\n\n--- Bill Details (for reference) ---\nMonth Rent: ${lastBill.monthRent}\nTotal Units: ${lastBill.totalUnits}\nElectric Bill: ${lastBill.electricBill}\nTotal Bill: ${lastBill.totalBill}\n-----------------------------------\n\nBest regards,`;

    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    emailForm.style.display = 'none'; // Hide email form after opening mail client
}
