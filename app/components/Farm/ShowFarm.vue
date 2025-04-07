<template>
  <Page class="page">
    <ActionBar title="Farm Details">
      <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="goBack" />
    </ActionBar>
    <ScrollView>
      <GridLayout rows="auto, 300, auto, auto" class="page__content" padding="20">
        <StackLayout class="farm-details" row="0">
          <Label v-if="farm.name" :text="farm.name" class="farm-name" />
        </StackLayout>

        <!-- MapboxView -->
        <MapboxView
          v-if="farm.coordinates && farm.coordinates.length > 0"
          ref="mapbox"
          row="1"
          height="300"
          :accessToken="accessToken"
          mapStyle="mapbox://styles/mapbox/satellite-v9"
          :latitude="farm.coordinates[0].lat"
          :longitude="farm.coordinates[0].lon"
          zoomLevel="15"
          @mapReady="onMapReady"
        />

        <!-- Debug Section -->
        <StackLayout row="2" class="debug-section">
          <Button text="Toggle Debug Info" @tap="toggleDebug" class="toggle-debug-button" />

          <StackLayout v-if="showDebug" class="debug-info">
            <Label text="Coordinates JSON:" class="debug-header" />
            <TextView :text="JSON.stringify(farm.coordinates, null, 2)" class="debug-json" editable="false" />

            <Label text="Coordinate Points:" class="debug-header" />
            <StackLayout class="debug-points">
              <Label
                v-for="(coord, index) in farm.coordinates"
                :key="index"
                :text="`Point ${index+1}: Lat: ${coord.lat}, Lon: ${coord.lon}`"
                class="debug-point"
              />
            </StackLayout>
          </StackLayout>
        </StackLayout>

        <!-- Add Sensor Button -->
        <Button
          text="Add Sensor"
          class="add-sensor-button"
          @tap="navigateToAddSensor"
          row="3"
        />
      </GridLayout>
    </ScrollView>
  </Page>
</template>

<script>
import { MAPBOX_ACCESS_TOKEN } from "~/shared/config";
import AddSensor from "~/components/Sensor/AddSensor";

export default {
  props: {
    farm: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      accessToken: MAPBOX_ACCESS_TOKEN,
      map: null,
      showDebug: false,
    };
  },
  mounted() {
    console.log("ShowFarm mounted, farm:", this.farm);
    if (this.farm) {
      console.log("Received farm:", this.farm);
    } else {
      console.error("No farm passed as context.");
    }
  },
  methods: {
    goBack() {
      this.$navigateBack();
    },
    toggleDebug() {
      this.showDebug = !this.showDebug;
    },
    onMapReady(event) {
      this.map = event.object;
      console.log("Map is ready!");

      // Add a line layer connecting the points in the coordinates array
      if (this.farm.coordinates && this.farm.coordinates.length > 1) {
        const points = this.farm.coordinates.map(coord => ({
          lat: coord.lat,
          lng: coord.lon,
        }));

        this.map.addPolyline({
          points: points,
          color: "#0000ff", // Blue color for the line
          width: 3, // Line width
          opacity: 0.8, // Line opacity
        });
      }
    },
    navigateToAddSensor() {
      console.log("Navigating to AddSensor with farm_id:", this.farm.id);
      this.$navigateTo(AddSensor, {
        props: {
          farmId: this.farm.id,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.farm-details {
  padding: 20px;
}
.farm-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}
.debug-section {
  margin-top: 20;
}
.toggle-debug-button {
  margin-top: 10;
  margin-bottom: 10;
  background-color: #555;
  color: white;
  font-size: 14;
}
.debug-info {
  background-color: #f5f5f5;
  padding: 10;
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
.add-sensor-button {
  margin-top: 20;
  background-color: #28a745;
  color: white;
  font-size: 18;
  padding: 10;
  border-radius: 5;
  text-align: center;
}
</style>
