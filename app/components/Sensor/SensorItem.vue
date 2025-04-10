<template>
  <StackLayout class="sensor-item">
    <!-- Header -->
    <Label :text="sensor.code" class="sensor-header" />

    <!-- Main Section -->
    <StackLayout class="sensor-main">
      <Label
        v-if="sensor.last_measurement"
        :text="`Value: Humidity ${sensor.last_measurement.humidity}%`"
        class="sensor-value"
      />
      <Label
        v-else
        text="Value: No data available"
        class="sensor-value"
      />
      <Label
        v-if="sensor.last_measurement"
        :text="`Time: ${sensor.last_measurement.timestamp}`"
        class="sensor-time"
      />
    </StackLayout>

    <!-- Footer -->
    <GridLayout class="sensor-footer" columns="*, *">
      <Label :text="`Latitude: ${sensor.lat}`" class="sensor-detail" col="0" />
      <Label :text="`Longitude: ${sensor.lon}`" class="sensor-detail" col="1" />
    </GridLayout>
  </StackLayout>
</template>

<script>
export default {
  props: {
    sensor: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped lang="scss">
.sensor-item {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f0f8ff; /* Light blue background for each sensor */
  border: 1px solid #ddd;
  border-radius: 5px;
}

.sensor-header {
  font-weight: bold;
  font-size: 14px;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

.sensor-main {
  margin-bottom: 10px;
}

.sensor-value {
  font-size: 16px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
}

.sensor-time {
  font-size: 12px;
  color: #555;
  text-align: left;
}

.sensor-footer {
  border-top: 1px solid #ddd;
  padding-top: 5px;
  margin-top: 10px;
}

.sensor-detail {
  font-size: 12px;
  color: #555;
  text-align: left;
}
</style>
