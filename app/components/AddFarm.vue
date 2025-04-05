<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="$navigateBack()"/>
      <Label class="action-bar-title" text="Add Farm"/>
    </ActionBar>

    <GridLayout class="page__content" rows="auto, auto, auto, *">
      <!-- Farm Name Input -->
      <TextField v-model="farmName" hint="Enter farm name" class="input" row="0"/>


        <!-- Add MapboxView here -->
        <MapboxView
        height="300"
        :accessToken="accessToken"
        mapStyle="streets"
        latitude="37.7749"
        longitude="-122.4194"
        zoomLevel="10"
      />

      <!-- Get Location Button -->
      <Button text="Get Current Location" class="location-button" @tap="getCurrentLocation" row="1"/>

      <!-- Coordinates List -->
      <ListView v-if="coordinates.length > 0" for="coord in coordinates" class="coordinates-list" row="2">
        <v-template>
          <Label :text="`Latitude: ${coord.lat}, Longitude: ${coord.lon}`" class="coordinate-item"/>
        </v-template>
      </ListView>

      <!-- Save Farm Button -->
      <Button text="Save Farm" class="save-button" @tap="saveFarm" row="3"/>
    </GridLayout>
  </Page>
</template>

<script>
  import { alert } from "@nativescript/core";
  import { AuthService } from "../shared/auth-service";
  import { BASE_URL, MAPBOX_ACCESS_TOKEN } from "../shared/config";
  import * as geolocation from "@nativescript/geolocation";

  export default {
    data() {
      return {
        farmName: "", // Store the new farm name
        coordinates: [], // Store the list of coordinates
        accessToken: MAPBOX_ACCESS_TOKEN,
      };
    },
    methods: {
      async getCurrentLocation() {
        try {
          // Ensure location services are enabled
          const isEnabled = await geolocation.isEnabled();
          if (!isEnabled) {
            await geolocation.enableLocationRequest();
          }

          // Get current location
          const location = await geolocation.getCurrentLocation({
            desiredAccuracy: 3, // High accuracy
            updateDistance: 10, // Minimum distance for updates
            timeout: 20000, // Timeout in milliseconds
          });

          if (location) {
            console.log(`Latitude: ${location.latitude}, Longitude: ${location.longitude}`);
            this.coordinates.push({ lat: location.latitude, lon: location.longitude }); // Add to the coordinates list
          } else {
            alert("Unable to retrieve location. Please try again.");
          }
        } catch (error) {
          console.error("Error getting location:", error);
          alert("An error occurred while fetching the location. Please try again.");
        }
      },
      async saveFarm() {
        try {
          const token = AuthService.getToken();
          if (!token) {
            alert("You must be logged in to add a farm.");
            return;
          }

          const response = await fetch(`${BASE_URL}/api/farms`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: this.farmName,
              coordinates: this.coordinates, // Include the coordinates in the request
            }),
          });

          if (response.ok) {
            alert("Farm added successfully!");
            this.$navigateBack(); // Navigate back to the Farms page
          } else {
            console.error("Failed to add farm:", await response.text());
            alert("Failed to add farm. Please try again.");
          }
        } catch (error) {
          console.error("Error adding farm:", error);
          alert("An error occurred while adding the farm.");
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .input {
    margin: 20;
    font-size: 18;
  }

  .location-button {
    margin: 20;
    font-size: 18;
    background-color: #007bff;
    color: white;
    padding: 10;
    border-radius: 5;
    text-align: center;
  }

  .coordinates-list {
    margin: 20;
  }

  .coordinate-item {
    font-size: 16;
    padding: 10;
    border-bottom-width: 1;
    border-bottom-color: #ccc;
  }

  .save-button {
    margin: 20;
    font-size: 18;
    background-color: #28a745;
    color: white;
    padding: 10;
    border-radius: 5;
    text-align: center;
  }
</style>
