<template>
  <Page class="page">
    <ActionBar title="Farm Details">
      <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="goBack" />
    </ActionBar>
    <GridLayout rows="*" class="page__content" padding="20">
      <StackLayout class="farm-details">
        <Label v-if="farm.name" :text="farm.name" class="farm-name" />
        <Label
          v-if="farm.coordinates"
          :text="`Coordinates: ${JSON.stringify(farm.coordinates)}`"
          class="farm-coordinates"
        />
        <Label v-else text="Loading farm details..." />

        <!-- <MapboxView
          ref="mapbox"
          height="300"
          :accessToken="accessToken"
          mapStyle="streets"
          :latitude="currentLat"
          :longitude="currentLon"
          zoomLevel="8"
          row="1"
          @mapReady="onMapReady"
        /> -->


      </StackLayout>
    </GridLayout>
  </Page>
</template>

<script>

export default {
  props: {
    farm: {
      type: Object,
    }
  },

  mounted() {
    console.log("ShowFarm mounted, farm:", this.farm);
    // Directly assign the passed whole farm object to 'farm'
    if (this.farm) {
      console.log("Received farm:", this.farm);
    } else {
      console.error("No farm passed as context.");
    }
  },
  methods: {
    goBack() {
      this.$navigateBack();
    }
  }
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
