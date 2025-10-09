import { supabase } from "../../lib/supabase";


// Paystack Secret Key
const PAYSTACK_SECRET_KEY = '';

export const createPaystackVirtualAccount = async ({ userId, email, firstName, lastName }) => {
    try {
        // 1. Create Customer
        const customerRes = await fetch('https://api.paystack.co/customer', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                first_name: firstName,
                last_name: lastName,
                phone:'+2348134641462'
            }),
        });

        const customerJson = await customerRes.json();
        if (!customerJson.status) throw new Error(customerJson.message);
        const customerData = customerJson.data;

        const customerId= customerData?.id;


        //Create Dedicated Account with customer_code
        const accountRes = await fetch('https://api.paystack.co/dedicated_account', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customer: customerId,
                preferred_bank: 'wema-bank',
                phone: '7040520952',
                last_name: lastName,
                first_name: firstName
            }),
        });

        const accountJson = await accountRes.json();
        if (!accountJson.status) throw new Error(accountJson.message);
        const accountData = accountJson.data;

        // 3. Save to Supabase
        const { error } = await supabase.from('users').update({
            paystack_customer_id: customerData?.id,
            customer_code: customerData?.customer_code,
            account_number: accountData?.account_number,
            bank_name: accountData?.bank?.name,
            account_name: accountData?.account_name,
        }).eq('id', userId);

        if (error) throw new Error('Supabase error: ' + error.message);

        // 4. Return the account
        return {
            success: true,
            account: {
                account_number: accountData?.account_number,
                bank_name: accountData?.bank.name,
                account_name: accountData?.account_name,
            },
        };
    } catch (err) {
        console.error('Paystack error:', err);
        return {
            success: false,
            message: err.message,
        };
    }
};

