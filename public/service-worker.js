console.log("Service worker loaded")

let uploadStatus = "No file uploaded"
const channel = new BroadcastChannel("uploadChannel")

self.addEventListener("install", (event) => {
  console.log("Service worker installed")
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("Service worker activated")
  clients.claim()
})

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/upload-status")) {
    event.respondWith(new Response(uploadStatus))
  }
})

self.addEventListener("message", async (event) => {
  console.log("Service worker message received")
  const { file, url } = event.data

  const formData = new FormData()
  formData.append("file", file)

  uploadStatus = `Uploading ${file.name}...`
  channel.postMessage(uploadStatus)

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    })

    if (response.ok) {
      uploadStatus = "Upload successful"
    } else {
      uploadStatus = `Upload failed: ${response.statusText}`
    }
  } catch (error) {
    uploadStatus = `Upload error: ${error.message}`
  } finally {
    channel.postMessage(uploadStatus)
  }
})
