<template>
  <Page class="page">
    <ActionBar title="Add Sensor">
      <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="$navigateBack()" />
    </ActionBar>
    <ScrollView>
      <StackLayout class="form-container" padding="20">
        <!-- Scan Sensor Button -->
        <Button text="Scan Sensor" class="scan-button" @tap="scanSensor" />

        <!-- Add Sensor Button -->
        <Button  v-if="sensorCode && sensorCode.trim() !== '' && lat !== null && lon !== null"   text="Add Sensor" class="add-button" @tap="addSensor" />

        <!-- Display Scanned Sensor Code -->
        <Label v-if="sensorCode" :text="`Sensor Code: ${sensorCode}`" class="sensor-code"  />

        <!-- Display GPS Coordinates -->
        <Label v-if="lat && lon" :text="`Latitude: ${lat}, Longitude: ${lon}`" class="gps-coordinates" />

        <!-- Display All Data in a TextView -->
        <TextView
          v-if="sensorCode || farmId || lat || lon"
          :text="`Scanned Code: ${sensorCode || 'N/A'}\nFarm ID: ${farmId || 'N/A'}\nLatitude: ${lat || 'N/A'}\nLongitude: ${lon || 'N/A'}`"
          class="data-text"
          editable="false"
          textWrap="true"
        />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { alert } from "@nativescript/core";
import { AuthService } from "~/shared/auth-service";
import { BASE_URL } from "~/shared/config";
import * as geolocation from "@nativescript/geolocation";
import { BarcodeScanner } from "nativescript-barcodescanner";

export default {
  props: {
    farmId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      sensorCode: "",
      lat: null,
      lon: null,
      barcodeScanner: new BarcodeScanner(),
    };
  },
  mounted() {
    console.log("AddSensor component mounted");
    console.log("Farm ID:", this.farmId);
  },
  methods: {
    async scanSensor() {
      try {
        // Step 1: Scan QR Code
        const qrResult = await this.barcodeScanner.scan({
          formats: "QR_CODE",
          cancelLabel: "Cancel",
          message: "Scan the QR code to retrieve the sensor code.",
          showFlipCameraButton: true,
          preferFrontCamera: false,
        });

        // Log the entire qrResult object for debugging
        console.log("QR Code Scan Result:", qrResult);

        if (!qrResult.text) {
          alert("QR code scanning failed. Please try again.");
          return;
        }

        // Use the scanned text directly as the sensor code
        console.log("Scanned QR Code Text:", qrResult.text);
        this.sensorCode = qrResult.text;

        // Step 2: Get GPS Coordinates
        const isEnabled = await geolocation.isEnabled();
        if (!isEnabled) {
          await geolocation.enableLocationRequest();
        }

        const location = await geolocation.getCurrentLocation({
          desiredAccuracy: 3,
          updateDistance: 1,
          timeout: 20000,
        });

        if (location) {
          this.lat = location.latitude;
          this.lon = location.longitude;
          console.log(`GPS Location - Latitude: ${this.lat}, Longitude: ${this.lon}`);
        } else {
          alert("Unable to retrieve GPS location. Please try again.");
        }

        alert("Scanned QR code successfully!");
        console.log(`Sensor Code: ${this.sensorCode}`);
      } catch (error) {
        console.error("Error during sensor scanning:", error);
        alert("An error occurred while scanning the sensor. Please try again.");
      }
    },
    async addSensor() {
      try {
        // Step 3: Send Data to Backend
        const token = AuthService.getToken();
        if (!token) {
          alert("You must be logged in to register a sensor.");
          return;
        }

        const requestData = {
          code: this.sensorCode,
          farm_id: this.farmId,
          lat: this.lat,
          lon: this.lon,
        };



        const response = await fetch(`${BASE_URL}/api/scan`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });

        const responseText = await response.text();

        // Try to parse the response as JSON for display purposes
        try {
          const responseData = JSON.parse(responseText);
        } catch (e) {
          // If not JSON, keep as is
        }


        if (response.ok) {
          alert("Sensor registered successfully!");
        } else {
          console.error("Failed to register sensor:", responseText);
          alert("Failed to register sensor. Please check the debug information.");
        }
      } catch (error) {
        console.error("Error during sensor registration:", error);
        alert("An error occurred while registering the sensor. See debug information.");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.page {
  background-color: #f5f5f5;
}

.form-container {
  margin: 20px;
}

.scan-button,
.add-button {
  margin-bottom: 20px;
  font-size: 18px;
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.sensor-code,
.gps-coordinates {
  margin-bottom: 20px;
  font-size: 16px;
  color: #555;
}

.debug-section {
  margin-top: 30px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.debug-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.debug-subtitle {
  font-size: 16px;
  font-weight: bold;
  color: #555;
  margin-top: 15px;
  margin-bottom: 5px;
}

.debug-text {
  background-color: #fff;
  color: #333;
  font-family: monospace;
  padding: 10px;
  border-radius: 3px;
  border: 1px solid #ccc;
  font-size: 14px;
  height: 150;
  margin-bottom: 10px;
}

.data-text {
  background-color: #fff;
  color: #333;
  font-family: monospace;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  margin-top: 20px;
}
</style>
