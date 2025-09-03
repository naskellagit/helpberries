import API_URL from "../../config"

const getDataFromNet = async(mode) => {
  const response = await fetch(`${API_URL}/rows${mode === 'Сканирование' ? '?deleted=FALSE' : ''}`)
  const data = await response.json()
  return data
}

export default getDataFromNet