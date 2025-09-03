import API_URL from "../../config"
const deleteItem = async(id) => {
  await fetch(`${API_URL}/row/${id}`, {
    method: 'DELETE'
  })
}

export default deleteItem