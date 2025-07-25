import API_URL from "../../config"
const postItem = async(data) => {
  await fetch(`${API_URL}/row`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export default postItem