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
