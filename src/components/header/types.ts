export interface ILocation {
  currency: string
  department: string
  id: number
  office_id: number
  office_name: string
  office_shortname: string
  country_id: number
}
export interface iReferenceItem {
  id: number
  locations: ILocation[]
  name: string
  shortname: string
}
export interface IReference {
  data: iReferenceItem[]
}
export interface IUser {
  id: number
  samaccountname: string
  displayname: string
  description: string
  location: {
    id: number
    office_id: number
    department: string
    office_shortname: string
    office_name: string
    currency: string
  }
}


