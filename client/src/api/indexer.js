import { request, gql } from 'graphql-request'
import { API_ENDPOINT } from '.';

export async function getActiveDraft(address) {
  const document = gql`
  {
    draftComponents(where:{player:"${address}", active: 1}) {
      edges {
        node {
          id
          player
          card_count
          entity {
            createdAt
            updatedAt
          }
        }
      }
    }
  }
  `
  const res = await request(API_ENDPOINT, document)

  return res?.data?.draftComponents?.edges[0]
}

export async function getDraftOptions(draftId, count) {
  const document = gql`
  {
    draftoptionaComponents(where:{draft_id:${draftId}, numberGTE: ${count}}) {
      edges {
        node {
          draft_id
          number
          card {
            id
            name
            cost
            attack
            health
          }
        }
      }
    }
  }
  `
  const res = await request(API_ENDPOINT, document)

  return res?.data?.draftComponents?.edges
}