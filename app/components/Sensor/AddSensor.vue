<template>
  <Page class="page">
    <ActionBar title="Add Sensor">
      <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="$navigateBack()" />
    </ActionBar>
    <ScrollView>
      <StackLayout class="form-container" padding="20">
        <!-- QR Code Scanner Button -->
        <Button text="Scan QR Code" class="qr-button" @tap="scanQRCode" />

        <!-- Display Scanned Sensor Code -->
        <Label v-if="sensorCode" :text="`Sensor Code: ${sensorCode}`" class="sensor-code" />

        <!-- Get GPS Coordinates Button -->
        <Button text="Get GPS Coordinates" class="gps-button" @tap="getCurrentLocation" />

        <!-- Display GPS Coordinates -->
        <Label v-if="lat && lon" :text="`Latitude: ${lat}, Longitude: ${lon}`" class="gps-coordinates" />

        <!-- Add Sensor Button -->
        <Button text="Add Sensor" class="add-button" @tap="addSensor" />
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
      default: null, // If no farmId is passed, it will be null
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
    async scanQRCode() {
      try {
        const result = await this.barcodeScanner.scan({
          formats: "QR_CODE", // Only scan QR codes
          cancelLabel: "Cancel",
          message: "Scan the QR code to retrieve the sensor code.",
          showFlipCameraButton: true,
          preferFrontCamera: false,
        });

        if (result.text) {
          console.log("QR Code Scanned:", result.text);

          // Parse the QR code data (assuming it's JSON with a code)
          const data = JSON.parse(result.text);
          if (data.code) {
            this.sensorCode = data.code;
            console.log(`Sensor Code: ${this.sensorCode}`);
          } else {
            alert("Invalid QR code format. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error scanning QR code:", error);
        alert("An error occurred while scanning the QR code.");
      }
    },
    async getCurrentLocation() {
      try {
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
      } catch (error) {
        console.error("Error getting GPS location:", error);
        alert("An error occurred while fetching the GPS location.");
      }
    },
    async addSensor() {
      if (!this.sensorCode || !this.lat || !this.lon) {
        alert("Please scan the QR code and retrieve the GPS coordinates.");
        return;
      }

      try {
        const token = AuthService.getToken();
        if (!token) {
          alert("You must be logged in to add a sensor.");
          return;
        }

        const response = await fetch(`${BASE_URL}/sensors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            code: this.sensorCode,
            farm_id: this.farmId, // Pass the farm ID (can be null)
            lat: this.lat,
            lon: this.lon,
          }),
        });

        if (response.ok) {
          alert("Sensor added successfully!");
          this.$navigateBack();
        } else {
          const errorText = await response.text();
          console.error("Failed to add sensor:", errorText);
          alert("Failed to add sensor. Please try again.");
        }
      } catch (error) {
        console.error("Error adding sensor:", error);
        alert("An error occurred while adding the sensor.");
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

.qr-button,
.gps-button {
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

.add-button {
  background-color: #28a745;
  color: white;
  font-size: 18px;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}
</style>
