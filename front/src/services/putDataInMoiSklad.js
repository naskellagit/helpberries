import API_URL from "../../config"
const putDataInMoiSklad = async() => {
  await fetch(`${API_URL}/moiSklad`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export default putDataInMoiSklad