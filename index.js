// Constants
const ODA_ORDER_CHARGE = 600;

const Per_KG_Charge_of_Zone_North_East = 35;
const Per_KG_Charge_of_Zone_West = 15;
const Per_KG_Charge_of_Zone_South = 28;
const Per_KG_Charge_of_Zone_Rest_of_India = 25;

const Minimum_Charge_of_Zone_North_East = 550;
const Minimum_Charge_of_Zone_West = 350;
const Minimum_Charge_of_Zone_South = 500;
const Minimum_Charge_of_Zone_Rest_of_India = 450;

const State_of_Zone_North_East = ["Assam", "Mizoram", "Manipur", "Nagaland", "Jammu & Kashmir", "Arunachal Pradesh", "Meghalaya", "Tripura"];
const State_of_Zone_West = ["Gujarat", "Maharashtra", "Goa", "Madhya Pradesh", "Chhattisgarh", "Dadra and Nagar Haveli", "Rajasthan"];
const State_of_Zone_South = ["Andhra Pradesh", "Karnataka", "Telangana", "Pondicherry", "Tamil Nadu", "Kerala"];
const State_of_Zone_Rest_of_India = ["Delhi", "Uttar Pradesh", "Punjab", "Orissa", "Himachal Pradesh", "Uttarakhand", "Haryana", "Bihar", "Jharkhand", "West Bengal"];

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

    // Fumction to find zone data by pincode
    function find_zone_by_pincode(weight, pincode_data) {
        console.log(pincode_data)
        console.log(weight)

        const Facility_State = pincode_data["Facility State"];
        console.log(Facility_State)


        if (State_of_Zone_North_East.includes(Facility_State)) {
            var state_zone = "North_East";
            var minimum_weight = Minimum_Charge_of_Zone_North_East/Per_KG_Charge_of_Zone_North_East;
            var minimum_charge = Minimum_Charge_of_Zone_North_East;
            var charge = Per_KG_Charge_of_Zone_North_East;
        } else if (State_of_Zone_West.includes(Facility_State)){
            var state_zone = "West";
            var minimum_weight = Minimum_Charge_of_Zone_West/Per_KG_Charge_of_Zone_West;
            var minimum_charge = Minimum_Charge_of_Zone_West;
            var charge = Per_KG_Charge_of_Zone_West;
        } else if (State_of_Zone_South.includes(Facility_State)) {
            var state_zone = "South";
            var minimum_weight = Minimum_Charge_of_Zone_South/Per_KG_Charge_of_Zone_South;
            var minimum_charge = Minimum_Charge_of_Zone_South;
            var charge = Per_KG_Charge_of_Zone_South;
        } else if (State_of_Zone_Rest_of_India.includes(Facility_State)){
            var state_zone = "Rest_of_India";
            var minimum_weight = Minimum_Charge_of_Zone_Rest_of_India/Per_KG_Charge_of_Zone_Rest_of_India;
            var minimum_charge = Minimum_Charge_of_Zone_Rest_of_India;
            var charge = Per_KG_Charge_of_Zone_Rest_of_India;
        }

        return [state_zone, charge, minimum_weight, minimum_charge]
    }

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
            calculateCharge();
        }
    });

    // Function to calculate the charge
    function calculateCharge() {
        const weightInput = document.getElementById("weight");
        const weight = weightInput.value;

        const pincodeInput = document.getElementById("pincode");
        const pincode = pincodeInput.value;

        const pincode_details = pincode_details_json[pincode];
        
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

        const [state_zone_name, zone_charge, minimum_zone_weight, minimum_zone_charge] = find_zone_by_pincode(new_weight, pincode_details)

        const resultElement = document.getElementById("charge");
        const Minimum_WeightElement = document.getElementById("minimum_weight");
        if (new_weight < Math.ceil(minimum_zone_weight)){
            Minimum_WeightElement.classList.remove("hide_element");
            Minimum_WeightElement.textContent = `*Below ${Math.ceil(minimum_zone_weight)}Kg minimum charges will apply.`
            var total_amount = minimum_zone_charge;
            resultElement.textContent = `Rs ${total_amount}/-`;
        } 
        else{
            Minimum_WeightElement.classList.add("hide_element");
            var total_amount = new_weight * zone_charge
            resultElement.textContent = `Rs ${total_amount}/- (${new_weight} Kg * ${zone_charge} Rs)`;
        }
        

        const is_ODA = pincode_details["ODA\r"];
        const is_ODAElement = document.getElementById("is_ODA");
        if (is_ODA === "TRUE") {
            var ODA_charge = ODA_ORDER_CHARGE;
            var Final_amount = total_amount + ODA_charge;
            is_ODAElement.classList.remove("hide_element");
        } else {
            var ODA_charge = 0;
            var Final_amount = total_amount;
            is_ODAElement.classList.add("hide_element");
        }

        const ODA_chargeElement = document.getElementById("ODA_charge");
        ODA_chargeElement.textContent = `Rs ${ODA_charge}/-`;

        const totalElement = document.getElementById("finalAmount");
        totalElement.textContent = `Total Amount: Rs ${Final_amount}/-`;

        const resultDiv = document.getElementById("resultDiv");
        resultDiv.style.display = "block";

        // Store data in localStorage
        localStorage.setItem('weight', weight);
        localStorage.setItem('charge', zone_charge);
        localStorage.setItem('ODA', ODA_charge);
        localStorage.setItem('finalAmount', Final_amount);
        localStorage.setItem('pincode', pincode);
    }

    // Event listener for modal show event
    $('#orderModalDetails').on('show.bs.modal', function (e) {
        // Retrieve data from localStorage
        const weight = localStorage.getItem('weight');
        const charge = localStorage.getItem('charge');
        const ODA = localStorage.getItem('ODA');
        const finalAmount = localStorage.getItem('finalAmount');
        const pincode = localStorage.getItem('pincode');

        // Update modal fields with retrieved data
        document.getElementById('modal_weight').value = weight;
        document.getElementById('modal_charge').value = charge;
        document.getElementById('modal_ODA').value = ODA;
        document.getElementById('modal_total_amount').value = finalAmount;
        document.getElementById('modal_pincode').value = pincode;
    });

    // Event listener for modal hide event
    $('#orderModalDetails').on('reload', function (e) {
        // Clear data from localStorage
        localStorage.removeItem('weight');
        localStorage.removeItem('charge');
        localStorage.removeItem('ODA');
        localStorage.removeItem('totalAmount');
        localStorage.removeItem('pincode');
    });

    // Event listener for send order button click
    document.getElementById("sendOrderButton").addEventListener("click", function () {
        // Get the values from the input fields
        const Weight = document.getElementById("modal_weight").value;
        const Pincode = document.getElementById("pincode").value;
        const Charge = document.getElementById("modal_charge").value;
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
        const whatsappURL = `https://wa.me/+919586010006?text=Order%20Details%0A%0APincode%3A%20${Pincode}%0AWeight%3A%20${Weight}%0Acharge%3A%20${Charge}%0AODA%20Charge%3A%20${ODA}%0ATotal%20Amount%3A%20${TotalAmount}%0A%0ASender%27s%20Details%3A%0AName%3A%20${senderFname}%20${senderLname}%0APhone%20Number%3A%20${senderPnumber}%0AAddress%3A%20${senderAddress}%0A%0AReceiver%27s%20Details%3A%0AName%3A%20${receiverFname}%20${receiverLname}%0APhone%20Number%3A%20${receiverPnumber}%0AAddress%3A%20${receiverAddress}`;
    
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
