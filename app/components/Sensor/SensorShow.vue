<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden"/>
      <GridLayout columns="50, *">
        <Label class="action-bar-title" text="Sensor Details" colSpan="2"/>
        <Label class="fas" text.decode="&#xf0c9;" @tap="onDrawerButtonTap"/>
      </GridLayout>
    </ActionBar>

    <ScrollView>
      <StackLayout class="page__content" padding="20">
        <!-- Display Last Measurement -->
        <Label v-if="sensor && sensor.measurements && sensor.measurements.length > 0" class="measurement-header" text="Last Measurement" />
        <StackLayout v-if="sensor && sensor.measurements && sensor.measurements.length > 0" class="measurement-details">
          <Label :text="`Humidity: ${sensor.measurements[0].humidity}%`" class="measurement-value" />
          <Label :text="`Timestamp: ${sensor.measurements[0].timestamp}`" class="measurement-time" />
        </StackLayout>
        <Label v-else text="No measurements available." class="no-measurements" />

        <!-- Display Map - UPDATED COMPONENT NAME -->
        <MapboxView
          v-if="sensor"
          :accessToken="MAPBOX_ACCESS_TOKEN"
          mapStyle="mapbox://styles/mapbox/streets-v11"
          :latitude="sensor.lat"
          :longitude="sensor.lon"
          zoomLevel="10"
          class="sensor-map"
          @mapReady="onMapReady"
        />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import { SelectedPageService } from "~/shared/selected-page-service";
import { AuthService } from "~/shared/auth-service";
import { MAPBOX_ACCESS_TOKEN, BASE_URL } from "~/shared/config";
// Remove this import
// import { Mapbox } from "@nativescript-community/ui-mapbox";

export default {
  // Update component registration - remove Mapbox or use plugin's correct registration
  components: {
    // Mapbox is likely registered globally, so we can remove this
  },
  props: {
    sensorId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      sensor: null,
      MAPBOX_ACCESS_TOKEN: MAPBOX_ACCESS_TOKEN,
    };
  },
  async mounted() {
    SelectedPageService.getInstance().updateSelectedPage("Sensor Details");
    await this.fetchSensorDetails();
  },
  methods: {
    onDrawerButtonTap() {
      utils.showDrawer();
    },
    async fetchSensorDetails() {
      try {
        const token = AuthService.getToken();
        if (!token) {
          console.warn("No token found. User is not logged in.");
          return;
        }
        const response = await fetch(`${BASE_URL}/api/sensors/${this.sensorId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const sensorData = await response.json();
          console.log("Sensor Details Response:", sensorData);
          this.sensor = sensorData;
        } else {
          console.error("Failed to fetch sensor details:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching sensor details:", error);
      }
    },
    // Add this method to handle map markers
    onMapReady(event) {
      const map = event.object;
      console.log("Map is ready!");

      // Add marker for sensor location
      if (this.sensor) {
        map.addMarkers([{
          lat: this.sensor.lat,
          lng: this.sensor.lon,
          title: `Sensor ${this.sensor.id || this.sensorId}`,
          subtitle: 'Tap for details'
        }]);
      }
    }
  },
};
</script>

<style scoped lang="scss">
  @import '~/styles/variables/green';

  .measurement-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .measurement-details {
    margin-bottom: 20px;
  }

  .measurement-value {
    font-size: 16px;
    color: $primary;
    margin-bottom: 5px;
  }

  .measurement-time {
    font-size: 14px;
    color: $text-color;
  }

  .no-measurements {
    font-size: 16px;
    color: $text-color;
    margin-bottom: 20px;
  }

  .sensor-map {
    height: 300px;
    border: 1px solid $accent;
    border-radius: 5px;
  }
</style>
