<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <NavigationButton visibility="hidden"/>
      <GridLayout columns="50, *">
        <Label class="action-bar-title" text="Farms" colSpan="2"/>
        <Label class="fas" text.decode="&#xf0c9;" @tap="onDrawerButtonTap"/>
      </GridLayout>
    </ActionBar>

    <!-- Define two rows: row 0 for header content (button, placeholder) and row 1 for the ListView -->
    <GridLayout class="page__content" rows="auto, *" padding="20">
      <!-- Header Row -->
      <Button
        v-if="isLoggedIn"
        text="Add Farm"
        class="add-farm-button"
        @tap="navigateToAddFarm"
        row="0"
      />
      <Label
        v-if="!isLoggedIn"
        class="page__content-placeholder"
        text="Please log in to view your farms."
        row="0"
      />

      <!-- Farms List in the remaining space -->
      <ListView
        v-if="isLoggedIn"
        for="farm in farms"
        class="page__content-list"
        row="1"
      >
        <v-template>
          <StackLayout class="page__content-list-item" @tap="navigateToShowFarm(farm)">
            <Label :text="farm.name" class="farm-name"/>
          </StackLayout>
        </v-template>
      </ListView>
    </GridLayout>
  </Page>
</template>

<script>
  import * as utils from "~/shared/utils";
  import { SelectedPageService } from "~/shared/selected-page-service";
  import { AuthService } from "~/shared/auth-service";
  import { BASE_URL } from "~/shared/config";
  import AddFarm from "./AddFarm";
  import ShowFarm from "./ShowFarm";

  export default {
    data() {
      return {
        farms: [],
        isLoggedIn: !!AuthService.getToken(),
      };
    },
    mounted() {
      SelectedPageService.getInstance().updateSelectedPage("Farms");
      if (this.isLoggedIn) {
        this.fetchFarms();
      }
    },
    methods: {
      onDrawerButtonTap() {
        utils.showDrawer();
      },
      async fetchFarms() {
        try {
          const token = AuthService.getToken();
          if (!token) {
            console.warn("No token found. User is not logged in.");
            return;
          }
          const response = await fetch(`${BASE_URL}/api/farms`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const farmsData = await response.json();
            console.log("Farms Response:", farmsData);
            this.farms = farmsData.map(farm => ({
              id: farm.id,
              name: farm.name,
              coordinates: JSON.parse(farm.coordinates),
            }));
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
      navigateToShowFarm(farm) {
        console.log("Navigating with farm:", farm);
        if (farm) {
          this.$navigateTo(ShowFarm, { props: { farm: farm } });
        } else {
          console.error("No farm data available!");
        }
      }
    },
  };
</script>

<style scoped lang="scss">
  @import '~/styles/variables/green';

  .page__content-placeholder {
    font-size: 18px;
    text-align: center;
    margin-top: 20px;
    color: $text-color;
  }

  .page__content-list {
    margin-top: 20px;
  }

  .page__content-list-item {
    font-size: 16px;
    padding: 10px;
    border-bottom-width: 1px;
    border-bottom-color: $accent;
  }

  .farm-name {
    font-weight: bold;
    color: $primary;
  }

  .add-farm-button {
    margin-bottom: 20px;
    font-size: 18px;
    background-color: $primary;
    color: white;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
  }
</style>
