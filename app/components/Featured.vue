<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden"/>
      <GridLayout columns="50, *">
        <Label class="action-bar-title" text="Featured" colSpan="2"/>
        <Label class="fas" text.decode="&#xf0c9;" @tap="onDrawerButtonTap"/>
      </GridLayout>
    </ActionBar>

    <GridLayout class="page__content">
        <Label class="page__content-icon fas" text.decode="&#xf005;"/>
        <Label class="page__content-placeholder" :text="message"/>
        <!-- Add MapboxView here -->
        <MapboxView
          height="300"
          :accessToken="accessToken"
          mapStyle="streets"
          latitude="37.7749"
          longitude="-122.4194"
          zoomLevel="10"
          showUserLocation="true"
        />
    </GridLayout>
  </Page>
</template>

<script>
  import * as utils from "~/shared/utils";
  import { SelectedPageService } from "../shared/selected-page-service";
  import { BASE_URL, MAPBOX_ACCESS_TOKEN } from "../shared/config";


  export default {
    mounted() {
      SelectedPageService.getInstance().updateSelectedPage("Featured");
    },
    computed: {
      message() {
        return "<!-- Page content goes here -->";
      }
    },
    data() {
      return {
        accessToken: MAPBOX_ACCESS_TOKEN,
      };
    },
    methods: {
      onDrawerButtonTap() {
        utils.showDrawer();
      }
    }
  };
</script>

<style scoped lang="scss">
  // Start custom common variables
  @import '~/styles/variables/green';
  // End custom common variables

  // Custom styles
</style>
