
const BASE_URL = "";
const API_KEY = "";



//bvnn verifiatoon code
export async function verifyBvn(bvn, firstName, lastName, dob) {
    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Token: API_KEY,
            },
            body: JSON.stringify({
                id: bvn,
                isSubjectConsent: true,
                validations: {
                    data: {
                        firstName,
                        lastName,
                        dateOfBirth: dob, // format: YYYY-MM-DD
                    }
                },
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || "Failed to verify BVN");
    }
}
