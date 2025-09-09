import axios from 'axios'
import { IOC } from '@/types/ioc'

export async function fetchIOCs(): Promise<IOC[]> {
  const res = await axios.get<IOC[]>('/iocs.json') // or API 

  
  console.log("Fetched IOCs:", res.data) // 👈 dekh data aa raha ki nahi
  return res.data


  return res.data
}
