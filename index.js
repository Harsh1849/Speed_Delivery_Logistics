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
    const pincodeInput = document.getElementById("pincode");

    pincodeInput.addEventListener("input", function () {
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

            price_state = "*Below 20Kg Minimum Charge applied Rs " + totalamount + "/-";
            const resultElement = document.getElementById("price");
            resultElement.textContent = `${price_state}`;
        }
        else {
            var totalamount = price_state * new_weight;
            const resultElement = document.getElementById("price");
            resultElement.textContent = `Rs ${price_state}/- Per Kg`;    
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
        totalElement.textContent = `Rs ${Final_amount}/-`;

        const resultDiv = document.getElementById("resultDiv");
        resultDiv.style.display = "block";
    }
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
