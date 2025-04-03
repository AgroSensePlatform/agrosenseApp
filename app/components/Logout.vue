<template>
    <Page class="page">
      <ActionBar class="action-bar">
        <NavigationButton visibility="hidden"/>
        <GridLayout columns="50, *">
          <Label class="action-bar-title" text="LogOut" colSpan="2"/>

          <Label class="fas" text.decode="&#xf0c9;" @tap="onDrawerButtonTap"/>
        </GridLayout>
      </ActionBar>

        <GridLayout class="page__content">
            <Label class="page__content-icon far" text.decode="&#xf1ea;"/>
            <Label class="page__content-placeholder" text="Logging out..."/>
        </GridLayout>
    </Page>
</template>

<script>
  import * as utils from "~/shared/utils";
  import { SelectedPageService } from "../shared/selected-page-service";
  import { AuthService } from "../shared/auth-service"; // Import the AuthService
  import Home from "./Home"; // Import the Home component
  import { BASE_URL } from "../shared/config"; // Import BASE_URL from the shared config



  export default {
    mounted() {
      SelectedPageService.getInstance().updateSelectedPage("LogOut");
      this.logoutUser(); // Trigger logout when the page is mounted
    },
    methods: {
      onDrawerButtonTap() {
        utils.showDrawer();
      },
      async logoutUser() {
        try {
          const token = AuthService.getToken(); // Get the token from the shared service
          if (!token) {
            alert("No token found. Redirecting to Home.");
            this.$navigateTo(Home);
            return;
          }

          const response = await fetch(`${BASE_URL}/api/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Use the token from AuthService
            },
          });

          if (response.ok) {
            // Clear the token from AuthService
            AuthService.setToken(null);

            // Emit an event to notify other components (e.g., DrawerContent)
            this.$root.$emit("user-logged-out");

            alert("Logged out successfully!");
            // Navigate to the Home page
            this.$navigateTo(Home);
          } else {
            console.error("Logout failed:", await response.text());
            alert("Failed to log out. Please try again.");
          }
        } catch (error) {
          console.error("Error logging out:", error);
          alert("An error occurred while logging out.");
        }
      },
    },
  };
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '~/styles/variables/green';
    // End custom common variables

    .page__content {
        justify-content: center;
        align-items: center;
    }

    .page__content-icon {
        font-size: 48;
        margin-bottom: 20;
    }

    .page__content-placeholder {
        font-size: 18;
        text-align: center;
    }
</style>
