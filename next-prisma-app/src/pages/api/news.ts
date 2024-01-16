import { NextApiRequestWithUserId } from 'src/types'
import authGuard from 'src/utils/authGuard'
import checkFields from 'src/utils/checkFields'
import prisma from 'src/utils/prisma'
import { News } from '@prisma/client'
import { NextApiResponse } from 'next'
import nextConnect from 'next-connect'

const newsHandler = nextConnect<NextApiRequestWithUserId, NextApiResponse>()

newsHandler.post(async (req, res) => {

    const data: Pick<News, 'date' | 'title' | 'excerpt' | 'content' | 'img' | 'authorId'> = JSON.parse(
      req.body
    )

    if (!checkFields(data, ['date', 'title', 'excerpt', 'content', 'img'])) {
      res.status(400).json({ message: 'Some required fields are missing' })
    }

    data.authorId = req.userId

    try {
      const news = await prisma.news.create({
        data
      })
      res.status(200).json(news)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: 'Service create error' })
    }
})

newsHandler.put(async (req, res) => {
  const data: Pick<News, 'date' | 'title' | 'excerpt' | 'content' | 'img'> & {
    newsId: string
  } = JSON.parse(req.body)

  if (!checkFields(data, ['date', 'title', 'excerpt', 'content', 'img'])) {
    res.status(400).json({ message: 'Some required fields are missing' })
  }

  try {
    const news = await prisma.news.update({
      where: {
        id_authorId: { id: data.newsId, authorId: req.userId }
      },
      data: {
        date: data.date,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        img: data.img
      }
    })
    res.status(200).json(news)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Update news error' })
  }
})

newsHandler.delete(async (req, res) => {
  const id = req.query.id as string

  if (!id) {
    return res.status(400).json({
      message: 'News ID is missing'
    })
  }

  try {
    const news = await prisma.news.delete({
      where: {
        id_authorId: {
          id,
          authorId: req.userId
        }
      }
    })
    res.status(200).json(news)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'news remove error' })
  }
})

export default authGuard(newsHandler)
