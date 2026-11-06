const API_BASE = '/api';

const getHeaders = (isJson = true) => {
  const headers = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = localStorage.getItem('medicare_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Authentication
  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  async login(credentials) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(res);
  },

  async changePassword(passwords) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(passwords),
    });
    return handleResponse(res);
  },

  async forgotPassword(payload) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  // Doctors
  async getDoctors(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.specialization) query.append('specialization', params.specialization);
    if (params.minExperience) query.append('minExperience', params.minExperience);
    if (params.maxFee) query.append('maxFee', params.maxFee);
    if (params.availableOnly) query.append('availableOnly', params.availableOnly);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/doctors${queryString}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getDoctorById(id) {
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getSpecializations() {
    const res = await fetch(`${API_BASE}/doctors/meta/specializations`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async createDoctor(doctorData) {
    const res = await fetch(`${API_BASE}/doctors`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(doctorData),
    });
    return handleResponse(res);
  },

  async updateDoctor(id, doctorData) {
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(doctorData),
    });
    return handleResponse(res);
  },

  async deleteDoctor(id) {
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Appointments
  async bookAppointment(appointmentData) {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(appointmentData),
    });
    return handleResponse(res);
  },

  async getMyAppointments() {
    const res = await fetch(`${API_BASE}/appointments/my`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getAppointmentById(id) {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async cancelAppointment(id, reason = '') {
    const res = await fetch(`${API_BASE}/appointments/${id}/cancel`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ reason }),
    });
    return handleResponse(res);
  },

  async getAllAppointments(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    const res = await fetch(`${API_BASE}/appointments${queryString}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateAppointmentStatus(id, status, notes = '', paymentStatus) {
    const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, notes, paymentStatus }),
    });
    return handleResponse(res);
  },

  // Online Consultations
  async requestConsultation(consultationData) {
    const res = await fetch(`${API_BASE}/consultations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(consultationData),
    });
    return handleResponse(res);
  },

  async getMyConsultations() {
    const res = await fetch(`${API_BASE}/consultations/my`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getConsultationById(id) {
    const res = await fetch(`${API_BASE}/consultations/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getAllConsultations() {
    const res = await fetch(`${API_BASE}/consultations`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateConsultation(id, data) {
    const res = await fetch(`${API_BASE}/consultations/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Admin Dashboard
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async getAdminPatients() {
    const res = await fetch(`${API_BASE}/admin/patients`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async deletePatient(id) {
    const res = await fetch(`${API_BASE}/admin/patients/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
