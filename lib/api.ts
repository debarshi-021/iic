export interface ComponentCreateRequest {
  component_type: string
  manufacturer: string
  official_zone: string
  batch?: string
  warranty_period_years: number
  date_of_supply: string
}

export interface ComponentCreateResponse {
  success: boolean
  message: string
  uid: string
  fitting: {
    component_id: string
    component_type: string
    manufacturer: string
    official_zone: string
    installation_zone?: string
    traffic_density_gmt: number
    track_curvature: string
    maintenance_history: string
    installation_year?: number
    installation_month?: number
    date_of_supply: string
    installation_date?: string
    warranty_period_years: number
    inspection_dates: string[]
  }
}

export interface MLPredictionRequest {
  uid: string
  component_type: string
  manufacturer: string
  official_zone: string
  installation_zone?: string
  traffic_density_gmt: number
  track_curvature: string
  maintenance_history: string
  installation_year?: number
  installation_month?: number
  date_of_supply: string
  installation_date?: string
  warranty_period_years: number
  inspection_dates: string[]
}

export interface MLPredictionResponse {
  uid: string
  days_to_failure: number
  failure_probability: number
  priority: "Basic" | "Medium" | "Urgent"
  confidence_score: number
  prediction_date: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export class RailwayAPI {
  static async createComponent(data: ComponentCreateRequest): Promise<ComponentCreateResponse> {
    const response = await fetch(`${API_BASE_URL}/vendor/create_component`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Failed to create component")
    }

    return response.json()
  }

  static async checkComponent(uid: string) {
    const response = await fetch(`${API_BASE_URL}/vendor/check_component?uid=${uid}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Component not found")
    }

    return response.json()
  }

  static async getMLPrediction(data: MLPredictionRequest): Promise<MLPredictionResponse> {
    const response = await fetch(`${API_BASE_URL}/ml/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Failed to get ML prediction")
    }

    return response.json()
  }

  static async deployBatch(data: {
    batch_id: string
    zone_code: string
    line_id: string
    km_start: number
    km_end: number
    priority: "Low" | "Medium" | "High"
  }) {
    const response = await fetch(`${API_BASE_URL}/factory/deploy_batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || "Failed to deploy batch")
    }

    return response.json()
  }

  static parseUID(uid: string) {
    const pattern = /^IR(\d{2})-Z(\d{3})-V(\d{3})-B(\d{3})-(\d{6})$/
    const match = uid.match(pattern)

    if (!match) {
      return null
    }

    return {
      year: `20${match[1]}`,
      zone: `Z${match[2]}`,
      vendor: `V${match[3]}`,
      batch: `B${match[4]}`,
      serial: match[5],
    }
  }

  static generateUID(vendorCode: string, batch: string, serial: number, zoneCode = "Z005"): string {
    const currentYear = new Date().getFullYear()
    const yearSuffix = currentYear.toString().slice(-2)

    return `IR${yearSuffix}-${zoneCode}-${vendorCode}-${batch}-${serial.toString().padStart(6, "0")}`
  }
}

export const VENDOR_MAP = {
  V001: "Rahee Track Technologies",
  V002: "Raymond Steel",
  V003: "Eastern Track Udyog",
  V004: "Royal Infraconstru Ltd.",
  V005: "Pooja Industries",
  V006: "Jekay International",
  V007: "Avantika Concrete",
  V008: "Gammon India",
}

export const ZONE_MAP = {
  Z001: "Central Railway (CR)",
  Z002: "Eastern Railway (ER)",
  Z003: "Northern Railway (NR)",
  Z004: "North Eastern Railway (NER)",
  Z005: "Northeast Frontier Railway (NFR)",
  Z006: "Southern Railway (SR)",
  Z007: "South Central Railway (SCR)",
  Z008: "South Eastern Railway (SER)",
  Z009: "Western Railway (WR)",
  Z010: "South Western Railway (SWR)",
  Z011: "North Western Railway (NWR)",
  Z012: "West Central Railway (WCR)",
  Z013: "East Central Railway (ECR)",
  Z014: "East Coast Railway (ECoR)",
  Z015: "North Central Railway (NCR)",
  Z016: "South East Central Railway (SECR)",
  Z017: "Kolkata Metro Railway (KMRC)",
  Z018: "Delhi Metro Rail Corporation (DMRC)",
}
