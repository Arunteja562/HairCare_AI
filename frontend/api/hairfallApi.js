import api from "./axios";

// Ensure you send all the required fields with exact casing as expected by backend
// {
  // Age: number,
  // Gender: "Male" or "Female",
  // Occupation: string,
  // Country: string,
  // Health_Condition: string,
  // Family_History: 0 or 1,
  // Stress_Level: number,
  // Sleep_Hours: number,
  // Work_Hours: number,
  // Diet_Quality: string,
  // Medication: 0 or 1,
// }

export const predictHairFall = (inputData) => {
  return api.post("/predict", inputData);
};

// Other backend calls as needed, e.g., login, register etc.
// Example:
// export const loginUser = (credentials) => api.post("/login", credentials);
// export const registerUser = (data) => api.post("/register", data);
