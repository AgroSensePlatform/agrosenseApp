<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden"/>
      <GridLayout columns="50, *">
        <Label class="action-bar-title" text="Home" colSpan="2"/>

        <Label class="fas" text.decode="&#xf0c9;" @tap="onDrawerButtonTap"/>
      </GridLayout>
    </ActionBar>

      <GridLayout class="page__content" rows="*, auto, auto">
          <Label class="page__content-icon fas" text.decode="&#xf015;" row="0"/>
          <Label class="page__content-placeholder" :text="message" row="0"/>

          <!-- Button to get GPS coordinates -->
          <Button text="Get GPS Coordinates" @tap="getCoordinates" class="btn btn-primary" row="1"/>

          <!-- Button to display GPS coordinates -->
          <Button text="Display Coordinates" @tap="displayCoordinates" class="btn btn-secondary" row="2"/>

          <!-- Label to show the coordinates -->
          <Label v-if="coords" :text="coords" class="coords-label" row="2"/>
      </GridLayout>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import { SelectedPageService } from "../shared/selected-page-service";
import * as geolocation from "@nativescript/geolocation";

export default {
  data() {
    return {
      coords: null, // Variable to store coordinates
    };
  },
  mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Home");
  },
  computed: {
    message() {
      return "<!-- Page content goes here -->";
    }
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    async getCoordinates() {
      try {
        // Ensure location services are enabled
        const isEnabled = await geolocation.isEnabled();
        if (!isEnabled) {
          await geolocation.enableLocationRequest();
        }

        // Get current location
        const location = await geolocation.getCurrentLocation({
          desiredAccuracy: 3, // High accuracy
          updateDistance: 10, // Minimum distance to update
          timeout: 20000 // Timeout in milliseconds
        });

        if (location) {
          console.log(`Latitude: ${location.latitude}, Longitude: ${location.longitude}`);
          this.coords = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
        } else {
          this.coords = "Unable to retrieve location.";
        }
      } catch (error) {
        console.error("Error getting location:", error);
        this.coords = "Error getting location. Please try again.";
      }
    },
    displayCoordinates() {
      if (this.coords) {
        alert(this.coords);
      } else {
        alert("Coordinates not available. Please fetch them first.");
      }
    }
  }
};
</script>

<style scoped lang="scss">
  @import '~/styles/variables/green'; // Import your custom green theme

  .btn {
      margin: 10px;
      background-color: $primary; // Use the green primary color
      color: white;
  }

  .coords-label {
      margin-top: 10px;
      font-size: 16px;
      color: $text-color; // Use the green text color
  }
</style>
