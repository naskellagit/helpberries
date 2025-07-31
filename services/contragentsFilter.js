const contragentsFilter = (data) => {
  const regex = /^(ООО|ИП)(?=\s|["'])/
  const result = data.filter(el => regex.test(el.name))
  result.sort((a, b) => {
    if(a.name < b.name) return -1
    if(a.name > b.name) return 1
    return 0
  })
  return result
}

module.exports = contragentsFilter