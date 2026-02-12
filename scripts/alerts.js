// Alerts Module - fetches and displays NPS alerts (placeholder for API integration)
export const AlertsModule = {
  
  // Fetch alerts for a park (placeholder - would use NPS API)
  async fetchAlerts(parkCode) {
    // Placeholder: In production, this would call NPS API
    // Example: https://developer.nps.gov/api/v1/alerts?parkCode=${parkCode}&api_key=${API_KEY}
    
    // Mock data for now
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
      <div class="alert-item" style="background: var(--alpine-sky); padding: 1rem; margin-bottom: 1rem; border-radius: var(--radius);">
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
