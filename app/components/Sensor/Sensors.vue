<template>
    <Page class="page">
      <ActionBar class="action-bar">
        <NavigationButton visibility="hidden"/>
        <GridLayout columns="50, *">
          <Label class="action-bar-title" text="Sensors" colSpan="2"/>

          <Label class="fas" text.decode="&#xf0c9;" @tap="onDrawerButtonTap"/>
        </GridLayout>
      </ActionBar>

        <GridLayout class="page__content" rows="auto, *" padding="20">
            <Label v-if="!isLoggedIn" class="page__content-placeholder" text="Please log in to view your sensors." row="0"/>

            <ListView
                v-if="isLoggedIn"
                for="sensor in sensors"
                class="page__content-list fullwidth"
                row="1"
            >
                <v-template>
                    <StackLayout @tap="navigateToSensorDetails(sensor.id)" class="sensor-item-margin">
                        <SensorItem :sensor="sensor" />
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
  import SensorItem from "~/components/Sensor/SensorItem"; // Import the SensorItem component
  import SensorShow from "~/components/Sensor/SensorShow"; // Import the SensorShow component

  export default {
    components: {
      SensorItem, // Register SensorItem
      SensorShow, // Register SensorShow
    },
    data() {
      return {
        sensors: [],
        isLoggedIn: !!AuthService.getToken(),
      };
    },
    mounted() {
      SelectedPageService.getInstance().updateSelectedPage("Sensors");
      if (this.isLoggedIn) {
        this.fetchSensors();
      }
    },
    methods: {
      onDrawerButtonTap() {
        utils.showDrawer();
      },
      navigateToSensorDetails(sensorId) {
        this.$navigateTo(SensorShow, {
          props: { sensorId: sensorId }
        });
      },
      async fetchSensors() {
        try {
          const token = AuthService.getToken();
          if (!token) {
            console.warn("No token found. User is not logged in.");
            return;
          }
          const response = await fetch(`${BASE_URL}/api/sensors`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const sensorsData = await response.json();
            console.log("Sensors Response:", sensorsData);
            this.sensors = sensorsData.map(sensor => ({
              id: sensor.id,
              code: sensor.code,
              last_measurement: sensor.last_measurement,
              lat: sensor.lat,
              lon: sensor.lon,
            }));
          } else {
            console.error("Failed to fetch sensors:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching sensors:", error);
        }
      },
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
        margin-bottom: 20px;
        width: 100%;
    }

    .sensor-item-margin {
        margin-bottom: 15px;
    }
</style>
