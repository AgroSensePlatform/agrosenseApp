<template lang="html">
    <RadSideDrawer ref="drawer" drawerLocation="Left" gesturesEnabled="true" @drawerOpened="onDrawerOpened" :drawerTransition="transition">
        <StackLayout ~drawerContent backgroundColor="#ffffff">
            <DrawerContent ref="drawerContent" />
        </StackLayout>
        <Frame ~mainContent ref="drawerMainContent">
            <Home/>
        </Frame>
    </RadSideDrawer>
</template>

<script>
  import DrawerContent from './DrawerContent'
  import Home from './Home'
  import { SlideInOnTopTransition } from 'nativescript-ui-sidedrawer';
  import { AuthService } from "~/shared/auth-service"; // Import AuthService for token management


  export default {
    data() {
      return {
        transition: new SlideInOnTopTransition()
      }
    },

    components: {
      DrawerContent,
      Home
    },

    methods: {
      onDrawerOpened() {
        console.log("Drawer has fully opened");
        // Refresh the token or state
        const token = AuthService.getToken();
        if (token) {
          console.log("User is logged in");
        } else {
          console.log("User is not logged in");
        }
        // Optionally, you can emit an event to notify DrawerContent to refresh
        this.$refs.drawerContent.refreshState();
      }
    }
  }
</script>

<style scoped lang="scss">
    // Start custom common variables
    @import '~/styles/variables/green';
    // End custom common variables

    // Custom styles
</style>
