/* ========================================
   ALERTS MODULE
   Fetches and displays NPS alerts
   Placeholder for API integration
   ======================================== */

export const AlertsModule = {
  
  // Fetch alerts for a park
  // TODO: Integrate with NPS API
  async fetchAlerts(parkCode) {
    // Mock data - replace with NPS API call
    // Example: https://developer.nps.gov/api/v1/alerts?parkCode=${parkCode}&api_key=${API_KEY}
    return [
      {
        title: 'Trail Closure',
        description: 'Paradise Road is closed for winter season.',
        category: 'Closure'
      }
    ];
  },
  
  // Display alerts
  displayAlerts(alerts) {
    const alertsContent = document.getElementById('alerts-content');
    if (!alertsContent) return;
    
    if (!alerts || alerts.length === 0) {
      alertsContent.innerHTML = '<p>No current alerts for this park.</p>';
      return;
    }
    
    alertsContent.innerHTML = alerts.map(alert => `
      <div class="alert-item">
        <h4>${alert.title}</h4>
        <p><strong>Category:</strong> ${alert.category}</p>
        <p>${alert.description}</p>
      </div>
    `).join('');
  },
  
  // Initialize alerts for park
  async initAlerts(parkCode) {
    const alerts = await this.fetchAlerts(parkCode);
    this.displayAlerts(alerts);
  }
};
