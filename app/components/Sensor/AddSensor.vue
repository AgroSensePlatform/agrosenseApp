<template>
  <Page class="page">
    <ActionBar title="Add Sensor">
      <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="$navigateBack()" />
    </ActionBar>
    <ScrollView>
      <StackLayout class="form-container" padding="20">
        <!-- Sensor Code Input -->
        <TextField v-model="sensorCode" hint="Enter sensor code" class="input" />


        <!-- Get GPS Location Button -->
        <Button text="Get Current Location" class="location-button" @tap="getCurrentLocation" />

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
import { onMounted } from "vue";

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
    };
  },
  mounted() {
      console.log("AddSensor component mounted");
      console.log("Farm ID:", this.farmId);
  },
  methods: {
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
      if (!this.sensorCode || !this.sensorName || !this.sensorType || !this.lat || !this.lon) {
        alert("Please fill in all fields and get the GPS location.");
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
            name: this.sensorName,
            type: this.sensorType,
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

.input {
  margin-bottom: 20px;
  font-size: 18px;
  padding: 10px;
  border-radius: 5px;
  background-color: white;
}

.location-button {
  margin-bottom: 20px;
  font-size: 18px;
  background-color: #007bff;
  color: white;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

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
