const users = require('./users.json');
const axios = require('axios');

const url = "https://api.nasims.ng/api/admin/applicant/details?npower_id="
const pUrl = "https://validation.nasims.ng/api/v1/npower/save";

const config = {
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    }
}

// async function validate(users){
    users.forEach(async user =>{
        const details = await axios.get(url+user.id);

        // console.log(details);
        const data = await {
            nPowerID: details.data.name,
            newBVN: details.data.bvn,
            nin: 0,
            newBVNFirstName: details.first_name,
            newBVNLastName: details.surname,
            newBVNEmail: details.data.email_address,
            newBankName: details.data.bank_name,
            newAccountNumber: details.data.bank_account_number,
            newAccountName: user.full_name
        }

        try {
            const result = await axios.post(pUrl, data, config);
            console.log(result.message+ user.full_name);
            
        } catch (error) {
            console.log(error+ user.full_name);
            
        }

        return details;
    })
// }

// validate(users)