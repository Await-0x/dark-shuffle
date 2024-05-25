import { gql, request } from 'graphql-request';
import { dojoConfig } from '../../dojo.config';

export async function getActiveGame(address) {
  const document = gql`
  {
    gameModels (where:{
      active:true,
      player:"${address}"
    }) {
      edges {
        node {
          game_id,
          player,
          active,
          in_draft,
          in_battle,
          battles_won
        }
      }
    }
  }
  `
  const res = await request(dojoConfig.toriiUrl, document)

  return res?.data?.gameModels?.edges[0]?.node
}

export async function getDraftCards(game_id) {
  const document = gql`
  {
    draftCardModels(where:{game_id:${game_id}}) {
      edges {
        node {
          game_id,
          card_id,
          number
        }
      }
    }
  }
  `
  const res = await request(dojoConfig.toriiUrl, document)

  return res?.data?.draftCardModels?.edges.map(edge => edge.node)
}

export async function getLeaderboard(page) {
  let pageSize = 10

  const document = gql`
    {
      leaderboardModels (order:{field:SCORE, direction:DESC}, limit:${pageSize}, offset:${pageSize * page}) {
        edges {
          node {
            player_name,
            score
          }
        }
      }
    }
  `
  const res = await request(dojoConfig.toriiUrl, document)
  console.log(res)
  return res?.leaderboardModels?.edges.map(edge => edge.node)
}