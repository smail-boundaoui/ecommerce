import { MongoClient } from "mongodb"

const connect = async () => await new MongoClient(process.env.MONGODB_URI).connect()

export const insert = async (collection, ...document) => {
  const client = await connect()
  const result = await client.db().collection(collection).insertMany(document)
  client.close()
  return result
}

export const updateOne = async (collection, filter, document) => {
  const client = await connect()
  const result = await client.db().collection(collection).updateOne(filter, document)
  client.close()
  return result
}

export const updateMany = async (collection, filter, document) => {
  const client = await connect()
  const result = await client.db().collection(collection).updateMany(filter, document)
  client.close()
  return result
}

export const deleteOne = async (collection, filter) => {
  const client = await connect()
  const result = await client.db().collection(collection).deleteOne(filter)
  client.close()
  return result
}

export const deleteMany = async (collection, filter) => {
  const client = await connect()
  const result = await client.db().collection(collection).deleteMany(filter)
  client.close()
  return result
}

export const findOne = async (collection, filter, options) => {
  const client = await connect()
  const result = await client.db().collection(collection).findOne(filter, options)
  client.close()
  return result
}

export const findMany = async (collection, filter, options) => {
  const client = await connect()
  const result = await client.db().collection(collection).find(filter, options).toArray()
  client.close()
  return result
}
