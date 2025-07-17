import API_URL from "../../config"
const deleteItem = async(id) => {
  const res = await fetch(`${API_URL}/row/${id}`, {
    method: 'DELETE'
  })
  return res
}

export default deleteItem