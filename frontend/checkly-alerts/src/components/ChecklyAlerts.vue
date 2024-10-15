<template>
    <div class="container">
      <h1>Checkly Alerts</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Alert Title</th>
            <th>Alert Type</th>
            <th>Check Name</th>
            <th>Check Type</th>
            <th>Run Location</th>
            <th>Created At</th>
            <th>AI Summary</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alert in alerts" :key="alert.id">
            <td>{{ alert.id }}</td>
            <td>{{ alert.value.alertTitle }}</td>
            <td>{{ alert.value.alertType }}</td>
            <td>{{ alert.value.checkName }}</td>
            <td>{{ alert.value.checkType }}</td>
            <td>{{ alert.value.runLocation }}</td>
            <td>{{ new Date(alert.created_at).toLocaleString() }}</td>
            <td>
              <div v-if="alert.value.aiSummary">
                <p><strong>Log Summary:</strong> {{ alert.value.aiSummary.log_summary }}</p>
                <p><strong>Script Analysis:</strong> {{ alert.value.aiSummary.script_analysis }}</p>
                <p><strong>Root Cause:</strong> {{ alert.value.aiSummary.root_cause }}</p>
                <p><strong>Suggested Fix:</strong> {{ alert.value.aiSummary.suggested_fix }}</p>
              </div>
              <div v-else>
                <p>No AI Summary available</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        alerts: []
      };
    },
    async created() {
      try {
        const response = await fetch('/checkly/alerts');
        this.alerts = await response.json();
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  tr:hover {
    background-color: #f1f1f1;
  }
  </style>