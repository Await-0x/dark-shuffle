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
          battles_won,
          active_battle_id
        }
      }
    }
  }
  `
  const res = await request(dojoConfig.toriiUrl, document)

  return res?.gameModels?.edges[0]?.node
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

  return res?.draftCardModels?.edges.map(edge => edge.node)
}

export async function getDraftEntropy(game_id, number) {
  const document = gql`
  {
    draftEntropyModels(where:{game_id:${game_id},number:${number}}) {
      edges {
        node {
          game_id,
          number,
          block_number,
          block_hash
        }
      }
    }
  }
  `
  const res = await request(dojoConfig.toriiUrl, document)

  return res?.draftEntropyModels?.edges[0]?.node
}

export async function getBattleState(battle_id) {
  const document = gql`
  {
    battleModels(where:{battle_id:${battle_id}}) {
      edges {
        node {
          battle_id
          game_id,
          round,
          deck_iteration,
          card_index,
          hero_health,
          hero_energy,
          monster_id,
          monster_attack,
          monster_health
        }
      }
    }

    creatureModels(where:{battle_id:${battle_id}}) {
      edges {
        node {
          battle_id
          creature_id,
          card_id,
          cost,
          attack,
          health,
          shield,
          resting_round
        }
      }
    }

    handCardModels(where:{battle_id:${battle_id}}) {
      edges {
        node {
          battle_id
          hand_card_number,
          card_id,
        }
      }
    }

    battleEffectsModels(where:{battle_id:${battle_id}}) {
      edges {
        node {
          battle_id
          cards_discarded,
          creatures_played,
          spells_played,
          demons_played,
          next_spell_reduction,
          dead_creatures,
        }
      }
    }

    roundEffectsModels(where:{battle_id:${battle_id}}) {
      edges {
        node {
          battle_id,
          creatures_played,
        }
      }
    }
  }
  `
  const res = await request(dojoConfig.toriiUrl, document)

  const result = {
    battle: res?.battleModels?.edges[0]?.node,
    creatures: res?.creatureModels?.edges.map(edge => edge.node),
    handCards: res?.handCardModels?.edges.map(edge => edge.node),
    battleEffects: res?.battleModels?.edges[0]?.node,
    roundEffects: res?.battleModels?.edges[0]?.node
  }

  return result
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

  return res?.leaderboardModels?.edges.map(edge => edge.node)
}