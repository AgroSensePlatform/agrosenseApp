<template lang="html">
    <GridLayout rows="auto, *" class="nt-drawer__content">
        <StackLayout row="0" class="nt-drawer__header">
            <Image class="nt-drawer__header-image fas t-36" src.decode="font://&#xf2bd;"/>
            <Label class="nt-drawer__header-brand" :text="userName || 'User Name'"/> <!-- Dynamically display user name -->
            <Label class="nt-drawer__header-footnote" :text="userEmail || 'username@mail.com'"/> <!-- Dynamically display user email -->
        </StackLayout>

        <ScrollView row="1" class="nt-drawer__body">
            <StackLayout>
                <!-- Navigation items -->
                <GridLayout columns="auto, *"
                            :class="'nt-drawer__list-item' + (selectedPage === 'Home' ? ' -selected': '')"
                            @tap="onNavigationItemTap(Home)">
                    <Label col="0" text.decode="&#xf015;" class="nt-icon fas"/>
                    <Label col="1" text="Home" class="p-r-10"/>
                </GridLayout>

                <GridLayout columns="auto, *"
                            :class="'nt-drawer__list-item' + (selectedPage === 'Farms' ? ' -selected': '')"
                            @tap="onNavigationItemTap(Farms)">
                    <Label col="0" text.decode="&#xf722;" class="nt-icon fas"/> <!-- Updated icon -->
                    <Label col="1" text="My Farms" class="p-r-10"/>
                </GridLayout>

                <GridLayout columns="auto, *"
                            :class="'nt-drawer__list-item' + (selectedPage === 'Sensors' ? ' -selected': '')"
                            @tap="onNavigationItemTap(Sensors)">
                    <Label col="0" text.decode="&#xf2db;" class="nt-icon fas"/> <!-- Updated icon -->
                    <Label col="1" text="Sensors" class="p-r-10"/>
                </GridLayout>

                <GridLayout columns="auto, *"
                            :class="'nt-drawer__list-item' + (selectedPage === 'Featured' ? ' -selected': '')"
                            @tap="onNavigationItemTap(Featured)">
                    <Label col="0" text.decode="&#xf005;" class="nt-icon fas"/>
                    <Label col="1" text="Featured" class="p-r-10"/>
                </GridLayout>

                <StackLayout class="hr"/>

                <GridLayout  columns="auto, *"
                            :class="'nt-drawer__list-item' + (selectedPage === 'Login' ? ' -selected': '')"
                            @tap="onNavigationItemTap(Login)">
                    <Label col="0" text.decode="&#xf2f6;" class="nt-icon fas"/> <!-- Login icon -->
                    <Label col="1" text="Login" class="p-r-10"/>
                </GridLayout>

                <GridLayout v-if="isLoggedIn" columns="auto, *"
                            :class="'nt-drawer__list-item' + (selectedPage === 'MyAccount' ? ' -selected': '')"
                            @tap="onNavigationItemTap(MyAccount)">
                    <Label col="0" text.decode="&#xf406;" class="nt-icon fas"/> <!-- My Account icon -->
                    <Label col="1" text="My Account" class="p-r-10"/>
                </GridLayout>

                <GridLayout  columns="auto, *"
                            :class="'nt-drawer__list-item' + (selectedPage === 'Logout' ? ' -selected': '')"
                            @tap="onNavigationItemTap(Logout)">
                    <Label col="0" text.decode="&#xf2f5;" class="nt-icon fas"/> <!-- Logout icon -->
                    <Label col="1" text="Logout" class="p-r-10"/>
                </GridLayout>
            </StackLayout>
        </ScrollView>
    </GridLayout>
</template>

<script>
  import Home from "./Home";
  import Farms from "./Farms";
  import Featured from "./Featured";
  import Sensors from "./Sensors";
  import Settings from "./Settings";
  import Login from "./Login";
  import MyAccount from "./MyAccount";
  import Logout from "./Logout";
  import * as utils from "~/shared/utils";
  import { SelectedPageService } from "~/shared/selected-page-service";
  import { AuthService } from "~/shared/auth-service"; // Import AuthService for token management
  import { BASE_URL } from "../shared/config"; // Import BASE_URL from the shared config



  export default {
    mounted() {
      SelectedPageService.getInstance().selectedPage$
        .subscribe((selectedPage) => this.selectedPage = selectedPage);

      this.fetchUserDetails(); // Fetch user details when the component is mounted

      // Listen for the user-logged-in event
      this.$root.$on("user-logged-in", this.handleUserLogin);
      //this.$root.$on("user-logged-out", this.handleUserLogout); // Listen for logout event
    },
    beforeDestroy() {
      // Clean up the event listener
      this.$root.$off("user-logged-in", this.handleUserLogin);
      //this.$root.$off("user-logged-out", this.handleUserLogout);
    },
    data() {
      return {
        Home: Home,
        Farms: Farms,
        Featured: Featured,
        Sensors: Sensors,
        Settings: Settings,
        Login: Login,
        MyAccount: MyAccount,
        Logout: Logout,
        selectedPage: "",
        userName: null, // Store the user's name
        userEmail: null, // Store the user's email
      };
    },
    computed: {
      isLoggedIn() {
        return !!AuthService.getToken(); // Check if a token exists
      },
    },
    components: {
      Home,
      Farms,
      Featured,
      Sensors,
      Settings,
      Login,
      MyAccount,
      Logout
    },
    methods: {
      onNavigationItemTap(component) {
        this.$navigateTo(component, {
          clearHistory: true
        });
        utils.closeDrawer();
      },
      async fetchUserDetails() {
        //log a message
        console.log("Fetching user details...");
        try {
          const token = AuthService.getToken(); // Get the token from AuthService
          if (!token) {
            console.warn("No token found. User is not logged in.");
            return;
          }

          const response = await fetch(`${BASE_URL}/api/user`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const userData = await response.json();
            this.userName = userData.name; // Update the user's name
            this.userEmail = userData.email; // Update the user's email
          } else {
            console.error("Failed to fetch user details:", await response.text());
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      },
      handleUserLogout() {
        //log a message
        console.log("User logged out. Clearing user details.");
        // Clear user details and update the UI
        this.userName = null;
        this.userEmail = null;
        this.selectedPage = "Home"; // Optionally reset the selected page
        this.isLoggedInState = false; // Update the reactive login state
      },
      handleUserLogin() {
        //log a message
        alert("User logged in. Fetching user details.");
        console.log("User logged in. Fetching user details.");
        this.fetchUserDetails();
      },
    },
  };
</script>

<style scoped lang="scss">
    @import '~/styles/variables/green'; // Import your custom green theme

    .nt-drawer__header {
        background-color: $primary; // Use the green primary color
        color: white;
    }

    .nt-drawer__list-item {
        color: $text-color; // Use the green text color
    }

    .nt-drawer__list-item.-selected {
        background-color: $accent; // Use the green accent color
    }
</style>
