const BASE_URL = "https://api.sandbox.youverify.co/v2/api/identity/ng/nin";
const API_KEY = "QCoH7sYt.Mwc6p4dTPYnztsw6s8st7bAGZYkxKv94aogc";




export async function verifyNin(nin, firstName, lastName, dob) {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": API_KEY,
            },
            body: JSON.stringify({
                id: nin,
                "validations": {
                    "data": {
                        lastName,
                        firstName,
                        dateOfBirth: dob, // must be YYYY-MM-DD
                    }
                },
                isSubjectConsent: true,
            }),
        });

        return await response.json();
    } catch (error) {
        throw new Error("Failed to verify NIN");
    }
}
