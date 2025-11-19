const gstInput = document.getElementById("gstInput");
const serviceFeeInput = document.getElementById("serviceFeeInput");
const salvageInput = document.getElementById("salvageInput");
const totalgstInput = document.getElementById("totalgstInput");
const invoiceInput = document.getElementById("invoiceInput");
const invoiceNumberHeader = document.getElementById("invoiceNumberHeader");
const saleRate = document.getElementById("saleRate");
const saleQty = document.getElementById("saleQty");
const saleAmount = document.getElementById("saleAmount");
const exemptRate = document.getElementById("exemptRate");
const exemptQty = document.getElementById("exemptQty");
const exemptAmount = document.getElementById("exemptAmount");
const feeRate = document.getElementById("feeRate");
const feeQty = document.getElementById("feeQty");
const feeAmount = document.getElementById("feeAmount");
const subtotal = document.getElementById("subtotal");
const gstRate = document.getElementById("gstRate");
const gstRate2 = document.getElementById("gstRate2");
const gstAmount = document.getElementById("gstAmount");
const total = document.getElementById("total");
const balanceDue = document.getElementById("balanceDue");
const footerTax = document.getElementById("footerTax");
const footerNet = document.getElementById("footerNet");
const invoiceDateInput = document.getElementById("invoiceDateInput");
const displayDate = document.getElementById("displayDate");         // Get the date display span
const invoiceDate = document.getElementById("invoiceDate"); 
const invoiceDate2 = document.getElementById("invoiceDate2"); 
const invoiceAddress = document.getElementById("invoiceAddress"); 
const clientAddressDropdown = document.getElementById("clientAddressDropdown");
const poInput = document.getElementById("poInput");
const invoicePO = document.getElementById("invoicePO");

// Helper function to format numbers as currency
function formatCurrency(number) {
    // Use toLocaleString for currency formatting with commas and two decimal places
    // 'en-US' locale typically provides the desired format
    // style: 'currency' adds the currency symbol
    // currency: 'USD' specifies the currency type
    return number.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2, // Ensure two decimal places
        maximumFractionDigits: 2  // Ensure two decimal places
    });
}

// Function to format and display the date from the date input
function updateInvoiceDate() {
    let dateValue = invoiceDateInput.value; // Gets the date in YYYY-MM-DD format
    let formattedDate = "";

    if (dateValue) {
        // Parse the YYYY-MM-DD string manually to avoid time zone issues
        const [year, month, day] = dateValue.split('-').map(Number);
        // Create a Date object using local time zone constructor (month is 0-indexed)
        const date = new Date(year, month - 1, day);

        // Format to "Month Day, Year" using toLocaleDateString
        formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long', // 'long' gives the full month name (e.g., "May")
            day: 'numeric'  // 'numeric' gives the day (e.g., "17")
        });
    } else {
        // Fallback or default if no date is selected
        formattedDate = "Date not selected";
    }
   
    // Update the HTML element where you want to display the formatted date
    if (invoiceDate) {
        invoiceDate.textContent = formattedDate;
        invoiceDate2.textContent = formattedDate;
    }
}

function updateTotals() {

    const gst = parseFloat(gstInput.value)/100 || 0;
    const servicefee = parseFloat(serviceFeeInput.value)/100 || 0;
    const salvage = parseFloat(salvageInput.value) || 0;
    const saleRateValue = parseFloat(totalgstInput.value/gst);
    const exemptRateValue = parseFloat(salvage - saleRateValue); 
    const feeRateValue = parseFloat(salvage * servicefee);

    const subtotalValue = saleRateValue + exemptRateValue + feeRateValue;
    const gstAmountValue = (saleRateValue*gst)+(feeRateValue*gst);
    const totalVal = subtotalValue + gstAmountValue;
    
    invoiceNumberHeader.textContent = `INVOICE # ${invoiceInput.value}`|| '';
    saleRate.textContent = formatCurrency(saleRateValue || 0);
    saleAmount.textContent = formatCurrency( (saleRateValue*saleQty.textContent) || 0);
    exemptRate.textContent = formatCurrency(exemptRateValue || 0);
    exemptAmount.textContent = formatCurrency((exemptRateValue*exemptQty.textContent) || 0);
    feeRate.textContent = formatCurrency(feeRateValue || 0);
    feeAmount.textContent = formatCurrency((feeRateValue*feeQty.textContent) || 0);
    subtotal.textContent = formatCurrency(subtotalValue);
    gstRate.textContent = gstInput.value || 0;
    gstRate2.textContent = gstInput.value || 0;
    gstAmount.textContent = formatCurrency(gstAmountValue);
    total.textContent = formatCurrency(totalVal);
    balanceDue.textContent = formatCurrency(totalVal);
    footerTax.textContent = formatCurrency(gstAmountValue);
    footerNet.textContent = formatCurrency(totalVal);
    invoiceAddress.innerHTML = clientAddressDropdown.value;
    invoicePO.textContent = poInput.value || '';

    updateInvoiceDate();

    if (parseFloat(exemptRateValue) < 0 && salvageInput.value  && !(invoiceDateInput.value === '' || invoiceAddress.textContent === '' || gstInput.value === '' || salvageInput.value === '' || totalgstInput.value === '' || invoiceInput.value === '' ||  poInput.value === '' || serviceFeeInput.value === '') ){
      alert("Please review the Exempt tax, before printing.");
      return;
    } 

}

document.getElementById("printBtn").addEventListener("click", (event) => {
    
    // Prevent the default print action initially
    event.preventDefault();

    // Check if any of the mandatory fields are empty
    if (invoiceDateInput.value === '' || invoiceAddress.textContent === '' || gstInput.value === '' || salvageInput.value === '' || totalgstInput.value === '' || invoiceInput.value === '' ||  poInput.value === '' ||  serviceFeeInput.value === '' ) {
    
      alert("Please fill in all the mandatory fields (GST %, Invoice, Total GST, Salvage Cost, PO#, Service fee) before printing.");
    
    } else {

      updateTotals();

      // Get current date in YYYY-MM-DD format
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;
      const invoiceInfo =  invoiceInput.value.replace(/[^a-z0-9]/gi, '_').toUpperCase();
      // To get the text of the selected option:
      let selectedOptionAddress = clientAddressDropdown.options[clientAddressDropdown.selectedIndex];
      selectedOptionAddress = selectedOptionAddress.textContent.replace(/[^a-z0-9]/gi, '_').toUpperCase();
      // Construct the suggested filename
      const filename = `${invoiceInfo}_${selectedOptionAddress}_${currentDate}.pdf`;
     
      // Set the document title, which often influences the default filename in print dialogs
      document.title = filename;
      
      // If all fields are filled, proceed with printing
      window.print();

    }
  });


document.getElementById("applyBtn").addEventListener("click", () => {
        updateTotals();
  });

 // Add event listeners for 'Enter' key press 
 salvageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        updateTotals();
    }
  });

totalgstInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        updateTotals();
    }
  });

gstInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        updateTotals();
    }
  });

poInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        updateTotals();
    }
  });

// --- Initial setup for the date input and page load ---
// Set initial date to today's date and perform initial calculations when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    // Format to YYYY-MM-DD for the input type="date" value
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed (0=Jan, 11=Dec)
    const day = today.getDate().toString().padStart(2, '0');
    invoiceDateInput.value = `${year}-${month}-${day}`;

    // Update totals and date display immediately after setting the initial date
    updateTotals();
});


// New: Event listener for changes on the client address dropdown
clientAddressDropdown.addEventListener('change', updateTotals);

// Event listener for input changes on the Invoice Date input to update the display and title header
invoiceDateInput.addEventListener('input', updateTotals);