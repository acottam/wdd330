/* ========================================
   DAY PLAN MODULE
   Handles localStorage for day plans
   ======================================== */

export const DayPlanModule = {
  
  // Get plans from localStorage
  getPlans() {
    const plans = localStorage.getItem('pnw-day-plans');
    return plans ? JSON.parse(plans) : [];
  },
  
  // Save plans to localStorage
  savePlans(plans) {
    localStorage.setItem('pnw-day-plans', JSON.stringify(plans));
  },
  
  // Create new plan
  createPlan(planData) {
    const plans = this.getPlans();
    const newPlan = {
      id: Date.now(),
      ...planData,
      createdAt: new Date().toISOString()
    };
    plans.push(newPlan);
    this.savePlans(plans);
    return newPlan;
  },
  
  // Update plan
  updatePlan(planId, updatedData) {
    const plans = this.getPlans();
    const index = plans.findIndex(p => p.id === planId);
    if (index !== -1) {
      plans[index] = { ...plans[index], ...updatedData };
      this.savePlans(plans);
      return plans[index];
    }
    return null;
  },
  
  // Delete plan
  deletePlan(planId) {
    const plans = this.getPlans();
    const filtered = plans.filter(p => p.id !== planId);
    this.savePlans(filtered);
  },
  
  // Initialize plan form
  initPlanForm(parks) {
    const form = document.getElementById('plan-form');
    const parkSelect = document.getElementById('plan-park');
    
    if (!form || !parkSelect) return;
    
    // Populate park dropdown
    parks.sort((a, b) => a.name.localeCompare(b.name));
    parks.forEach(park => {
      const option = document.createElement('option');
      option.value = park.name;
      option.textContent = park.name;
      parkSelect.appendChild(option);
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const planData = {
        name: document.getElementById('plan-name').value,
        date: document.getElementById('plan-date').value,
        park: document.getElementById('plan-park').value,
        notes: document.getElementById('plan-notes').value
      };
      
      this.createPlan(planData);
      form.reset();
      this.displayPlans();
      alert('Plan saved successfully!');
    });
  },
  
  // Display saved plans
  displayPlans() {
    const plans = this.getPlans();
    const plansList = document.getElementById('plans-list');
    
    if (!plansList) return;
    
    if (plans.length === 0) {
      plansList.innerHTML = '<p>No saved plans yet. Create your first day plan above!</p>';
      return;
    }
    
    plansList.innerHTML = plans.map(plan => `
      <div class="plan-card">
        <h3>${plan.name}</h3>
        <p><strong>Park:</strong> ${plan.park}</p>
        <p><strong>Date:</strong> ${new Date(plan.date).toLocaleDateString()}</p>
        <p><strong>Notes:</strong> ${plan.notes || 'No notes'}</p>
        <button onclick="DayPlanModule.deletePlan(${plan.id}); DayPlanModule.displayPlans();" class="btn">Delete</button>
      </div>
    `).join('');
  }
};

// Make available globally for onclick handlers
window.DayPlanModule = DayPlanModule;
