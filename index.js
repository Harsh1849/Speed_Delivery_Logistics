// Constants
const ODA_ORDER_CHARGE = 600;

const per_kg_price_of_zone_North_East = 35;
const per_kg_price_of_zone_west = 15;
const per_kg_price_of_zone_South = 28;
const per_kg_price_of_zone_Rest_of_India = 25;

const Minimum_price_of_zone_North_East = 550;
const Minimum_price_of_zone_west = 350;
const Minimum_price_of_zone_South = 500;
const Minimum_price_of_zone_Rest_of_India = 450;

const state_of_zone_North_East = ["Assam", "Mizoram", "Manipur", "Nagaland", "Jammu & Kashmir", "Arunachal Pradesh", "Meghalaya", "Tripura"];
const state_of_zone_west = ["Gujarat", "Maharashtra", "Goa", "Madhya Pradesh", "Chhattisgarh", "Dadra and Nagar Haveli", "Rajasthan"];
const state_of_zone_South = ["Andhra Pradesh", "Karnataka", "Telangana", "Pondicherry", "Tamil Nadu", "Kerala"];
const state_of_zone_Rest_of_India = ["Delhi", "Uttar Pradesh", "Punjab", "Orissa", "Himachal Pradesh", "Uttarakhand", "Haryana", "Bihar", "Jharkhand", "West Bengal"];

const csvFilePath = 'data.csv';

// Function to convert CSV data to JSON
function csv_to_json(csv_data) {
    const rows = csv_data.split('\n');
    const header = rows[0].split(',');
    const jsonData = [];

    for (let i = 1; i < rows.length; i++) {
        const obj = {};
        const row = rows[i].trim().split(',');

        for (let j = 1; j < header.length; j++) {
            obj[header[j]] = row[j];
        }
        jsonData.push(obj);
    }

    // Set "Pin" as index
    const pincode_json = {};

    for (let i = 0; i < jsonData.length; i++) {
        const pin = jsonData[i]['Pin'];
        delete jsonData[i]['Pin'];
        pincode_json[pin] = jsonData[i];
    }

    return pincode_json;
}

// FileReader instance
const reader = new FileReader();

// Event handler for file load
reader.onload = function (e) {
    const csvData = e.target.result;

    // Convert CSV to JSON
    const pincode_details_json = csv_to_json(csvData);
    console.log(pincode_details_json)

    // Event listener for pincode input
    document.getElementById("pincode").addEventListener("input", function () {
        const pincodeInput = document.getElementById("pincode");

        const pincode = this.value;
        const pincode_details = pincode_details_json[pincode];

        if (pincode_details === undefined) {
            pincodeInput.classList.add("is-invalid");
        } else {
            pincodeInput.classList.remove("is-invalid");
        }
    });

    // Event listener for form submission
    document.getElementById("calculateForm").addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent form submission and page reload
        const pincodeInput = document.getElementById("pincode");
        const pincode = pincodeInput.value;
        const pincode_details = pincode_details_json[pincode];

        const myAlert = document.getElementById("myAlert");

        if (pincode_details === undefined) {
            // location.reload();
            myAlert.style.display = "block";

            // Hide the alert after 5 seconds
            setTimeout(function () {
                myAlert.style.display = "none";
            }, 10000);
        } else {
            myAlert.style.display = "none";
            calculatePrice();
        }
    });

    // Function to calculate the price
    function calculatePrice() {
        const weightInput = document.getElementById("weight");
        const weight = weightInput.value;

        const pincodeInput = document.getElementById("pincode");
        const pincode = pincodeInput.value;

        const pincode_details = pincode_details_json[pincode];

        const Facility_State = pincode_details["Facility State"];

        if (state_of_zone_North_East.includes(Facility_State)) {
            var price_state = per_kg_price_of_zone_North_East;
            var state_zone = "North_East";
        } else if (state_of_zone_South.includes(Facility_State)) {
            var price_state = per_kg_price_of_zone_west;
            var state_zone = "South";
        } else if (state_of_zone_west.includes(Facility_State)){
            var price_state = per_kg_price_of_zone_South;
            var state_zone = "West";
        } else if (state_of_zone_Rest_of_India.includes(Facility_State)){
            var price_state = per_kg_price_of_zone_Rest_of_India;
            var state_zone = "Rest_of_India";
        }

        const lengthInput = document.getElementById("length");
        const length = lengthInput.value;

        const heightInput = document.getElementById("height");
        const height = heightInput.value;

        const widthInput = document.getElementById("width");
        const width = widthInput.value;

        const weight_dimension = Math.ceil((length * height * width) / 5000);

        const dimension_weight_element = document.getElementById("dimensionWeight");
        dimension_weight_element.style.display = "block";

        const dimension_weight_input_element = document.getElementById("dimensionWeightInput");
        dimension_weight_input_element.value = `${weight_dimension}`;

        if (weight > weight_dimension) {
            var new_weight = weight;
            weightInput.classList.add("bg-warning");
            dimension_weight_input_element.classList.remove("bg-warning");
        } else {
            var new_weight = weight_dimension;
            dimension_weight_input_element.classList.add("bg-warning");
            weightInput.classList.remove("bg-warning");
        }

        if (new_weight < 20){
            if (state_zone == "North_East") {
                var totalamount = Minimum_price_of_zone_North_East;
            }
            else if (state_zone == "west") {
                var totalamount = Minimum_price_of_zone_west;
            }
            else if (state_zone == "South") {
                var totalamount = Minimum_price_of_zone_South;
            }
            else if (state_zone == "Rest_of_India") {
                var totalamount = Minimum_price_of_zone_Rest_of_India;
            }

            price_state = totalamount;
            const resultElement = document.getElementById("price");
            resultElement.textContent = `Rs ${price_state}/-`;
        }
        else {
            var totalamount = price_state * new_weight;
            const resultElement = document.getElementById("price");
            resultElement.textContent = `Rs ${price_state}/-`;
        }


        const is_ODA = pincode_details["ODA\r"];
        const is_ODAElement = document.getElementById("is_ODA");
        if (is_ODA === "TRUE") {
            var ODA_charge = ODA_ORDER_CHARGE;
            var Final_amount = totalamount + ODA_charge;
            is_ODAElement.classList.remove("d-none");
        } else {
            var ODA_charge = 0;
            var Final_amount = totalamount;
            is_ODAElement.classList.add("d-none");
        }

        const ODA_chargeElement = document.getElementById("ODA_charge");
        ODA_chargeElement.textContent = `Rs ${ODA_charge}/-`;

        const totalElement = document.getElementById("finalAmount");
        totalElement.textContent = `Total Amount: Rs ${Final_amount}/-`;

        const resultDiv = document.getElementById("resultDiv");
        resultDiv.style.display = "block";

        // Store data in localStorage
        localStorage.setItem('weight', weight);
        localStorage.setItem('price', price_state);
        localStorage.setItem('ODA', ODA_charge);
        localStorage.setItem('totalAmount', Final_amount);
        localStorage.setItem('pincode', pincode);
    }

    // Event listener for modal show event
    $('#orderModalDetails').on('show.bs.modal', function (e) {
        // Retrieve data from localStorage
        const weight = localStorage.getItem('weight');
        const price = localStorage.getItem('price');
        const ODA = localStorage.getItem('ODA');
        const totalAmount = localStorage.getItem('totalAmount');
        const pincode = localStorage.getItem('pincode');

        // Update modal fields with retrieved data
        document.getElementById('modal_weight').value = weight;
        document.getElementById('modal_price').value = price;
        document.getElementById('modal_ODA').value = ODA;
        document.getElementById('modal_total_amount').value = totalAmount;
        document.getElementById('modal_pincode').value = pincode;
    });

    // Event listener for modal hide event
    $('#orderModalDetails').on('reload', function (e) {
        // Clear data from localStorage
        localStorage.removeItem('weight');
        localStorage.removeItem('price');
        localStorage.removeItem('ODA');
        localStorage.removeItem('totalAmount');
        localStorage.removeItem('pincode');
    });

    // Event listener for send order button click
    document.getElementById("sendOrderButton").addEventListener("click", function () {
        // Get the values from the input fields
        const Weight = document.getElementById("modal_weight").value;
        const Pincode = document.getElementById("pincode").value;
        const Price = document.getElementById("modal_price").value;
        const ODA = document.getElementById("modal_ODA").value;
        const TotalAmount = document.getElementById("modal_total_amount").value;
        const senderFname = document.getElementById("sender_fname").value;
        const senderLname = document.getElementById("sender_lname").value;
        const senderPnumber = document.getElementById("sender_pnumber").value;
        const senderAddress = document.getElementById("sender_address").value;
        const receiverFname = document.getElementById("receiverer_fname").value;
        const receiverLname = document.getElementById("receiverer_lname").value;
        const receiverPnumber = document.getElementById("receiver_pnumber").value;
        const receiverAddress = document.getElementById("receiver_address").value;
    
        // Construct the WhatsApp URL with the parameters
        const whatsappURL = `https://wa.me/+919586010006?text=Order%20Details%0A%0APincode%3A%20${Pincode}%0AWeight%3A%20${Weight}%0APrice%3A%20${Price}%0AODA%20Charge%3A%20${ODA}%0ATotal%20Amount%3A%20${TotalAmount}%0A%0ASender%27s%20Details%3A%0AName%3A%20${senderFname}%20${senderLname}%0APhone%20Number%3A%20${senderPnumber}%0AAddress%3A%20${senderAddress}%0A%0AReceiver%27s%20Details%3A%0AName%3A%20${receiverFname}%20${receiverLname}%0APhone%20Number%3A%20${receiverPnumber}%0AAddress%3A%20${receiverAddress}`;
    
        // Open the WhatsApp URL in a new window or tab
        window.open(whatsappURL);
    });
  
};

// Fetch the CSV file
fetch(csvFilePath)
    .then(response => response.text())
    .then(csvData => {
        reader.readAsText(new Blob([csvData]));
    })
    .catch(error => {
        console.error('Error fetching CSV file:', error);
    });
