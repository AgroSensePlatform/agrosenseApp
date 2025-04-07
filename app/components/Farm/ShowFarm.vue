<template>
  <Page class="page">
    <ActionBar title="Farm Details">
      <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="goBack" />
    </ActionBar>
    <GridLayout rows="*, 300" class="page__content" padding="20">
      <StackLayout class="farm-details" row="0">
        <Label v-if="farm.name" :text="farm.name" class="farm-name" />

        <!-- MapboxView -->
        <MapboxView
          v-if="farm.coordinates && farm.coordinates.length > 0"
          ref="mapbox"
          row="1"
          height="300"
          :accessToken="accessToken"
          mapStyle="streets"
          :latitude="farm.coordinates[0].lat"
          :longitude="farm.coordinates[0].lon"
          zoomLevel="8"
          @mapReady="onMapReady"
        />

        <Label
          v-if="farm.coordinates"
          :text="`Coordinates: ${JSON.stringify(farm.coordinates)}`"
          class="farm-coordinates"
        />
        <Label v-else text="Loading farm details..." />
      </StackLayout>


    </GridLayout>
  </Page>
</template>

<script>
import { MAPBOX_ACCESS_TOKEN } from "~/shared/config";

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
    onMapReady(event) {
      this.map = event.object;
      console.log("Map is ready!");
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
.farm-coordinates {
  font-size: 18px;
  color: #666;
}
</style>
