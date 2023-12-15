import { NextApiRequestWithUserId } from 'src/types'
import authGuard from 'src/utils/authGuard'
import checkFields from 'src/utils/checkFields'
import prisma from 'src/utils/prisma'
import { Statement } from '@prisma/client'
import { NextApiResponse } from 'next'
import nextConnect from 'next-connect'

const statementHandler = nextConnect<NextApiRequestWithUserId, NextApiResponse>()

statementHandler.post(async (req, res) => {

    const data: Pick<Statement, 'dateReceiving' | 'diskNumber' | 'outputName' | 'inputName' | 'deedNumber' | 'notes' | 'authorId'> = JSON.parse(
      req.body
    )

    if (!checkFields(data, ['dateReceiving', 'diskNumber', 'outputName', 'inputName', 'deedNumber', 'notes'])) {
      res.status(400).json({ message: 'Some required fields are missing' })
    }

    data.authorId = req.userId

    try {
      const statement = await prisma.statement.create({
        data
      })
      res.status(200).json(statement)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: 'Service create error' })
    }
})

statementHandler.put(async (req, res) => {
  const data: Pick<Statement, 'dateReceiving' | 'diskNumber' | 'outputName' | 'inputName' | 'deedNumber' | 'notes'> & {
    statementId: string
  } = JSON.parse(req.body)

  if (!checkFields(data, ['dateReceiving', 'diskNumber', 'outputName', 'inputName', 'deedNumber', 'notes'])) {
    res.status(400).json({ message: 'Some required fields are missing' })
  }

  try {
    const statement = await prisma.statement.update({
      where: {
        id_authorId: { id: data.statementId, authorId: req.userId }
      },
      data: {
        dateReceiving: data.dateReceiving,
        diskNumber: data.diskNumber,
        outputName: data.outputName,
        inputName: data.inputName,
        deedNumber: data.deedNumber,
        notes: data.notes
      }
    })
    res.status(200).json(statement)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Update statement error' })
  }
})

statementHandler.delete(async (req, res) => {
  const id = req.query.id as string

  if (!id) {
    return res.status(400).json({
      message: 'Statement ID is missing'
    })
  }

  try {
    const statement = await prisma.statement.delete({
      where: {
        id_authorId: {
          id,
          authorId: req.userId
        }
      }
    })
    res.status(200).json(statement)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Statement remove error' })
  }
})

export default authGuard(statementHandler)
