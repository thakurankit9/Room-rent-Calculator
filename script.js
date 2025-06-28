// script.js

const calculatorForm = document.getElementById('calculator-form');
const calculateBtn = document.getElementById('calculate-btn');
const billDetails = document.getElementById('bill-details');
const shareBtn = document.getElementById('share-btn');
const emailForm = document.getElementById('email-form');
const sendEmailBtn = document.getElementById('send-email-btn');

calculateBtn.addEventListener('click', calculateBill);
shareBtn.addEventListener('click', shareBill);
sendEmailBtn.addEventListener('click', sendEmail);

function calculateBill(e) {
    e.preventDefault();
    const month = document.getElementById('month').value;
    const monthRent = parseFloat(document.getElementById('month-rent').value);
    const firstMeterReading = parseFloat(document.getElementById('first-meter-reading').value);
    const secondMeterReading = parseFloat(document.getElementById('second-meter-reading').value);
    const perUnitPrice = parseFloat(document.getElementById('per-unit-price').value);

    const totalUnits = secondMeterReading - firstMeterReading;
    const electricBill = totalUnits * perUnitPrice;
    const totalBill = monthRent + electricBill;

    document.getElementById('total-units').innerText = `Total Units: ${totalUnits}`;
    document.getElementById('electric-bill').innerText = `Electric Bill: ${electricBill}`;
    document.getElementById('total-month-rent').innerText = `Month Rent: ${monthRent}`;
    document.getElementById('total-bill').innerText = `Total Bill: ${totalBill}`;
    document.getElementById('month-summary').innerText = month;
    document.getElementById('month-rent-summary').innerText = monthRent;
    document.getElementById('total-units-summary').innerText = totalUnits;
    document.getElementById('electric-bill-summary').innerText = electricBill;
    document.getElementById('total-bill-summary').innerText = totalBill;

    billDetails.style.display = 'block';
}

function shareBill() {
    emailForm.style.display = 'block';
}

function sendEmail() {
    const email = document.getElementById('email').value;
    const month = document.getElementById('month').value;
    const monthRent = document.getElementById('month-rent-summary').innerText;
    const totalUnits = document.getElementById('total-units-summary').innerText;
    const electricBill = document.getElementById('electric-bill-summary').innerText;
    const totalBill = document.getElementById('total-bill-summary').innerText;

    const subject = `Bill for ${month}`;
    const body = `Dear,\n\nYour bill for ${month} is as follows:\n\nMonth Rent: ${monthRent}\nTotal Units: ${totalUnits}\nElectric Bill: ${electricBill}\nTotal Bill: ${totalBill}\n\nBest regards,`;

    const mailto = `mailto:${email}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
}