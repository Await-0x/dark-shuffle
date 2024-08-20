import { getEntityIdFromKeys } from "@dojoengine/utils";
import { gql, request } from 'graphql-request';
import { dojoConfig } from '../../dojo.config';
import { getNodeStatus } from "../helpers/utilities";

export async function getActiveGame(address) {
  const document = gql`
  {
    darkshuffleGameModels (where:{
      active:true,
      player:"${address}"
    }) {
      edges {
        node {
          game_id,
          player,
          player_name,
          active,
          in_draft,
          in_battle,
          active_battle_id,
          hero_health,
          hero_energy,
          hero_xp,
          branch,
          node_level,
          monsters_slain,
          entropy_count,
        }
      }
    }
  }`

  const res = await request(dojoConfig.toriiUrl, document)

  return res?.darkshuffleGameModels?.edges[0]?.node
}

export async function getDraftCards(game_id) {
  const document = gql`
  {
    darkshuffleDraftCardModels(where:{game_id:${game_id}}) {
      edges {
        node {
          game_id,
          number,
          card_id,
          level
        }
      }
    }
  }
  `
  const res = await request(dojoConfig.toriiUrl, document)

  return res?.darkshuffleDraftCardModels?.edges.map(edge => edge.node)
}

export async function getEntropy(game_id, number) {
  const document = gql`
  {
    darkshuffleEntropyModels(where:{game_id:${game_id},number:${number}}) {
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

  return res?.darkshuffleEntropyModels?.edges[0]?.node
}

export async function getTreeNodes(game_id, branch) {
  const document = gql`
  {
    darkshuffleNodeModels(where:{game_id:${game_id}, branch:${branch}}, limit:100) {
      edges {
        node {
          node_id,
          game_id,
          branch,
          node_type,
          skippable,
          status,
          level,
        }
      }
    }
  }`

  const res = await request(dojoConfig.toriiUrl, document);

  let rawNodes = res?.darkshuffleNodeModels?.edges.map(edge => edge.node);

  let nodes = await Promise.all(
    rawNodes.map(async node => {
      let query = ``
      let entityId = getEntityIdFromKeys([BigInt(node.node_id)])

      query += `entity (id:"${entityId}") {
        models {
          ... on darkshuffle_Node {
            node_id
            parents
          }
        }
      }
    `

      if (node.node_type === 1) {
        query += `entity (id:"${entityId}") {
          models {
            ... on darkshuffle_MonsterNode {
              node_id,
              monster_id,
              attack,
              health
            }
          }
        }
      `
      }

      if (node.node_type === 2 || node.node_type === 3) {
        query += `entity (id:"${entityId}") {
          models {
            ... on darkshuffle_PotionNode {
              node_id,
              amount
            }
          }
        }
      `
      }

      if (node.node_type === 4) {
        query += `entity (id:"${entityId}") {
          models {
            ... on darkshuffle_CardNode {
              node_id,
              card_id,
              card_level
            }
          }
        }
      `
      }

      const _document = gql`{${query}}`;
      const _res = await request(dojoConfig.toriiUrl, _document);
      const objectDetails = _res.entity.models.reduce((acc, obj) => {
        return { ...acc, ...obj };
      }, {});

      return { ...node, ...objectDetails }
    })
  )

  let nodeObject = nodes.map(node => ({
    nodeId: node.node_id,
    gameId: node.game_id,
    branch: node.branch,
    nodeType: node.node_type,
    skippable: node.skippable,
    status: node.status,
    level: node.level,
    parents: node.parents,
    monsterId: node.monster_id,
    type: node.node_type === 1 ? 'monster' : node.node_type === 2 ? 'potion' : node.node_type === 3 ? 'energy' : 'card',
    attack: node.attack,
    health: node.health,
    amount: node.amount,
    cardId: node.card_id,
    cardLevel: node.card_level
  })).sort((a, b) => a.nodeId - b.nodeId)

  return nodeObject.map(node => ({ ...node, active: getNodeStatus(nodeObject, node) }))
}

export async function getBattleState(battle_id) {
  const document = gql`
  {
    entity (id:"${getEntityIdFromKeys([BigInt(battle_id)])}") {
      models {
        ... on darkshuffle_Battle {
          battle_id
          game_id
          node_id
          round
          card_index
          round_energy
          hero_health
          hero_energy
          hero_armor
          hero_burn
          monster_id
          monster_attack
          monster_health
          branch
          deck
        }
        ... on darkshuffle_BattleEffects {
          battle_id
          next_spell_reduction
          next_card_reduction
          free_discard
          damage_immune
        }
      }
    }

    darkshuffleCreatureModels(where:{battle_id:${battle_id}, creature_idNEQ:0}) {
      edges {
        node {
          battle_id
          creature_id
          card_id
          cost
          attack
          health
          shield
          resting_round
        }
      }
    }

    darkshuffleHandCardModels(where:{battle_id:${battle_id}}) {
      edges {
        node {
          battle_id
          hand_card_number
          card_id
          level
        }
      }
    }
  }`

  const res = await request(dojoConfig.toriiUrl, document);
  const result = {
    battle: res?.entity.models[1],
    battleEffects: res?.entity.models[0],
    creatures: res?.darkshuffleCreatureModels?.edges.map(edge => edge.node),
    handCards: res?.darkshuffleHandCardModels?.edges.map(edge => edge.node),
  };
  return result;
}

export async function getLeaderboard(page) {
  let pageSize = 10

  try {
    const document = gql`
    {
      darkshuffleLeaderboardModels (order:{field:SCORE, direction:DESC}, limit:${pageSize}, offset:${pageSize * page}) {
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

    return res?.darkshuffleLeaderboardModels?.edges.map(edge => edge.node)
  } catch (ex) {
    console.log(ex)
  }
}