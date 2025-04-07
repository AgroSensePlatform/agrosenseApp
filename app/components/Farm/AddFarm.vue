<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="$navigateBack()"/>
      <Label class="action-bar-title" text="Add Farm"/>
    </ActionBar>

    <GridLayout class="page__content" rows="auto, auto, auto, auto, auto, auto">
      <!-- Farm Name Input -->
      <TextField v-model="farmName" hint="Enter farm name" class="input" row="0"/>

      <!-- Add MapboxView in row 1 -->
      <MapboxView
        ref="mapbox"
        height="300"
        :accessToken="accessToken"
        mapStyle="streets"
        :latitude="currentLat"
        :longitude="currentLon"
        zoomLevel="10"
        row="1"
        @mapReady="onMapReady"
      />

      <!-- Get Location Button in row 2 (records a farm point) -->
      <Button text="Get Current Location" class="location-button" @tap="getCurrentLocation" row="2"/>

      <!-- Debug Toggle Button in row 3 -->
      <Button text="Toggle Debug Info" @tap="toggleDebug" class="toggle-debug-button" row="3"/>

      <!-- Debug Section in row 4 -->
      <ScrollView row="4" v-if="showDebug">
        <StackLayout class="debug-section">
          <Label text="Coordinate Points:" class="debug-header" />
          <StackLayout class="debug-points">
            <Label
              v-for="(coord, index) in coordinates"
              :key="index"
              :text="`Point ${index+1}: Lat: ${coord.lat}, Lon: ${coord.lon}`"
              class="debug-point"
            />
          </StackLayout>
        </StackLayout>
        <!-- <Label text="Coordinates JSON:" class="debug-header" />
        <TextView :text="JSON.stringify(coordinates, null, 2)" class="debug-json" editable="false" /> -->
      </ScrollView>

      <!-- Save Farm Button in row 5 -->
      <Button text="Save Farm" class="save-button" @tap="saveFarm" row="5"/>
    </GridLayout>
  </Page>
</template>

<script>
  import { alert } from "@nativescript/core";
  import { AuthService } from "~/shared/auth-service";
  import { BASE_URL, MAPBOX_ACCESS_TOKEN } from "~/shared/config";
  import Farms from "./Farms"; // Import the Farms page component
  import * as geolocation from "@nativescript/geolocation";

  export default {
    data() {
      return {
        farmName: "", // Store the new farm name
        coordinates: [], // Store the list of farm points
        accessToken: MAPBOX_ACCESS_TOKEN,
        currentLat: 37.7749,
        currentLon: -122.4194,
        map: null, // Store the Mapbox view instance
        showDebug: false // Toggle for debug view
      };
    },
    mounted() {
      // Automatically center the map on the current location
      this.updateMapCenter();
    },
    methods: {
      toggleDebug() {
        this.showDebug = !this.showDebug;
      },
      onMapReady(event) {
        // Save the map instance
        this.map = event.object;
      },
      async updateMapCenter() {
        try {
          console.log("Updating map center...");
          const isEnabled = await geolocation.isEnabled();
          if (!isEnabled) {
            await geolocation.enableLocationRequest();
          }
          const location = await geolocation.getCurrentLocation({
            desiredAccuracy: 3,
            updateDistance: 1, // Reduce to 1 meter
            timeout: 20000,
          });
          if (location) {
            console.log(`Map Center - Latitude: ${location.latitude}, Longitude: ${location.longitude}`);
            this.currentLat = location.latitude;
            this.currentLon = location.longitude;
            if (this.map) {
              this.map.setCenter({
                lat: this.currentLat, // mandatory
                lng: this.currentLon, // mandatory
                animated: false // default true
              });
            }
          } else {
            alert("Unable to retrieve location for map centering.");
          }
        } catch (error) {
          console.error("Error updating map center:", error);
          alert("An error occurred while centering the map.");
        }
      },
      async getCurrentLocation() {
        // This method is still used for capturing a farm point.
        try {
          const isEnabled = await geolocation.isEnabled();
          if (!isEnabled) {
            await geolocation.enableLocationRequest();
          }
          const location = await geolocation.getCurrentLocation({
            desiredAccuracy: 3,
            updateDistance: 1, // Reduce to 1 meter
            timeout: 20000,
          });
          if (location) {
            console.log(`Farm Point - Latitude: ${location.latitude}, Longitude: ${location.longitude}`);
            this.coordinates.push({ lat: location.latitude, lon: location.longitude });
            // If the map is ready, add a marker for the current location.
            if (this.map) {
              console.log("Adding marker to map...");
              this.map.addMarkers([
                {
                  lat: location.latitude,
                  lng: location.longitude,
                  selected: true,
                  onTap: () => { console.log("Marker tapped!"); }
                }
              ]);
            }
          } else {
            alert("Unable to retrieve location for farm point. Please try again.");
          }
        } catch (error) {
          console.error("Error getting farm point:", error);
          alert("An error occurred while fetching the location for a farm point.");
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
              coordinates: this.coordinates,
            }),
          });
          if (response.ok) {
            alert("Farm added successfully!");
            this.$navigateTo(Farms, { clearHistory: true });
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
    watch: {
      coordinates: {
        handler(newCoordinates) {
          console.log("Coordinates updated:", newCoordinates);
        },
        deep: true,
      },
    },
    created() {
      geolocation.watchLocation(
        (location) => {
          console.log(`Updated Location - Latitude: ${location.latitude}, Longitude: ${location.longitude}`);
          this.coordinates.push({ lat: location.latitude, lon: location.longitude });
          if (this.map) {
            this.map.addMarkers([
              {
                lat: location.latitude,
                lng: location.longitude,
                selected: true,
                onTap: () => { console.log("Marker tapped!"); }
              }
            ]);
          }
        },
        (error) => {
          console.error("Error watching location:", error);
        },
        {
          desiredAccuracy: 3,
          updateDistance: 1, // Update for every 1 meter of movement
          minimumUpdateTime: 1000, // Update every 1 second
        }
      );
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

  .toggle-debug-button {
    margin: 10;
    font-size: 16;
    background-color: #555;
    color: white;
    padding: 8;
    border-radius: 5;
    text-align: center;
  }

  .debug-section {
    margin: 10;
    padding: 10;
    background-color: #f5f5f5;
    border-radius: 5;
  }

  .debug-header {
    font-weight: bold;
    font-size: 16;
    margin-top: 10;
  }

  .debug-json {
    background-color: #eee;
    padding: 10;
    font-family: monospace;
    font-size: 12;
    height: 150;
    margin-top: 5;
  }

  .debug-points {
    margin-top: 10;
  }

  .debug-point {
    font-family: monospace;
    font-size: 12;
    margin-bottom: 5;
    padding: 5;
    background-color: #eee;
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
