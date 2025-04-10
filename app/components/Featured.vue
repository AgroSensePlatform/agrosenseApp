<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden"/>
      <GridLayout columns="50, *">
        <Label class="action-bar-title" text="Home" colSpan="2"/>

        <Label class="fas" text.decode="&#xf0c9;" @tap="onDrawerButtonTap"/>
      </GridLayout>
    </ActionBar>

    <GridLayout class="page__content" rows="auto, auto, auto, auto, auto">


      <!-- Add MapboxView in row 1 -->
      <MapboxView
        ref="mapbox"
        height="300"
        :accessToken="accessToken"
        mapStyle="streets"
        :latitude="currentLat"
        :longitude="currentLon"
        zoomLevel="8"
        row="1"
        @mapReady="onMapReady"
      />

      <!-- Get Location Button in row 2 (records a farm point) -->
      <Button text="Get Current Location" class="location-button" @tap="getCurrentLocation" row="2"/>

      <!-- Coordinates List in row 3 -->
      <ListView v-if="coordinates.length > 0" for="coord in coordinates" class="coordinates-list" row="3">
        <v-template>
          <Label :text="`Latitude: ${coord.lat}, Longitude: ${coord.lon}`" class="coordinate-item"/>
        </v-template>
      </ListView>


    </GridLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import { SelectedPageService } from "../shared/selected-page-service";
  import { alert } from "@nativescript/core";
  import { AuthService } from "~/shared/auth-service";
  import { BASE_URL, MAPBOX_ACCESS_TOKEN } from "~/shared/config";
  import * as geolocation from "@nativescript/geolocation";

  export default {
    data() {
      return {
        farmName: "", // Store the new farm name
        coordinates: [], // Store the list of farm points
        accessToken: MAPBOX_ACCESS_TOKEN,
        currentLat: 37.7749,
        currentLon: -122.4194,
        map: null // Store the Mapbox view instance
      };
    },
    mounted() {
      // Automatically center the map on the current location
      this.updateMapCenter();
    },
    methods: {
      onDrawerButtonTap() {
        utils.showDrawer();
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
            updateDistance: 10,
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
            updateDistance: 10,
            timeout: 20000,
          });
          if (location) {
            console.log(`Farm Point - Latitude: ${location.latitude}, Longitude: ${location.longitude}`);
            this.coordinates.push({ lat: location.latitude, lon: location.longitude });
          } else {
            alert("Unable to retrieve location for farm point. Please try again.");
          }
        } catch (error) {
          console.error("Error getting farm point:", error);
          alert("An error occurred while fetching the location for a farm point.");
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
