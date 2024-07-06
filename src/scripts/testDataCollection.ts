import axios from "axios";
import generateDummyData from "../utils/dummyDataGenerator";

const testDataCollection = async () => {
  try {
    // Generate dummy data
    await generateDummyData(100);

    // Test API
    const userId = "user5";
    const date = "2023-07-05";

    const response = await axios.post("http://localhost:3000/api/collect", {
      userId,
      date,
    });
    console.log("API Response:", response.data);

    // Wait for the data to be collected
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Check status
    const statusResponse = await axios.get(
      `http://localhost:3000/api/status/${userId}`,
    );
    console.log("Status Response:", statusResponse.data);

    // Test cache
    const cachedResponse = await axios.post(
      "http://localhost:3000/api/collect",
      { userId, date },
    );
    console.log("Cached Response:", cachedResponse.data);

    // Get all data from Elasticsearch
    const allDataResponse = await axios.get("http://localhost:3000/api/all");
    console.log("All Data Response:", allDataResponse.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data || error.message);
    } else if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
  }
};

testDataCollection().catch(console.error);
