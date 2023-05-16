import multiparti from "multiparty"

export default async function upload(req, res) {
  const form = new multiparti.Form({
    autoFiles: true,
    uploadDir: process.cwd() + "/public/products_images/"
  })

  const files = await new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      err && reject(err)
      resolve(files)
    })
  })

  res.json(
    files.file.map((file) => {
      return {
        name: file.originalFilename,
        src: `/products_images/${file.path.slice(file.path.lastIndexOf("\\") + 1)}`
      }
    })
  )
}

export const config = { api: { bodyParser: false } }
