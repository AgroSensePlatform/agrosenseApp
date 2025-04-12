<template>
  <Page class="page">
    <ActionBar title="Sensor Details">
      <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="goBack" />
    </ActionBar>

    <ScrollView>
      <StackLayout class="page__content" padding="20">
        <!-- 1. Display Last Measurement -->
        <Label v-if="sensor && sensor.measurements && sensor.measurements.length > 0" class="measurement-header" text="Last Measurement" />
        <StackLayout v-if="sensor && sensor.measurements && sensor.measurements.length > 0" class="measurement-details">
          <Label :text="`Humidity: ${sensor.measurements[0].humidity}%`" class="measurement-value" />
          <Label :text="`Timestamp: ${sensor.measurements[0].timestamp}`" class="measurement-time" />
        </StackLayout>
        <Label v-else text="No measurements available." class="no-measurements" />

        <!-- 2. Display Map -->
        <MapboxView
          v-if="sensor"
          :accessToken="MAPBOX_ACCESS_TOKEN"
          mapStyle="mapbox://styles/mapbox/satellite-v9"
          :latitude="sensor.lat"
          :longitude="sensor.lon"
          zoomLevel="10"
          height="300"
          class="sensor-map"
          @mapReady="onMapReady"
        />

        <!-- 3. Display All Measurements -->
        <StackLayout v-if="sensor && sensor.measurements && sensor.measurements.length > 0" class="all-measurements">
          <Label text="All Measurements" class="measurements-header" />

          <StackLayout
            v-for="(measurement, index) in sensor.measurements"
            :key="index"
            class="measurement-item"
          >
            <Label :text="`Humidity: ${measurement.humidity}%`" class="measurement-value" />
            <Label :text="`Timestamp: ${measurement.timestamp}`" class="measurement-time" />
            <StackLayout class="separator" v-if="index < sensor.measurements.length - 1"></StackLayout>
          </StackLayout>
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import * as utils from "~/shared/utils";
import { SelectedPageService } from "~/shared/selected-page-service";
import { AuthService } from "~/shared/auth-service";
import { MAPBOX_ACCESS_TOKEN, BASE_URL } from "~/shared/config";

export default {
  components: {},
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
    goBack() {
      this.$navigateBack();
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
    margin-bottom: 20px;
    margin-top: 10px;
  }

  .all-measurements {
    margin-top: 20px;
  }

  .measurements-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .measurement-item {
    margin-bottom: 15px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 5px;
    border-width: 1px;
    border-color: $accent;
  }

  .separator {
    height: 1px;
    background-color: $accent;
    margin: 5px 0;
  }
</style>
