import API_URL from "../../config"
const putItem = async(data) => {
  await fetch(`${API_URL}/row/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export default putItem