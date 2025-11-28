// Este archivo contiene funciones para interactuar con la API del backend
// En un entorno real, estas funciones harían peticiones HTTP al backend

import { Loan } from "./types"
import { HttpService } from "./http"
// Usuarios
export async function fetchUsers() {
  // En un entorno real, esto haría una petición GET a la API
  // const response = await fetch('/api/users')
  // return response.json()

  // Por ahora, devolvemos datos de ejemplo
  return []
}

export async function fetchUser(id: string) {
  // const response = await fetch(`/api/users/${id}`)
  // return response.json()
  return {}
}

export async function createUser(data: any) {
  // const response = await fetch('/api/users', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  // return response.json()
  return {}
}

export async function updateUser(id: string, data: any) {
  // const response = await fetch(`/api/users/${id}`, {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  // return response.json()
  return {}
}

export async function deleteUser(id: string) {
  // await fetch(`/api/users/${id}`, { method: 'DELETE' })
  return {}
}

// Motocicletas
export async function fetchMotorcycles() {
  // const response = await fetch('/api/motorcycles')
  // return response.json()
  return []
}

export async function fetchMotorcycle(id: string) {
  // const response = await fetch(`/api/motorcycles/${id}`)
  // return response.json()
  return {}
}

export async function createMotorcycle(data: any) {
  // const response = await fetch('/api/motorcycles', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  // return response.json()
  return {}
}

export async function updateMotorcycle(id: string, data: any) {
  // const response = await fetch(`/api/motorcycles/${id}`, {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  // return response.json()
  return {}
}

export async function deleteMotorcycle(id: string) {
  // await fetch(`/api/motorcycles/${id}`, { method: 'DELETE' })
  return {}
}

// contratos
/* export async function fetchLoans() {
  const authCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('authToken='))
    ?.split('=')[1];
  console.log(authCookie);
  const response = await HttpService.get('/api/v1/loans', {
    headers: {
      Authorization: authCookie,
    }
  });
  console.log(response.data);
  return response.data;
} */

export async function fetchLoan(id: string): Promise<Loan> {
  const authCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('authToken='))
    ?.split('=')[1];
  const response = await HttpService.get(`/api/v1/loans/${id}`, {
    headers: {
      Authorization: authCookie, 
    }
  });
  console.log(response.data);
  return response.data;
}

export async function createLoan(data: any) {
  // const response = await fetch('/api/loans', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  // return response.json()
  return {}
}

export async function updateLoan(id: string, data: any) {
  // const response = await fetch(`/api/loans/${id}`, {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  // return response.json()
  return {}
}

export async function deleteLoan(id: string) {
  // await fetch(`/api/loans/${id}`, { method: 'DELETE' })
  return {}
}

// Cuotas
export async function fetchInstallments() {
  // const response = await fetch('/api/installments')
  // return response.json()
  return []
}

export async function fetchInstallment(id: string) {
  // const response = await fetch(`/api/installments/${id}`)
  // return response.json()
  return {}
}

export async function createInstallment(data: any) {
  // const response = await fetch('/api/installments', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
  // return response.json()
  return {}
}

// Dashboard
export async function fetchDashboardStats() {
  // const response = await fetch('/api/dashboard/stats')
  // return response.json()
  return {}
}

export async function fetchRecentLoans() {
  // const response = await fetch('/api/dashboard/recent-loans')
  // return response.json()
  return []
}
