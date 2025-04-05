<template>
    <Page class="page">
      <ActionBar class="action-bar">
        <NavigationButton visibility="hidden"/>
        <GridLayout columns="50, *">
          <Label class="action-bar-title" text="Farms" colSpan="2"/>

          <Label class="fas" text.decode="&#xf0c9;" @tap="onDrawerButtonTap"/>
        </GridLayout>
      </ActionBar>

      <GridLayout class="page__content">

        <StackLayout>
          <Button v-if="isLoggedIn" text="Add Farm" class="add-farm-button" @tap="navigateToAddFarm"/>
        </StackLayout>

        <!-- Placeholder for non-logged-in users -->
        <Label v-if="!isLoggedIn" class="page__content-placeholder" text="Please log in to view your farms."/>

        <!-- Farms List -->
        <ListView v-else for="farm in farms" class="page__content-list">
          <v-template>
            <StackLayout class="page__content-list-item">
              <Label :text="farm.name" class="farm-name"/>
              <Label v-if="farm.coordinates" :text="'Coordinates: ' + farm.coordinates.map(coord => `(${coord.lat}, ${coord.lon})`).join(', ')" class="farm-coordinates"/>
            </StackLayout>
          </v-template>
        </ListView>
      </GridLayout>
    </Page>
</template>

<script>
  import * as utils from "~/shared/utils";
  import { SelectedPageService } from "../shared/selected-page-service";
  import { AuthService } from "../shared/auth-service"; // Import AuthService for token management
  import { BASE_URL } from "../shared/config"; // Import BASE_URL from the shared config

  import AddFarm from "./AddFarm"; // Import the AddFarm component

  export default {
    data() {
      return {
        farms: [], // Store the list of farms
        isLoggedIn: !!AuthService.getToken(), // Check if the user is logged in
      };
    },
    mounted() {
      SelectedPageService.getInstance().updateSelectedPage("Farms");

      if (this.isLoggedIn) {
        this.fetchFarms(); // Fetch farms if the user is logged in
      }
    },
    methods: {
      onDrawerButtonTap() {
        utils.showDrawer();
      },
      async fetchFarms() {
        try {
          const token = AuthService.getToken(); // Get the token from AuthService
          if (!token) {
            console.warn("No token found. User is not logged in.");
            return;
          }

          const response = await fetch(`${BASE_URL}/api/farms`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include the token in the request
            },
          });

          if (response.ok) {
            const farmsData = await response.json(); // Parse the JSON response
            console.log("Farms Response:", farmsData);
            this.farms = farmsData.map(farm => ({
              id: farm.id,
              name: farm.name,
              coordinates: JSON.parse(farm.coordinates), // Parse the coordinates string
            })); // Update the farms list
          } else {
            console.error("Failed to fetch farms:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching farms:", error);
        }
      },
      navigateToAddFarm() {
        this.$navigateTo(AddFarm);
      },
    },
  };
</script>

<style scoped lang="scss">
    @import '~/styles/variables/green'; // Import your custom green theme

    .page__content-placeholder {
        font-size: 18;
        text-align: center;
        margin-top: 20;
        color: $text-color; // Use the green text color
    }

    .page__content-list {
        margin-top: 50;
    }

    .page__content-list-item {
        font-size: 16;
        padding: 10;
        border-bottom-width: 1;
        border-bottom-color: $accent; // Use the green accent color
    }

    .farm-name {
        font-weight: bold;
        color: $primary; // Use the green primary color
    }

    .farm-coordinates {
        font-size: 14;
        color: $text-color; // Use the green text color
    }

    .add-farm-button {
        margin-bottom: 50;
        font-size: 18;
        background-color: $primary; // Use the green primary color
        color: white;
        padding: 10;
        border-radius: 5;
        text-align: center;
    }
</style>
