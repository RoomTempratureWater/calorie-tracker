export async function fetchWithDebounce(url: string, debounceMs = 5000) {
  const lastCalled = localStorage.getItem("last-api-call")
  const now = Date.now()

  if (lastCalled && now - parseInt(lastCalled) < debounceMs) {
    console.log("Debounced: Skipping API call")
    return null
  }

  localStorage.setItem("last-api-call", now.toString())

  const res = await fetch(url)
  const data = await res.json()
  return data
}
