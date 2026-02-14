/* ========================================
   ALERTS MODULE
   Fetches and displays NPS alerts
   ======================================== */

import { ApiService } from './api.js';

export const AlertsModule = {
  
  // Fetch alerts for a park from NPS API
  async fetchAlerts(parkCode) {
    try {
      const data = await ApiService.getAlerts(parkCode);
      return data.data || [];
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
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
