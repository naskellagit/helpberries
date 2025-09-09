import API_URL from "../../config"
const putDataInMoiSklad = async(data) => {
  const res = await fetch(`${API_URL}/moiSklad`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  const result = await res.json()
  return result
}

export default putDataInMoiSklad