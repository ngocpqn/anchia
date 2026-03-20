export async function loadBanks(){
  const res = await fetch("https://api.vietqr.io/v2/banks")
  const json = await res.json()

  return json.data.map(b => ({
    name: b.shortName,
    bin: b.bin,
    logo: b.logo
  }))
}