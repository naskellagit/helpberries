import API_URL from "../../config"
const chooseContragent = async() => {
  const res = await fetch(`${API_URL}/contragents`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  const data = await res.json()
  return data
}

export default chooseContragent